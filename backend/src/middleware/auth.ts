import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth, StrictAuthProp } from '@clerk/clerk-sdk-node';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export interface AuthRequest extends Request {
    userId?: number;
    userEmail?: string;
    orgId?: number;
    subscriptionStatus?: string;
    auth?: any;
}

/**
 * Clerk authentication middleware.
 * Verifies JWT token from Authorization header using Clerk.
 */
const clerkMiddleware = ClerkExpressRequireAuth({
    jwtKey: process.env.CLERK_JWT_KEY, // Optional, resolves from standard ENV if missing
});

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    clerkMiddleware(req as Request, res, async (err: any) => {
        if (err) {
            console.error('Clerk Auth Validation Error:', err.message);
            return res.status(401).json({
                error: 'Authentication failed',
                message: err.message || 'Invalid token'
            });
        }

        const clerkAuth = (req as any).auth;
        if (!clerkAuth || !clerkAuth.userId) {
            return res.status(401).json({ error: 'Authentication required: Missing Clerk UserId' });
        }

        try {
            // First attempt to find user by clerk_id
            let userResult = await pool.query('SELECT * FROM users WHERE clerk_id = $1', [clerkAuth.userId]);

            // Auto-provision mapping for MVP if the user is not in database yet
            if (userResult.rowCount === 0) {
                const clerkOrgId = clerkAuth.orgId;
                let orgResult;

                if (clerkOrgId) {
                    orgResult = await pool.query('SELECT * FROM orgs WHERE clerk_org_id = $1', [clerkOrgId]);
                    if (orgResult.rowCount === 0) {
                        orgResult = await pool.query(
                            'INSERT INTO orgs (name, clerk_org_id) VALUES ($1, $2) RETURNING *',
                            [`Org ${clerkOrgId.substring(0, 8)}`, clerkOrgId]
                        );
                    }
                } else {
                    orgResult = await pool.query(
                        'INSERT INTO orgs (name, clerk_org_id) VALUES ($1, $2) RETURNING *',
                        [`Personal Org ${clerkAuth.userId.substring(0, 8)}`, `personal_${clerkAuth.userId}`]
                    );
                }

                userResult = await pool.query(
                    'INSERT INTO users (org_id, email, clerk_id, role) VALUES ($1, $2, $3, $4) RETURNING *',
                    [orgResult.rows[0].id, `${clerkAuth.userId}@clerk-provision.local`, clerkAuth.userId, 'admin']
                );
            }

            const user = userResult.rows[0];
            req.userId = user.id;
            req.orgId = user.org_id;

            // Check subscription status
            const subscriptionResult = await pool.query(
                'SELECT subscription_status FROM orgs WHERE id = $1',
                [req.orgId]
            );
            req.subscriptionStatus = subscriptionResult.rows[0]?.subscription_status || 'free';

            next();
        } catch (dbError) {
            console.error('Database Sync Error in Auth:', dbError);
            res.status(500).json({ error: 'Internal server error during DB auth sync' });
        }
    });
};

/**
 * Premium access middleware.
 * Requires a "pro" or "enterprise" subscription.
 */
export const requirePremium = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.subscriptionStatus === 'free') {
        return res.status(402).json({
            error: 'Payment Required',
            message: 'This feature (Advanced Agents/Simulations) is only available on Pro or Enterprise plans.'
        });
    }
    next();
};

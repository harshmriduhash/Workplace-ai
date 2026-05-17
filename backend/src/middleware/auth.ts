import { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';

let _pool: Pool | null = null;
function getPool(): Pool {
    if (!_pool) {
        _pool = new Pool({
            connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/workplace_ai'
        });
    }
    return _pool;
}

export interface AuthRequest extends Request {
    userId?: number;
    userEmail?: string;
    orgId?: number;
    subscriptionStatus?: string;
    auth?: any;
}

// Detect if Clerk keys are properly configured
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const hasValidClerkKey = clerkSecretKey && clerkSecretKey.startsWith('sk_') && !clerkSecretKey.includes('your-clerk');

let clerkMiddleware: any = null;
if (hasValidClerkKey) {
    try {
        const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
        clerkMiddleware = ClerkExpressRequireAuth({
            jwtKey: process.env.CLERK_JWT_KEY,
        });
        console.log('✅ Clerk authentication middleware initialized');
    } catch (e: any) {
        console.warn('⚠️  Clerk SDK failed to initialize:', e.message);
        console.warn('⚠️  Falling back to demo-mode authentication');
    }
} else {
    console.warn('⚠️  CLERK_SECRET_KEY not set or invalid – running in demo-mode auth');
}

/**
 * Auto-provision a demo user/org in the database for development.
 */
async function provisionDemoUser(req: AuthRequest): Promise<void> {
    const demoClerkId = 'demo_user_local';
    let userResult = await getPool().query('SELECT * FROM users WHERE clerk_id = $1', [demoClerkId]);

    if (userResult.rowCount === 0) {
        // Upsert the demo org — handle name collision gracefully
        let orgResult = await getPool().query("SELECT * FROM orgs WHERE clerk_org_id = 'demo_org_local'");
        if (orgResult.rowCount === 0) {
            orgResult = await getPool().query(
                "INSERT INTO orgs (name, clerk_org_id) VALUES ('Demo Organization', 'demo_org_local') ON CONFLICT (name) DO UPDATE SET clerk_org_id = 'demo_org_local' RETURNING *"
            );
        }
        // Upsert the demo user
        userResult = await getPool().query(
            "INSERT INTO users (org_id, email, clerk_id, role) VALUES ($1, 'demo@workplace-ai.local', $2, 'admin') ON CONFLICT (clerk_id) DO UPDATE SET org_id = $1 RETURNING *",
            [orgResult.rows[0].id, demoClerkId]
        );
    }

    const user = userResult.rows[0];
    req.userId = user.id;
    req.orgId = user.org_id;

    const subscriptionResult = await getPool().query(
        'SELECT subscription_status FROM orgs WHERE id = $1',
        [req.orgId]
    );
    req.subscriptionStatus = subscriptionResult.rows[0]?.subscription_status || 'free';
}

/**
 * Provision a Clerk-authenticated user by syncing their identity into the local DB.
 */
async function provisionClerkUser(req: AuthRequest, clerkAuth: any): Promise<void> {
    let userResult = await getPool().query('SELECT * FROM users WHERE clerk_id = $1', [clerkAuth.userId]);

    if (userResult.rowCount === 0) {
        const clerkOrgId = clerkAuth.orgId;
        let orgResult;

        if (clerkOrgId) {
            orgResult = await getPool().query('SELECT * FROM orgs WHERE clerk_org_id = $1', [clerkOrgId]);
            if (orgResult.rowCount === 0) {
                orgResult = await getPool().query(
                    'INSERT INTO orgs (name, clerk_org_id) VALUES ($1, $2) RETURNING *',
                    [`Org ${clerkOrgId.substring(0, 8)}`, clerkOrgId]
                );
            }
        } else {
            orgResult = await getPool().query(
                'INSERT INTO orgs (name, clerk_org_id) VALUES ($1, $2) RETURNING *',
                [`Personal Org ${clerkAuth.userId.substring(0, 8)}`, `personal_${clerkAuth.userId}`]
            );
        }

        userResult = await getPool().query(
            'INSERT INTO users (org_id, email, clerk_id, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [orgResult.rows[0].id, `${clerkAuth.userId}@clerk-provision.local`, clerkAuth.userId, 'admin']
        );
    }

    const user = userResult.rows[0];
    req.userId = user.id;
    req.orgId = user.org_id;

    const subscriptionResult = await getPool().query(
        'SELECT subscription_status FROM orgs WHERE id = $1',
        [req.orgId]
    );
    req.subscriptionStatus = subscriptionResult.rows[0]?.subscription_status || 'free';
}

/**
 * Authentication middleware.
 * Uses Clerk when keys are valid, otherwise falls back to demo-mode.
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    // If Clerk middleware is available, use it
    if (clerkMiddleware) {
        try {
            clerkMiddleware(req as Request, res, async (err: any) => {
                if (err) {
                    console.error('Clerk Auth Error:', err.message || err);
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
                    await provisionClerkUser(req, clerkAuth);
                    next();
                } catch (dbError) {
                    console.error('Database Sync Error in Auth:', dbError);
                    res.status(500).json({ error: 'Internal server error during DB auth sync' });
                }
            });
        } catch (fatalErr: any) {
            // Clerk SDK threw a fatal error (e.g., invalid key at runtime)
            console.error('⚠️  Clerk SDK fatal error, falling back to demo-mode:', fatalErr.message);
            clerkMiddleware = null; // Disable Clerk for future requests
            handleDemoFallback(req, res, next);
        }
    } else {
        // Demo mode — no Clerk
        handleDemoFallback(req, res, next);
    }
};

async function handleDemoFallback(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        await provisionDemoUser(req);
        next();
    } catch (dbError) {
        console.error('Demo Auth Provisioning Error:', dbError);
        res.status(500).json({ error: 'Internal server error during demo auth' });
    }
}

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

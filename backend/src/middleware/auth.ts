import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export interface AuthRequest extends Request {
    userId?: number;
    userEmail?: string;
    orgId?: number;
    subscriptionStatus?: string;
}

/**
 * Strict authentication middleware.
 * Rejects any request without a valid JWT token.
 * Extracts userId and orgId from the token.
 */
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'No bearer token provided in Authorization header'
            });
        }

        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.error('❌ JWT_SECRET not configured in environment');
            return res.status(500).json({ error: 'Internal server configuration error' });
        }

        const decoded = jwt.verify(token, jwtSecret) as {
            userId: number;
            email: string;
            orgId?: number;
        };

        req.userId = decoded.userId;
        req.userEmail = decoded.email;

        // Fetch or verify Org context
        if (decoded.orgId) {
            req.orgId = decoded.orgId;
        } else {
            // Fallback: Get first org for user if not in token
            const orgResult = await pool.query(
                'SELECT org_id FROM users WHERE id = $1 LIMIT 1',
                [req.userId]
            );
            req.orgId = orgResult.rows[0]?.org_id;
        }

        if (!req.orgId) {
            return res.status(403).json({
                error: 'Organization context missing',
                message: 'User is not associated with any organization'
            });
        }

        // Check subscription status
        const subscriptionResult = await pool.query(
            'SELECT subscription_status FROM orgs WHERE id = $1',
            [req.orgId]
        );
        req.subscriptionStatus = subscriptionResult.rows[0]?.subscription_status || 'free';

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: 'Invalid token',
                message: error.message
            });
        }
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
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

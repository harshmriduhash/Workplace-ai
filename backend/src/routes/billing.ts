import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { Pool } from 'pg';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

const router = express.Router();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

/**
 * Create a Stripe Checkout Session for subscription
 */
router.post('/checkout', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const { priceId } = req.body;
        if (!priceId) return res.status(400).json({ error: 'Price ID is required' });

        // Get org details
        const orgResult = await pool.query('SELECT * FROM orgs WHERE id = $1', [req.orgId]);
        const org = orgResult.rows[0];

        // Create or retrieve Stripe Customer
        let customerId = org.stripe_customer_id;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: req.userEmail,
                name: org.name,
                metadata: { orgId: req.orgId!.toString() }
            });
            customerId = customer.id;
            await pool.query('UPDATE orgs SET stripe_customer_id = $1 WHERE id = $2', [customerId, req.orgId]);
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing?success=true`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing?canceled=true`,
            metadata: { orgId: req.orgId!.toString() }
        });

        res.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Stripe Webhook Handler
 * Synchronizes subscription status with our database
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret!);
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
            const subscription = event.data.object as Stripe.Subscription;
            const status = subscription.status === 'active' ? 'pro' : 'free';
            const custId = subscription.customer as string;

            await pool.query(
                'UPDATE orgs SET subscription_status = $1 WHERE stripe_customer_id = $2',
                [status, custId]
            );
            break;
        case 'customer.subscription.deleted':
            const deletedSub = event.data.object as Stripe.Subscription;
            await pool.query(
                'UPDATE orgs SET subscription_status = $1 WHERE stripe_customer_id = $2',
                ['free', deletedSub.customer as string]
            );
            break;
    }

    res.json({ received: true });
});

export default router;

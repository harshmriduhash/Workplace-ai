import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Billing() {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBillingStatus = async () => {
            try {
                const orgId = localStorage.getItem('orgId') || '1';
                const res = await axios.get(`/api/orgs/1`); // Hardcoded for demo, usually from session
                setSubscription(res.data.subscription_status);
            } catch (err) {
                setError('Failed to fetch billing status');
            } finally {
                setLoading(false);
            }
        };
        fetchBillingStatus();
    }, []);

    const handleUpgrade = async (plan: 'pro' | 'enterprise') => {
        try {
            const priceId = plan === 'pro' ? 'price_pro_id' : 'price_ent_id'; // Replace with real Stripe Price IDs
            const res = await axios.post('/api/billing/checkout', { priceId });
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (err) {
            alert('Checkout failed. Make sure STRIPE_SECRET_KEY is configured.');
        }
    };

    if (loading) return <div className="loading">Loading billing details...</div>;

    return (
        <div className="billing-page app-container">
            <header className="section-header">
                <h2>Plans & Billing</h2>
                <p style={{ color: 'var(--text-muted)' }}>Manage your AI workforce subscription and usage limits.</p>
            </header>

            <div className="current-status card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="status-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3>Current Plan: <span className="gradient-text" style={{ textTransform: 'uppercase' }}>{subscription || 'STARTER'}</span></h3>
                    <p>Your organization is currently on the {subscription || 'Starter'} plan.</p>
                </div>
                {(subscription === 'free' || !subscription) && (
                    <div className="alert-box warning">
                        ⚠️ You are limited to 3 active agents and basic simulations.
                    </div>
                )}
            </div>

            <div className="grid-3">
                <div className="pricing-card card">
                    <h2>Starter</h2>
                    <div className="price">$0<span>/mo</span></div>
                    <ul>
                        <li>3 Active AI Agents</li>
                        <li>Basic Simulations</li>
                        <li>Limited Governor Rules</li>
                        <li>Community Support</li>
                    </ul>
                    <button className="button button-secondary" disabled>Current Plan</button>
                </div>

                <div className="pricing-card card featured">
                    <div className="badge">Most Popular</div>
                    <h2>Professional</h2>
                    <div className="price">$49<span>/mo</span></div>
                    <ul>
                        <li>Unlimited AI Agents</li>
                        <li>Advanced LLM Simulations</li>
                        <li>Strict Budget Enforcement</li>
                        <li>Priority Support</li>
                    </ul>
                    <button className="button" onClick={() => handleUpgrade('pro')}>Upgrade to Pro</button>
                </div>

                <div className="pricing-card card">
                    <h2>Enterprise</h2>
                    <div className="price">$499<span>/mo</span></div>
                    <ul>
                        <li>Everything in Pro</li>
                        <li>Custom Agent Archetypes</li>
                        <li>SLA & Dedicated Support</li>
                        <li>Advanced Audit Analytics</li>
                    </ul>
                    <button className="button" onClick={() => handleUpgrade('enterprise')}>Contact Sales</button>
                </div>
            </div>

            <style>{`
        .pricing-card { text-align: center; display: flex; flex-direction: column; gap: 20px; transition: transform 0.3s; }
        .pricing-card.featured { border: 2px solid var(--accent); transform: scale(1.05); }
        .pricing-card h2 { font-size: 24px; color: var(--primary); margin: 0; }
        .price { font-size: 48px; font-weight: 800; line-height: 1; margin: 10px 0; }
        .price span { font-size: 16px; color: #6B7280; font-weight: 400; }
        .badge { background: rgba(0, 250, 154, 0.1); color: var(--accent); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; display: inline-block; text-transform: uppercase; margin-bottom: 8px; }
        .pricing-card ul { list-style: none; text-align: left; margin: 0; flex-grow: 1; }
        .pricing-card ul li { padding: 12px 0; font-size: 14px; color: #9CA3AF; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .pricing-card ul li:last-child { border-bottom: none; }
        .pricing-card ul li:before { content: "✓ "; color: var(--success); font-weight: 800; margin-right: 8px; }
        .alert-box { padding: 16px; border-radius: 8px; font-size: 14px; }
        .alert-box.warning { background: rgba(245, 158, 11, 0.1); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.2); }
      `}</style>
        </div>
    );
}

import { useState } from 'react';

const PLANS = [
    {
        name: 'Starter',
        price: 0,
        period: '/mo',
        badge: null,
        color: 'var(--text-muted)',
        features: [
            '3 Active AI Agents',
            '500 tasks / month',
            'Basic Governor Rules',
            'Community Support',
            '7-day log retention',
        ],
        cta: 'Current Plan',
        ctaDisabled: true,
        highlight: false,
    },
    {
        name: 'Professional',
        price: 49,
        period: '/mo',
        badge: 'Most Popular',
        color: '#00E5FF',
        features: [
            'Unlimited AI Agents',
            '25,000 tasks / month',
            'Advanced LLM Simulations',
            'Strict Budget Enforcement',
            'Priority Support (4h SLA)',
            '90-day log retention',
        ],
        cta: 'Upgrade to Pro',
        ctaDisabled: false,
        highlight: true,
    },
    {
        name: 'Enterprise',
        price: 499,
        period: '/mo',
        badge: null,
        color: '#F59E0B',
        features: [
            'Everything in Pro',
            'Unlimited tasks',
            'Custom Agent Archetypes',
            'Dedicated Slack channel',
            'SLA with 99.9% uptime',
            'SOC 2 Type II audit logs',
        ],
        cta: 'Contact Sales',
        ctaDisabled: false,
        highlight: false,
    },
];

const INVOICES = [
    { id: 'INV-2026-005', date: 'May 1, 2026', amount: '$0.00', status: 'Free', plan: 'Starter' },
    { id: 'INV-2026-004', date: 'Apr 1, 2026', amount: '$0.00', status: 'Free', plan: 'Starter' },
];

export default function Billing() {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async (plan: string) => {
        setLoading(true);
        setTimeout(() => {
            alert(`Stripe checkout for "${plan}" plan would open here. Configure STRIPE_SECRET_KEY in backend to enable.`);
            setLoading(false);
        }, 800);
    };

    return (
        <div style={{ padding: '0 0 80px' }}>
            {/* Header */}
            <div style={{ marginBottom: '36px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>Plans & Billing</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Manage your AI workforce subscription and usage limits.</p>
            </div>

            {/* Current Plan Banner */}
            <div className="card glass" style={{ padding: '20px 28px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #00E5FF' }}>
                <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Active Plan</div>
                    <div style={{ fontSize: '22px', fontWeight: 800 }}>Starter <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>— 3 agents · 500 tasks/mo</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Next renewal</div>
                    <div style={{ fontWeight: 700 }}>N/A (Free)</div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '40px', alignItems: 'start' }}>
                {PLANS.map(plan => (
                    <div key={plan.name} className="card glass" style={{
                        padding: '28px', display: 'flex', flexDirection: 'column', gap: '0',
                        border: plan.highlight ? '1px solid rgba(0,229,255,0.3)' : '1px solid var(--border-glass)',
                        position: 'relative', overflow: 'hidden',
                        boxShadow: plan.highlight ? '0 0 40px rgba(0,229,255,0.08)' : 'none',
                    }}>
                        {plan.highlight && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,#00E5FF,#00FA9A)' }} />
                        )}
                        {plan.badge && (
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#00FA9A', background: 'rgba(0,250,154,0.1)', border: '1px solid rgba(0,250,154,0.2)', padding: '3px 10px', borderRadius: '99px', display: 'inline-block', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{plan.badge}</div>
                        )}
                        <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px', color: plan.color }}>{plan.name}</div>
                        <div style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1, marginBottom: '20px' }}>
                            ${plan.price}<span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-muted)' }}>{plan.period}</span>
                        </div>
                        <ul style={{ listStyle: 'none', marginBottom: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {plan.features.map(f => (
                                <li key={f} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: '#00FA9A', fontWeight: 800, flexShrink: 0 }}>✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => !plan.ctaDisabled && handleUpgrade(plan.name)}
                            disabled={plan.ctaDisabled || loading}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '14px',
                                cursor: plan.ctaDisabled ? 'default' : 'pointer', border: 'none', transition: 'all 0.2s',
                                background: plan.ctaDisabled ? 'rgba(255,255,255,0.04)' : plan.highlight ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                                color: plan.ctaDisabled ? 'var(--text-muted)' : plan.highlight ? '#000' : 'white',
                                boxShadow: plan.highlight && !plan.ctaDisabled ? '0 0 20px rgba(0,229,255,0.2)' : 'none',
                            }}
                        >{plan.cta}</button>
                    </div>
                ))}
            </div>

            {/* Invoice History */}
            <div className="card glass" style={{ padding: '28px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Invoice History</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                            {['Invoice', 'Date', 'Plan', 'Amount', 'Status', ''].map(h => (
                                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {INVOICES.map(inv => (
                            <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{inv.id}</td>
                                <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{inv.date}</td>
                                <td style={{ padding: '14px 16px' }}>{inv.plan}</td>
                                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{inv.amount}</td>
                                <td style={{ padding: '14px 16px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#00FA9A', background: 'rgba(0,250,154,0.1)', padding: '3px 8px', borderRadius: '99px' }}>{inv.status}</span>
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                    <button style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Download</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { AppContext } from '../App';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/agents', label: 'Agents' },
    { path: '/simulations', label: 'Simulations' },
    { path: '/deployments', label: 'Deployments' },
    { path: '/governor', label: 'Governor' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/billing', label: 'Billing' },
];

export const AppNavbar = () => {
    const { isDemo } = useContext(AppContext);
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar glass" style={{ maxWidth: '100%', margin: '0 0 30px 0', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0' }}>
                {/* Brand */}
                <div className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <Link to="/" className="logo-link" style={{ textDecoration: 'none' }}>
                        <span className="logo-text">Workplace<span className="gradient-text">-AI</span></span>
                    </Link>
                    {isDemo && (
                        <span style={{
                            fontSize: '10px', fontWeight: 700, color: '#00E5FF',
                            background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)',
                            padding: '2px 8px', borderRadius: '99px', letterSpacing: '0.5px', textTransform: 'uppercase'
                        }}>Demo</span>
                    )}
                </div>

                {/* Nav Links */}
                <ul className="nav-links" style={{ margin: '0 24px' }}>
                    {NAV_ITEMS.map(({ path, label }) => (
                        <li key={path}>
                            <Link to={path} className={isActive(path)}>{label}</Link>
                        </li>
                    ))}
                </ul>

                {/* Auth / Demo Badge */}
                <div className="navbar-auth" style={{ flexShrink: 0 }}>
                    {!isDemo && (
                        <SignedIn>
                            <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-10 h-10' } }} />
                        </SignedIn>
                    )}
                    {isDemo && (
                        <Link to="/dashboard" style={{
                            fontSize: '13px', fontWeight: 700, color: '#000',
                            background: '#00E5FF', padding: '7px 16px',
                            borderRadius: '8px', textDecoration: 'none',
                            boxShadow: '0 0 15px rgba(0,229,255,0.3)',
                            transition: 'all 0.2s'
                        }}>Console →</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

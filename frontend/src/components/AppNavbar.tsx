import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { AppContext } from '../App';

export const AppNavbar = () => {
    const { isDemo } = useContext(AppContext);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar glass">
            <div className="navbar-brand">
                <Link to="/" className="logo-link">
                    <span className="logo-text">Workplace<span className="gradient-text">-AI</span></span>
                </Link>
                {isDemo && <span className="demo-badge">Demo Mode</span>}
            </div>

            <ul className="nav-links">
                <li><Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link></li>
                <li><Link to="/agents" className={isActive('/agents')}>Agents</Link></li>
                <li><Link to="/simulations" className={isActive('/simulations')}>Simulations</Link></li>
                <li><Link to="/deployments" className={isActive('/deployments')}>Deployments</Link></li>
                <li><Link to="/governor" className={isActive('/governor')}>Governor</Link></li>
                <li className="desktop-only"><Link to="/analytics" className={isActive('/analytics')}>Analytics</Link></li>
                <li className="desktop-only"><Link to="/billing" className={isActive('/billing')}>Billing</Link></li>
            </ul>

            <div className="navbar-auth">
                {!isDemo && (
                    <SignedIn>
                        <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-10 h-10' } }} />
                    </SignedIn>
                )}
                {isDemo && (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Demo Account</span>
                )}
            </div>
        </nav>
    );
};

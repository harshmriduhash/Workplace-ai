import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { AppContext } from '../App';
import { PulseLoader } from '../components/PulseLoader';

export default function LandingPage({ forceAuthOverlay = false }) {
  const navigate = useNavigate();
  const { isDemo } = useContext(AppContext);

  const renderNavButtons = () => {
    if (isDemo) {
      return (
        <button className="btn-small glass" onClick={() => navigate('/dashboard')}>Launch Console (Demo)</button>
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <SignedIn>
          <button className="btn-small glass" onClick={() => navigate('/dashboard')}>Console</button>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn-small glass">Login</button>
          </SignInButton>
        </SignedOut>
      </div>
    );
  };

  return (
    <div className="landing-page">
      {/* Auth Overlay triggered by ProtectedRoute */}
      {forceAuthOverlay && (
        <div className="auth-overlay">
          <div className="auth-card card glass">
            <div style={{ marginBottom: '20px' }}><PulseLoader size="16px" /></div>
            <h2>Member Access Required</h2>
            <p>Please sign in with your enterprise account to access AI workforce simulations and analytics.</p>
            <SignInButton mode="modal">
              <button className="button" style={{ width: '100%' }}>Sign In to Dashboard</button>
            </SignInButton>
            <button className="button button-secondary" style={{ width: '100%', marginTop: '12px' }} onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      )}

      <header className="navbar glass" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div className="navbar-brand">
          <span className="logo-text">Workplace<span className="gradient-text">-AI</span></span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          {renderNavButtons()}
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <div className="badge">PRODUCTION READY</div>
          <h1>The Operating System for your <span className="gradient-text">AI Workforce</span></h1>
          <p>Deploy, simulate, and govern autonomous agents with enterprise-grade reliability. Control costs and maximize ROI in one central console.</p>

          <div className="hero-cta">
            {isDemo ? (
              <button className="primary-btn pulse" onClick={() => navigate('/dashboard')}>Explore Demo console</button>
            ) : (
              <>
                <SignedIn>
                  <button className="primary-btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                </SignedIn>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="primary-btn">Get Started — It's Free</button>
                  </SignUpButton>
                  <button className="secondary-btn" onClick={() => navigate('/dashboard')}>Watch Preview</button>
                </SignedOut>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-img-container card glass">
            <img src="/ai_workforce_operating_system_hero.png" alt="AI Hero" className="floating-img" />
          </div>
          <div className="glow-effect"></div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Scale with <span className="gradient-text">Assurance</span></h2>
          <p>Advanced governance for the next generation of digital labor.</p>
        </div>

        <div className="grid-3">
          <div className="card glass">
            <div className="icon">🛡️</div>
            <h3>Pre-Launch Simulation</h3>
            <p>Test agents against historical datasets to predict costs and latency before they touch production.</p>
          </div>
          <div className="card glass">
            <div className="icon">⚖️</div>
            <h3>Agent Governor</h3>
            <p>Enforce strict budget caps and rate limits at the API level. Control your spending automatically.</p>
          </div>
          <div className="card glass">
            <div className="icon">📊</div>
            <h3>ROI Analytics</h3>
            <p>Real-time dashboards tracking task success rates, average latency, and cost-per-outcome.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 Workplace-AI Inc. Built for the era of Autonomy.</p>
      </footer>

      <style>{`
        .landing-page { min-height: 100vh; background: var(--bg-deep); }
        .hero-section { display: flex; align-items: center; padding: 100px 40px; max-width: 1280px; margin: 0 auto; gap: 60px; }
        .hero-content { flex: 1; }
        .hero-content h1 { font-size: 64px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; }
        .hero-content p { font-size: 20px; color: var(--text-muted); margin-bottom: 40px; }
        .badge { background: rgba(59, 130, 246, 0.1); color: var(--primary); padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 800; margin-bottom: 20px; display: inline-block; }
        
        .hero-cta { display: flex; gap: 16px; }
        .primary-btn { background: var(--primary); color: white; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; cursor: pointer; transition: all 0.2s; }
        .primary-btn:hover { background: var(--primary-hover); transform: translateY(-2px); }
        .secondary-btn { background: rgba(255,255,255,0.05); color: white; border: 1px solid var(--border-glass); padding: 16px 32px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        
        .hero-visual { flex: 1; position: relative; }
        .floating-img { width: 100%; border-radius: 12px; }
        .glow-effect { position: absolute; width: 150%; height: 150%; top: -25%; left: -25%; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%); pointer-events: none; z-index: -1; }
        
        .features-section { padding: 100px 40px; max-width: 1280px; margin: 0 auto; }
        .section-header { text-align: center; margin-bottom: 60px; }
        .section-header h2 { font-size: 40px; font-weight: 800; }
        
        .icon { font-size: 32px; margin-bottom: 16px; }
        .card h3 { margin-bottom: 12px; font-size: 20px; }
        .card p { color: var(--text-muted); line-height: 1.5; }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
}

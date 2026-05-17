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
        <button className="button button-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => navigate('/dashboard')}>Launch Console (Demo)</button>
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <SignedIn>
          <button className="button button-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => navigate('/dashboard')}>Console</button>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" redirectUrl="/dashboard" afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
            <button className="button button-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Login</button>
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
            <SignInButton mode="modal" redirectUrl="/dashboard" afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
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
                  <SignUpButton mode="modal" redirectUrl="/dashboard" afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
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
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo-text">Workplace<span className="gradient-text">-AI</span></span>
            <p>Deploy, simulate, and govern autonomous agents with enterprise-grade reliability in one central console.</p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <a href="#">Agent Marketplace</a>
            <a href="#">Simulations</a>
            <a href="#">Governor API</a>
            <a href="#">Pricing</a>
          </div>
          <div className="footer-links">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Blog</a>
            <a href="#">Community</a>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Workplace-AI Inc. Built for the era of Autonomy.</p>
        </div>
      </footer>

      <style>{`
        .landing-page { min-height: 100vh; background: var(--bg-deep); }
        .hero-section { display: flex; align-items: center; padding: 60px 40px; max-width: 1280px; margin: 0 auto; gap: 40px; }
        .hero-content { flex: 1; }
        .hero-content h1 { font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; letter-spacing: -1px; }
        .hero-content p { font-size: 18px; color: var(--text-muted); margin-bottom: 40px; line-height: 1.6; }
        .badge { background: rgba(0, 229, 255, 0.1); color: var(--primary); padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 800; margin-bottom: 24px; display: inline-block; border: 1px solid rgba(0, 229, 255, 0.2); }
        
        .hero-cta { display: flex; gap: 16px; flex-wrap: wrap; }
        .primary-btn { background: var(--primary); color: #000; border: none; padding: 16px 32px; border-radius: 8px; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 20px rgba(0, 229, 255, 0.2); }
        .primary-btn:hover { background: var(--primary-hover); transform: translateY(-2px); box-shadow: 0 0 30px rgba(0, 229, 255, 0.4); }
        .secondary-btn { background: rgba(255,255,255,0.02); color: white; border: 1px solid var(--border-glass); padding: 16px 32px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .secondary-btn:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); }
        
        .hero-visual { flex: 1.2; position: relative; }
        .floating-img-container { padding: 8px; border-radius: 16px; background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0)); }
        .floating-img { width: 100%; border-radius: 12px; display: block; border: 1px solid rgba(255,255,255,0.05); }
        .glow-effect { position: absolute; width: 120%; height: 120%; top: -10%; left: -10%; background: radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 60%); pointer-events: none; z-index: -1; }
        
        .features-section { padding: 80px 40px; max-width: 1280px; margin: 0 auto; border-top: 1px solid var(--border-glass); }
        .section-header { text-align: center; margin-bottom: 50px; }
        .section-header h2 { font-size: 36px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 15px; }
        
        .icon { font-size: 36px; margin-bottom: 20px; }
        .card h3 { margin-bottom: 12px; font-size: 20px; font-weight: 700; }
        .card p { color: var(--text-muted); line-height: 1.6; }

        /* Footer Styling */
        .landing-footer { border-top: 1px solid var(--border-glass); background: #000; padding: 60px 40px 20px; margin-top: 60px; }
        .footer-grid { max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px; padding-bottom: 40px; }
        .footer-brand { flex: 2; min-width: 300px; }
        .footer-brand p { color: var(--text-muted); margin-top: 15px; line-height: 1.6; font-size: 14px; padding-right: 40px; }
        .footer-links { flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 150px; }
        .footer-links h4 { font-size: 14px; font-weight: 700; color: white; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .footer-links a { font-size: 14px; color: var(--text-muted); transition: color 0.2s; }
        .footer-links a:hover { color: var(--primary); }
        .footer-bottom { max-width: 1280px; margin: 0 auto; padding-top: 20px; border-top: 1px solid var(--border-glass); text-align: center; font-size: 12px; color: #52525B; }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(0, 229, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); }
        }
        .pulse { animation: pulse 2s infinite; }

        /* Responsive Improvements */
        @media (max-width: 1024px) {
          .hero-section { flex-direction: column; text-align: center; padding: 40px 20px; }
          .hero-cta { justify-content: center; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px 20px; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; }
          .hero-content h1 { font-size: 40px; }
        }
      `}</style>
    </div>
  );
}

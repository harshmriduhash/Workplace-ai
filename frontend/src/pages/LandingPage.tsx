import React from 'react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="mini-nav">
        <div className="logo">Workplace-AI</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <button className="btn-small" onClick={() => window.location.href = '/dashboard'}>Launch Console</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="badge">Beta Now Open</div>
          <h1>The Operating System for your <span className="gradient-text">AI Workforce</span></h1>
          <p>Deploy, simulate, and govern autonomous agents with enterprise-grade reliability. Control costs and maximize ROI in one central console.</p>
          <div className="hero-cta">
            <button className="primary-btn" onClick={() => window.location.href = '/dashboard'}>Start Building</button>
            <button className="secondary-btn">Watch Demo</button>
          </div>
        </div>
        <div className="hero-visual">
          <img src="/ai_workforce_operating_system_hero.png" alt="AI Workforce Visual" className="floating-img" />
          <div className="glow-effect"></div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Everything you need to <span className="gradient-text">scale labor</span></h2>
          <p>Stop experimenting. Start operating your AI workforce like professional infrastructure.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">🛡️</div>
            <h3>Pre-Launch Simulation</h3>
            <p>Test agents against historical datasets to predict costs and latency before they touch production.</p>
          </div>
          <div className="feature-card">
            <div className="icon">⚖️</div>
            <h3>Agent Governor</h3>
            <p>Enforce strict budget caps and rate limits at the API level. Never wake up to an unexpected OpenAI bill.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📋</div>
            <h3>Enterprise Compliance</h3>
            <p>End-to-end audit logs, GDPR data tools, and scoped permissions out of the box.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>ROI Analytics</h3>
            <p>Real-time dashboards tracking task success rates, average latency, and cost-per-outcome.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 Workplace-AI Inc. Built for the future of work.</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        .landing-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #0B0F19;
          color: #FFFFFF;
          min-height: 100vh;
        }

        .gradient-text {
          background: linear-gradient(90deg, #60A5FA, #34D399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .mini-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 80px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo { font-weight: 800; fontSize: 22px; letter-spacing: -1px; }
        .mini-nav .nav-links { display: flex; align-items: center; gap: 32px; }
        .mini-nav a { color: #94A3B8; font-weight: 600; font-size: 14px; transition: color 0.2s; }
        .mini-nav a:hover { color: #FFFFFF; }

        .btn-small {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 8px 20px;
          border-radius: 99px;
          font-weight: 600;
          font-size: 13px;
        }

        .hero-section {
          display: flex;
          align-items: center;
          padding: 80px 80px 120px;
          max-width: 1400px;
          margin: 0 auto;
          gap: 60px;
        }

        .hero-content { flex: 1; }
        .badge { display: inline-block; background: rgba(59, 130, 246, 0.1); color: #60A5FA; padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: 700; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }
        .hero-content h1 { font-size: 64px; line-height: 1.1; font-weight: 800; margin-bottom: 24px; letter-spacing: -2px; }
        .hero-content p { font-size: 20px; color: #94A3B8; line-height: 1.6; margin-bottom: 40px; max-width: 580px; }

        .hero-cta { display: flex; gap: 16px; }
        .primary-btn { background: #3B82F6; color: white; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; transition: transform 0.2s; }
        .primary-btn:hover { transform: translateY(-2px); background: #2563EB; }
        .secondary-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; cursor: pointer; }

        .hero-visual { flex: 1; position: relative; }
        .floating-img { width: 100%; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); animation: float 6s ease-in-out infinite; border: 1px solid rgba(255,255,255,0.1); }
        .glow-effect { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 140%; height: 140%; background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%); z-index: -1; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .features-section { padding: 120px 80px; max-width: 1400px; margin: 0 auto; border-top: 1px solid rgba(255,255,255,0.05); }
        .section-header { text-align: center; margin-bottom: 80px; }
        .section-header h2 { font-size: 40px; font-weight: 800; margin-bottom: 16px; letter-spacing: -1px; }
        .section-header p { color: #94A3B8; font-size: 18px; }

        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
        .feature-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 40px; border-radius: 24px; transition: border-color 0.3s; }
        .feature-card:hover { border-color: rgba(59, 130, 246, 0.4); }
        .feature-card .icon { font-size: 32px; margin-bottom: 24px; }
        .feature-card h3 { font-size: 22px; font-weight: 700; margin-bottom: 16px; }
        .feature-card p { color: #94A3B8; line-height: 1.6; }

        .landing-footer { text-align: center; padding: 60px; color: #475569; font-size: 14px; border-top: 1px solid rgba(255,255,255,0.05); }

        @media (max-width: 1024px) {
          .hero-section { flex-direction: column; text-align: center; padding: 40px 20px; }
          .hero-content p { margin-left: auto; margin-right: auto; }
          .hero-cta { justify-content: center; }
          .features-grid { grid-template-columns: 1fr; }
          .mini-nav { padding: 24px 20px; }
        }
      `}</style>
    </div>
  );
}

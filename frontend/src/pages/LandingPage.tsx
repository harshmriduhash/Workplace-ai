import React from 'react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero">
        <h1>Hire AI Agents. Govern Them Like Infrastructure.</h1>
        <p>Workplace-AI gives companies a safe, accountable way to deploy AI labor.</p>
        <div className="button-group">
          <button className="button" onClick={() => window.location.href = '/dashboard'}>
            Start Free Trial
          </button>
          <button className="button button-secondary">Request Demo</button>
        </div>
      </section>

      <section className="how-it-works" style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '60px', fontSize: '32px' }}>How It Works</h2>
        <div className="grid-2">
          <div className="card">
            <div className="step-number">1</div>
            <h3>Hire Agent</h3>
            <p>Choose from pre-configured AI agents for support, sales, research and more.</p>
          </div>
          <div className="card">
            <div className="step-number">2</div>
            <h3>Simulate</h3>
            <p>Test agent performance against historical data before going live.</p>
          </div>
          <div className="card">
            <div className="step-number">3</div>
            <h3>Deploy</h3>
            <p>Deploy agents safely with environment isolation and scoped permissions.</p>
          </div>
          <div className="card">
            <div className="step-number">4</div>
            <h3>Govern</h3>
            <p>Monitor performance, control costs, and rollback safely when needed.</p>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page { min-height: 100vh; background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); }
        .step-number { display: inline-block; background: var(--accent); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; margin-bottom: 12px; }
      `}</style>
    </div>
  );
}

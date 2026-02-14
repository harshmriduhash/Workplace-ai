import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { Shimmer, ShimmerCard } from '../components/Shimmer';
import { PulseLoader } from '../components/PulseLoader';

export default function Dashboard() {
  const { API, orgId } = useContext(AppContext);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mocking dashboard stats for the overhaul preview
        setTimeout(() => {
          setStats({
            activeAgents: 12,
            totalTasks: 1245,
            avgAccuracy: 94.2,
            monthlySpend: 420.50
          });
          setLoading(false);
        }, 1500);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1>Organization Overview</h1>
          {loading && <PulseLoader size="10px" color="var(--primary)" />}
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Real-time coordination and governance metrics for your AI workforce.</p>
      </header>

      <div className="grid-3" style={{ marginBottom: '40px' }}>
        {loading ? (
          <>
            <Shimmer height="120px" borderRadius="16px" />
            <Shimmer height="120px" borderRadius="16px" />
            <Shimmer height="120px" borderRadius="16px" />
          </>
        ) : (
          <>
            <div className="card glass stat-card">
              <span className="stat-label">Active Agents</span>
              <span className="stat-value gradient-text">{stats.activeAgents}</span>
            </div>
            <div className="card glass stat-card">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{stats.totalTasks.toLocaleString()}</span>
            </div>
            <div className="card glass stat-card">
              <span className="stat-label">Avg. Accuracy</span>
              <span className="stat-value" style={{ color: 'var(--success)' }}>{stats.avgAccuracy}%</span>
            </div>
          </>
        )}
      </div>

      <div className="main-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <section className="recent-activity">
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Recent Agent Activity</h3>
            <button className="button button-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              [1, 2, 3].map(i => <Shimmer key={i} height="80px" borderRadius="12px" />)
            ) : (
              <div className="card glass" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <img src="/pulse_placeholder.png" style={{ width: '40px', opacity: 0.2, marginBottom: '15px' }} />
                <p>No recent tasks. Deploy an agent to start monitoring activity.</p>
              </div>
            )}
          </div>
        </section>

        <section className="governor-summary">
          <h3>Governor Status</h3>
          <div className="card glass" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '14px' }}>Monthly Budget</span>
              <span style={{ fontWeight: 800 }}>$1,000.00</span>
            </div>
            <div className="budget-bar" style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
              <div className="fill" style={{ width: '42%', height: '100%', background: 'var(--primary)' }}></div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>42% of monthly cap reached. No active alerts.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

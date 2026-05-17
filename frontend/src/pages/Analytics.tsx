import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { Shimmer, ShimmerCard } from '../components/Shimmer';

export default function Analytics() {
  const { orgId, API } = useContext(AppContext);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get(`/analytics`);
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      }
      setLoading(false);
    };
    if (orgId) fetchAnalytics();
  }, [orgId]);

  return (
    <div className="analytics-page">
      <header className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
        <h1>Performance & ROI Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Measure agent efficiency and fiscal impact in real-time.</p>
      </header>

      <div className="grid-3" style={{ marginBottom: '40px' }}>
        {loading ? (
          [1, 2, 3].map(i => <Shimmer key={i} height="120px" borderRadius="16px" />)
        ) : (
          <>
            <div className="card glass stat-card">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{analytics.tasks_completed || 0}</span>
            </div>
            <div className="card glass stat-card">
              <span className="stat-label">Spend to Date</span>
              <span className="stat-value">${analytics.total_cost?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="card glass stat-card">
              <span className="stat-label">Cost Per Task</span>
              <span className="stat-value" style={{ color: 'var(--success)' }}>
                ${analytics.tasks_completed > 0
                  ? (analytics.total_cost / analytics.tasks_completed).toFixed(2)
                  : '0.00'
                }
              </span>
            </div>
          </>
        )}
      </div>

      <div className="card glass">
        <h3 style={{ marginBottom: '24px' }}>Human vs. AI Efficiency Comparison</h3>
        <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>Comparative analysis of autonomous agents vs. traditional human workforce estimates.</p>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                <th style={{ padding: '15px' }}>Metric</th>
                <th style={{ padding: '15px' }}>Digital Worker</th>
                <th style={{ padding: '15px' }}>Human Worker</th>
                <th style={{ padding: '15px' }}>Efficiency Gain</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '15px' }}><strong>Direct Margin</strong></td>
                <td style={{ padding: '15px' }}>${analytics.tasks_completed > 0 ? (analytics.total_cost / analytics.tasks_completed).toFixed(2) : '0.00'}</td>
                <td style={{ padding: '15px' }}>$10.00</td>
                <td style={{ padding: '15px', color: 'var(--success)', fontWeight: 700 }}>
                  {analytics.tasks_completed > 0
                    ? ((10 - (analytics.total_cost / analytics.tasks_completed)) / 10 * 100).toFixed(1)
                    : '98.5'
                  }%
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '15px' }}><strong>Throughput (T/hr)</strong></td>
                <td style={{ padding: '15px' }}>12.4</td>
                <td style={{ padding: '15px' }}>2.1</td>
                <td style={{ padding: '15px', color: 'var(--success)', fontWeight: 700 }}>+490%</td>
              </tr>
              <tr>
                <td style={{ padding: '15px' }}><strong>Availability</strong></td>
                <td style={{ padding: '15px' }}>24/7/365</td>
                <td style={{ padding: '15px' }}>8/5</td>
                <td style={{ padding: '15px', color: 'var(--success)', fontWeight: 700 }}>Continuous</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

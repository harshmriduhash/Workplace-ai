import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';

export default function Analytics() {
  const { orgId, API } = useContext(AppContext);
  const [analytics, setAnalytics] = useState<any>({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get(`/analytics/${orgId}`);
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      }
    };
    if (orgId) fetchAnalytics();
  }, [orgId]);

  return (
    <div>
      <h1>Performance & ROI Analytics</h1>
      <p style={{ color: '#6B7280', marginBottom: '30px' }}>Measure agent performance and ROI vs human work.</p>

      <div className="grid-3">
        <div className="card">
          <div className="metric">
            <div className="metric-label">Total Tasks</div>
            <div className="metric-value">{analytics.tasks_completed || 0}</div>
          </div>
        </div>
        <div className="card">
          <div className="metric">
            <div className="metric-label">Total Cost</div>
            <div className="metric-value">${analytics.total_cost?.toFixed(2) || '0.00'}</div>
          </div>
        </div>
        <div className="card">
          <div className="metric">
            <div className="metric-label">Cost Per Task</div>
            <div className="metric-value">
              ${analytics.tasks_completed > 0
                ? (analytics.total_cost / analytics.tasks_completed).toFixed(2)
                : '0.00'
              }
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>ROI Comparison</h2>
        <p style={{ marginBottom: '20px', color: '#6B7280' }}>AI agents vs human workers (estimated)</p>
        <table className="table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>AI Agents</th>
              <th>Human Workers</th>
              <th>Savings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Cost per Task</strong></td>
              <td>${analytics.tasks_completed > 0 ? (analytics.total_cost / analytics.tasks_completed).toFixed(2) : '0.00'}</td>
              <td>$10.00</td>
              <td className="success">
                {analytics.tasks_completed > 0
                  ? ((10 - (analytics.total_cost / analytics.tasks_completed)) / 10 * 100).toFixed(1)
                  : '0'
                }%
              </td>
            </tr>
            <tr>
              <td><strong>Tasks/Hour</strong></td>
              <td>10</td>
              <td>3</td>
              <td className="success">233%</td>
            </tr>
            <tr>
              <td><strong>24/7 Availability</strong></td>
              <td>✓</td>
              <td>✗</td>
              <td className="success">Always on</td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        .success { color: var(--success); font-weight: 600; }
      `}</style>
    </div>
  );
}

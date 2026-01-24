import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';

export default function Dashboard() {
  const { orgId, API } = useContext(AppContext);
  const [analytics, setAnalytics] = useState<any>({});
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, agentsRes] = await Promise.all([
          API.get(`/analytics/${orgId}`),
          API.get(`/agents/${orgId}`)
        ]);
        setAnalytics(analyticsRes.data);
        setAgents(agentsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      }
      setLoading(false);
    };

    if (orgId) fetchData();
  }, [orgId]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="grid-3">
        <div className="card">
          <div className="metric">
            <div className="metric-label">Active Agents</div>
            <div className="metric-value">{analytics.active_agents || 0}</div>
          </div>
        </div>
        <div className="card">
          <div className="metric">
            <div className="metric-label">Tasks Completed</div>
            <div className="metric-value">{analytics.tasks_completed || 0}</div>
          </div>
        </div>
        <div className="card">
          <div className="metric">
            <div className="metric-label">Total Cost</div>
            <div className="metric-value">${analytics.total_cost?.toFixed(2) || '0.00'}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Agents</h2>
        {agents.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Role</th>
                <th>Status</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent: any) => (
                <tr key={agent.id}>
                  <td><strong>{agent.name}</strong></td>
                  <td>{agent.role}</td>
                  <td><span className={`status-badge status-${agent.status}`}>{agent.status}</span></td>
                  <td>${agent.cost_per_task}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ padding: '20px', color: '#6B7280' }}>No agents hired yet. Go to Agents to get started.</p>
        )}
      </div>
    </div>
  );
}

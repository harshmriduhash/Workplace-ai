import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { ShimmerCard } from '../components/Shimmer';
import { PulseLoader } from '../components/PulseLoader';

export default function Deployments() {
  const { orgId, API } = useContext(AppContext);
  const [agents, setAgents] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [deploying, setDeploying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, deploymentsRes] = await Promise.all([
          API.get(`/agents/${orgId}`),
          API.get(`/deployments/${orgId}`)
        ]);
        setAgents(agentsRes.data || []);
        setDeployments(deploymentsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
      setLoading(false);
    };
    if (orgId) fetchData();
  }, [orgId]);

  const handleDeploy = async () => {
    if (!selectedAgent) return;
    setDeploying(true);
    try {
      await API.post('/deployments', {
        org_id: orgId,
        agent_id: parseInt(selectedAgent),
        environment: 'email'
      });
      const res = await API.get(`/deployments/${orgId}`);
      setDeployments(res.data || []);
    } catch (err) {
      console.error('Failed to deploy:', err);
    }
    setDeploying(false);
  };

  return (
    <div className="deployments-page">
      <header className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
        <h1>Live Deployments</h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitor and scale your AI workforce across production environments.</p>
      </header>

      <div className="grid-2" style={{ marginBottom: '30px' }}>
        <div className="card glass">
          <h3 style={{ marginBottom: '20px' }}>Deploy New Agent</h3>
          <div className="form-group">
            <label>Select Agent to Activate</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              <option value="">-- Choose an agent --</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
          <button
            className="button"
            onClick={handleDeploy}
            disabled={deploying || !selectedAgent}
            style={{ width: '100%' }}
          >
            {deploying ? <PulseLoader size="8px" color="white" /> : 'Activate Deployment'}
          </button>
        </div>

        <div className="card glass" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h3 style={{ marginBottom: '10px' }}>Environment Pulse</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--success)', fontWeight: 700 }}>
            <PulseLoader size="8px" color="var(--success)" />
            PRODUCTION (Active)
          </div>
          <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>All systems operational. Edge latency at 42ms.</p>
        </div>
      </div>

      <div className="card glass">
        <h3 style={{ marginBottom: '20px' }}>Active Workforce Fleet</h3>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ShimmerCard />
          </div>
        ) : deployments.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '15px' }}>Agent ID</th>
                  <th style={{ padding: '15px' }}>Runtime</th>
                  <th style={{ padding: '15px' }}>Version</th>
                  <th style={{ padding: '15px' }}>Status</th>
                  <th style={{ padding: '15px' }}>Deployment Date</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((dep) => (
                  <tr key={dep.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '15px' }}>#{dep.agent_id}</td>
                    <td style={{ padding: '15px' }}><code>{dep.environment.toUpperCase()}</code></td>
                    <td style={{ padding: '15px' }}>v{dep.version}</td>
                    <td style={{ padding: '15px' }}>
                      <span className={`badge status-${dep.status}`} style={{ margin: 0 }}>
                        {dep.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(dep.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No active deployments. Select an agent above to start your AI workforce.</p>
          </div>
        )}
      </div>
    </div>
  );
}

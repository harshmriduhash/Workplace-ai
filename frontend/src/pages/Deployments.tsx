import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';

export default function Deployments() {
  const { orgId, API } = useContext(AppContext);
  const [agents, setAgents] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [deploying, setDeploying] = useState(false);

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
    };
    if (orgId) fetchData();
  }, [orgId]);

  const handleDeploy = async () => {
    if (!selectedAgent) {
      alert('Please select an agent');
      return;
    }
    setDeploying(true);
    try {
      await API.post('/deployments', {
        org_id: orgId,
        agent_id: parseInt(selectedAgent),
        environment: 'email'
      });
      const res = await API.get(`/deployments/${orgId}`);
      setDeployments(res.data || []);
      alert('Agent deployed successfully!');
      setSelectedAgent('');
    } catch (err) {
      console.error('Failed to deploy:', err);
    }
    setDeploying(false);
  };

  return (
    <div>
      <h1>Live Deployments</h1>
      <p style={{ color: '#6B7280', marginBottom: '30px' }}>Deploy agents to production with environment isolation and scoped permissions.</p>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>Deploy New Agent</h2>
        <div className="form-group">
          <label>Select Agent to Deploy</label>
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
        >
          {deploying ? 'Deploying...' : 'Deploy Agent'}
        </button>
      </div>

      <div className="card">
        <h2>Active Deployments</h2>
        {deployments.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Environment</th>
                <th>Version</th>
                <th>Status</th>
                <th>Deployed At</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((dep) => (
                <tr key={dep.id}>
                  <td>#{dep.agent_id}</td>
                  <td><code>{dep.environment}</code></td>
                  <td>v{dep.version}</td>
                  <td><span className={`status-badge status-${dep.status}`}>{dep.status}</span></td>
                  <td>{new Date(dep.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ padding: '20px', color: '#6B7280' }}>No active deployments. Deploy an agent to get started.</p>
        )}
      </div>
    </div>
  );
}

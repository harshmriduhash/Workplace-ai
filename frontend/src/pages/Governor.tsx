import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';

export default function Governor() {
  const { orgId, API } = useContext(AppContext);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [rules, setRules] = useState<any>({});
  const [formData, setFormData] = useState({
    budget_cap: 100,
    rate_limit: 1000,
    accuracy_threshold: 80
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await API.get(`/agents/${orgId}`);
        setAgents(res.data || []);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
      }
    };
    if (orgId) fetchAgents();
  }, [orgId]);

  const handleSelectAgent = async (agentId: string) => {
    setSelectedAgent(agentId);
    try {
      const res = await API.get(`/governor/${orgId}/${agentId}`);
      setRules(res.data || {});
    } catch (err) {
      console.error('Failed to fetch rules:', err);
    }
  };

  const handleSaveRules = async () => {
    if (!selectedAgent) {
      alert('Please select an agent');
      return;
    }
    try {
      await API.post('/governor', {
        org_id: orgId,
        agent_id: parseInt(selectedAgent),
        ...formData
      });
      alert('Governor rules saved!');
    } catch (err) {
      console.error('Failed to save rules:', err);
    }
  };

  return (
    <div>
      <h1>Agent Governor</h1>
      <p style={{ color: '#6B7280', marginBottom: '30px' }}>Prevent chaos. Control budget, rate limits, accuracy thresholds, and auto-pause/rollback rules.</p>

      <div className="grid-2">
        <div className="card">
          <h2>Select Agent</h2>
          <div className="form-group">
            <label>Agent</label>
            <select
              value={selectedAgent}
              onChange={(e) => handleSelectAgent(e.target.value)}
            >
              <option value="">-- Choose an agent --</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card">
          <h2>Governor Rules</h2>
          {selectedAgent && (
            <>
              <div className="form-group">
                <label>Budget Cap ($)</label>
                <input
                  type="number"
                  value={formData.budget_cap}
                  onChange={(e) => setFormData({ ...formData, budget_cap: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Rate Limit (tasks/day)</label>
                <input
                  type="number"
                  value={formData.rate_limit}
                  onChange={(e) => setFormData({ ...formData, rate_limit: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Accuracy Threshold (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.accuracy_threshold}
                  onChange={(e) => setFormData({ ...formData, accuracy_threshold: parseInt(e.target.value) })}
                />
              </div>

              <button className="button" onClick={handleSaveRules}>
                Save Rules
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Rules Summary</h2>
        {selectedAgent && Object.keys(rules).length > 0 ? (
          <ul style={{ lineHeight: '2' }}>
            <li>💰 Budget Cap: <strong>${rules.budget_cap}</strong></li>
            <li>📊 Rate Limit: <strong>{rules.rate_limit} tasks/day</strong></li>
            <li>🎯 Accuracy Threshold: <strong>{rules.accuracy_threshold}%</strong></li>
          </ul>
        ) : (
          <p style={{ color: '#6B7280' }}>Select an agent to see or create rules.</p>
        )}
      </div>
    </div>
  );
}

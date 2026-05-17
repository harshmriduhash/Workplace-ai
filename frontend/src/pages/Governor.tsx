import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { PulseLoader } from '../components/PulseLoader';

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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await API.get(`/agents`);
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
      const res = await API.get(`/governor_rules`);
      const rule = res.data.find((r: any) => r.agent_id === parseInt(agentId)) || {};
      setRules(rule);
      if (rule) {
        setFormData({
          budget_cap: rule.budget_cap || 100,
          rate_limit: rule.rate_limit || 1000,
          accuracy_threshold: rule.accuracy_threshold || 80
        });
      }
    } catch (err) {
      console.error('Failed to fetch rules:', err);
    }
  };

  const handleSaveRules = async () => {
    if (!selectedAgent) return;
    setSaving(true);
    try {
      await API.post('/governor_rules', {
        agent_id: parseInt(selectedAgent),
        ...formData
      });
      // Refresh local state
      setRules({ ...formData });
    } catch (err) {
      console.error('Failed to save rules:', err);
    }
    setSaving(false);
  };

  return (
    <div className="governor-page">
      <header className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
        <h1>Agent Governor</h1>
        <p style={{ color: 'var(--text-muted)' }}>Prevent chaos. Control budget, rate limits, and accuracy thresholds automatically.</p>
      </header>

      <div className="grid-2" style={{ marginBottom: '30px' }}>
        <div className="card glass">
          <h3 style={{ marginBottom: '20px' }}>Agent Selection</h3>
          <div className="form-group">
            <label>Target Agent</label>
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
          {!selectedAgent && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Select an agent to configure governance rules.</p>
          )}
        </div>

        <div className="card glass">
          <h3 style={{ marginBottom: '20px' }}>Configure Constraints</h3>
          {selectedAgent ? (
            <>
              <div className="form-group">
                <label>Monthly Budget Cap ($)</label>
                <input
                  type="number"
                  value={formData.budget_cap}
                  onChange={(e) => setFormData({ ...formData, budget_cap: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Daily Rate Limit (tasks)</label>
                <input
                  type="number"
                  value={formData.rate_limit}
                  onChange={(e) => setFormData({ ...formData, rate_limit: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Min. Accuracy Threshold (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.accuracy_threshold}
                  onChange={(e) => setFormData({ ...formData, accuracy_threshold: parseInt(e.target.value) })}
                />
              </div>

              <button className="button" onClick={handleSaveRules} disabled={saving} style={{ width: '100%' }}>
                {saving ? <PulseLoader size="8px" color="white" /> : "Apply Rules"}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-muted)' }}>
              Ready to configure...
            </div>
          )}
        </div>
      </div>

      {selectedAgent && (
        <div className="card glass" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '20px' }}>Active Governance Summary</h3>
          <div className="grid-3">
            <div className="stat-card">
              <span className="stat-label">Budget</span>
              <span className="stat-value">${rules.budget_cap || formData.budget_cap}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Rate Limit</span>
              <span className="stat-value">{rules.rate_limit || formData.rate_limit}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value" style={{ color: 'var(--success)' }}>{rules.accuracy_threshold || formData.accuracy_threshold}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

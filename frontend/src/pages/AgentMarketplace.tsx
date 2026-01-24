import React, { useContext, useState } from 'react';
import { AppContext } from '../App';

const PRESET_AGENTS = [
  {
    name: 'Support Agent',
    role: 'Customer Support',
    description: 'Handles customer inquiries, resolves tickets, and provides support 24/7',
    tools: ['email', 'knowledge_base', 'ticketing'],
    cost_per_task: 0.50
  },
  {
    name: 'Sales SDR',
    role: 'Sales Development',
    description: 'Qualifies leads, schedules meetings, and manages outreach campaigns',
    tools: ['crm', 'email', 'calendar'],
    cost_per_task: 1.25
  },
  {
    name: 'Research Analyst',
    role: 'Market Research',
    description: 'Conducts market research, analyzes competitors, and generates reports',
    tools: ['web_search', 'database', 'report_generator'],
    cost_per_task: 2.00
  }
];

export default function AgentMarketplace() {
  const { orgId, API } = useContext(AppContext);
  const [hired, setHired] = useState<any[]>([]);
  const [hiring, setHiring] = useState(false);

  const handleHireAgent = async (agent: any) => {
    setHiring(true);
    try {
      await API.post('/agents', {
        org_id: orgId,
        name: agent.name,
        role: agent.role,
        description: agent.description,
        tools: agent.tools,
        cost_per_task: agent.cost_per_task
      });
      setHired([...hired, agent.name]);
      alert(`${agent.name} hired successfully!`);
    } catch (err) {
      console.error('Failed to hire agent:', err);
    }
    setHiring(false);
  };

  return (
    <div>
      <h1>Agent Marketplace</h1>
      <p style={{ color: '#6B7280', marginBottom: '30px' }}>Hire AI agents like employees. Each agent is pre-configured with specific tools and responsibilities.</p>

      <div className="grid-3">
        {PRESET_AGENTS.map((agent, idx) => (
          <div key={idx} className="agent-card">
            <h3>{agent.name}</h3>
            <p style={{ marginBottom: '12px' }}><strong>{agent.role}</strong></p>
            <p>{agent.description}</p>
            <div className="meta">
              <div className="cost">${agent.cost_per_task.toFixed(2)}/task</div>
              <button
                className="button"
                onClick={() => handleHireAgent(agent)}
                disabled={hiring || hired.includes(agent.name)}
              >
                {hired.includes(agent.name) ? 'Hired' : 'Hire Agent'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

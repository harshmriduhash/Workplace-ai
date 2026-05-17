import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import { ShimmerCard } from "../components/Shimmer";

const PRESET_AGENTS = [
  {
    name: "Support Agent",
    role: "Customer Support",
    description:
      "Handles customer inquiries, resolves tickets, and provides support 24/7",
    tools: ["email", "knowledge_base", "ticketing"],
    cost_per_task: 0.5,
  },
  {
    name: "Sales SDR",
    role: "Sales Development",
    description:
      "Qualifies leads, schedules meetings, and manages outreach campaigns",
    tools: ["crm", "email", "calendar"],
    cost_per_task: 1.25,
  },
  {
    name: "Research Analyst",
    role: "Market Research",
    description:
      "Conducts market research, analyzes competitors, and generates reports",
    tools: ["web_search", "database", "report_generator"],
    cost_per_task: 2.0,
  },
];

export default function AgentMarketplace() {
  const { orgId, API } = useContext(AppContext);
  const [hired, setHired] = useState<any[]>([]);
  const [hiring, setHiring] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHired = async () => {
      try {
        const res = await API.get("/agents");
        setHired(res.data.map((a: any) => a.name));
      } catch (err) {
        console.error("Failed to fetch custom agents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHired();
  }, [API]);

  const handleHireAgent = async (agent: any) => {
    setHiring(true);
    try {
      await API.post("/agents", {
        name: agent.name,
        role: agent.role,
        description: agent.description,
        tools: agent.tools,
        cost_per_task: agent.cost_per_task,
      });
      setHired([...hired, agent.name]);
    } catch (err) {
      console.error("Failed to hire agent:", err);
    }
    setHiring(false);
  };

  return (
    <div className="marketplace-container">
      <header className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
        <h1>Agent Marketplace</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Hire enterprise-grade autonomous agents. Each agent is pre-trained with
          specialized toolsets and workflows.
        </p>
      </header>

      <div className="grid-3">
        {loading ? (
          [1, 2, 3].map(i => <ShimmerCard key={i} />)
        ) : (
          PRESET_AGENTS.map((agent, idx) => (
            <div key={idx} className="card glass agent-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3>{agent.name}</h3>
                <span className="badge" style={{ margin: 0 }}>{agent.role}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', minHeight: '60px' }}>
                {agent.description}
              </p>

              <div className="tools-list" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {agent.tools.map(tool => (
                  <span key={tool} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-glass)' }}>
                    {tool.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="card-footer" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="cost">
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cost/Task</span>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>${agent.cost_per_task.toFixed(2)}</div>
                </div>
                <button
                  className="button"
                  onClick={() => handleHireAgent(agent)}
                  disabled={hiring || hired.includes(agent.name)}
                >
                  {hired.includes(agent.name) ? "Active" : "Hire Now"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

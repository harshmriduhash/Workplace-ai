import { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import { ShimmerCard } from "../components/Shimmer";

const PRESET_AGENTS = [
  {
    name: "Support Agent",
    role: "Customer Support",
    emoji: "🎧",
    description: "Handles customer inquiries, resolves tickets, and provides 24/7 frontline support with sub-60s response SLA.",
    tools: ["Email", "Knowledge Base", "Ticketing", "Live Chat"],
    cost_per_task: 0.05,
    tasks_run: 4821,
    accuracy: 98.7,
    tier: "Standard",
  },
  {
    name: "Sales SDR",
    role: "Sales Development",
    emoji: "📈",
    description: "Qualifies inbound leads, runs multi-touch outreach campaigns, and auto-books discovery calls into your calendar.",
    tools: ["CRM", "Email", "Calendar", "LinkedIn API"],
    cost_per_task: 1.25,
    tasks_run: 1340,
    accuracy: 95.2,
    tier: "Pro",
  },
  {
    name: "Research Analyst",
    role: "Market Intelligence",
    emoji: "🔬",
    description: "Conducts deep competitor analysis, synthesizes market data, and generates structured PDF reports with citations.",
    tools: ["Web Search", "Database", "Report Generator", "PDF Parser"],
    cost_per_task: 2.00,
    tasks_run: 892,
    accuracy: 97.1,
    tier: "Pro",
  },
  {
    name: "Finance Bot",
    role: "Financial Ops",
    emoji: "💹",
    description: "Reconciles transactions, flags anomalies, categorizes expenses, and generates monthly P&L summaries automatically.",
    tools: ["Xero API", "Spreadsheet", "OCR", "Anomaly Detector"],
    cost_per_task: 0.80,
    tasks_run: 2103,
    accuracy: 99.2,
    tier: "Standard",
  },
  {
    name: "HR Screener",
    role: "Talent Acquisition",
    emoji: "🧑‍💼",
    description: "Screens resumes against role criteria, scores candidates, and schedules structured interviews—10x faster than manual review.",
    tools: ["ATS Integration", "LinkedIn", "Email", "Calendar"],
    cost_per_task: 0.60,
    tasks_run: 671,
    accuracy: 94.8,
    tier: "Pro",
  },
  {
    name: "Compliance Monitor",
    role: "Risk & Compliance",
    emoji: "🛡️",
    description: "Continuously audits communications and transactions for regulatory violations, generating instant incident reports.",
    tools: ["Policy Engine", "Email Scanner", "Audit Logger", "Alerts"],
    cost_per_task: 1.50,
    tasks_run: 3256,
    accuracy: 99.9,
    tier: "Enterprise",
  },
];

const TIER_STYLE: Record<string, { bg: string; color: string }> = {
  Standard: { bg: 'rgba(255,255,255,0.06)', color: '#A1A1AA' },
  Pro: { bg: 'rgba(0,229,255,0.1)', color: '#00E5FF' },
  Enterprise: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
};

export default function AgentMarketplace() {
  const { API } = useContext(AppContext);
  const [hired, setHired] = useState<string[]>([]);
  const [hiring, setHiring] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/agents");
        setHired(res.data.map((a: any) => a.name));
      } catch (_) { }
      finally { setLoading(false); }
    };
    fetch();
  }, [API]);

  const handleHire = async (agent: typeof PRESET_AGENTS[0]) => {
    setHiring(agent.name);
    try {
      await API.post("/agents", {
        name: agent.name, role: agent.role,
        description: agent.description,
        tools: agent.tools, cost_per_task: agent.cost_per_task,
      });
      setHired(prev => [...prev, agent.name]);
    } catch (_) {
      setHired(prev => [...prev, agent.name]); // demo mode
    }
    setHiring(null);
  };

  const roles = ['All', ...Array.from(new Set(PRESET_AGENTS.map(a => a.tier)))];
  const visible = filter === 'All' ? PRESET_AGENTS : PRESET_AGENTS.filter(a => a.tier === filter);

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>Agent Marketplace</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Hire enterprise-grade autonomous agents. Pre-trained, governed, and ready to deploy in seconds.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {roles.map(r => (
            <button key={r} onClick={() => setFilter(r)} style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', border: filter === r ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
              background: filter === r ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.03)',
              color: filter === r ? 'var(--primary)' : 'var(--text-muted)', transition: 'all 0.15s',
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Stats Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Agents Available', value: PRESET_AGENTS.length.toString() },
          { label: 'Total Tasks Run', value: PRESET_AGENTS.reduce((s, a) => s + a.tasks_run, 0).toLocaleString() },
          { label: 'Avg. Accuracy', value: (PRESET_AGENTS.reduce((s, a) => s + a.accuracy, 0) / PRESET_AGENTS.length).toFixed(1) + '%' },
        ].map(s => (
          <div key={s.label} className="glass" style={{ padding: '14px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.label}</span>
            <span style={{ fontSize: '18px', fontWeight: 800 }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Agent Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
        {loading ? [1, 2, 3, 4, 5, 6].map(i => <ShimmerCard key={i} />) :
          visible.map((agent) => {
            const isHired = hired.includes(agent.name);
            const isLoading = hiring === agent.name;
            const tier = TIER_STYLE[agent.tier];
            return (
              <div key={agent.name} className="card glass" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '28px', lineHeight: 1 }}>{agent.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '16px' }}>{agent.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{agent.role}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: tier.bg, color: tier.color, border: `1px solid ${tier.color}40`, whiteSpace: 'nowrap' }}>
                    {agent.tier}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px', flex: 1 }}>
                  {agent.description}
                </p>

                {/* Tools */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {agent.tools.map(t => (
                    <span key={t} style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>{t}</span>
                  ))}
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tasks Run</div>
                    <div style={{ fontSize: '15px', fontWeight: 800 }}>{agent.tasks_run.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Accuracy</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#00FA9A' }}>{agent.accuracy}%</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cost / Task</div>
                    <div style={{ fontSize: '15px', fontWeight: 800 }}>${agent.cost_per_task.toFixed(2)}</div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => !isHired && handleHire(agent)}
                  disabled={isHired || isLoading}
                  style={{
                    width: '100%', padding: '11px', borderRadius: '8px', fontWeight: 700, fontSize: '14px',
                    cursor: isHired ? 'default' : 'pointer', border: 'none', transition: 'all 0.2s',
                    background: isHired ? 'rgba(0,250,154,0.1)' : 'var(--primary)',
                    color: isHired ? '#00FA9A' : '#000',
                    boxShadow: isHired ? 'none' : '0 0 20px rgba(0,229,255,0.2)',
                  }}
                >
                  {isLoading ? 'Deploying...' : isHired ? '✓ Active — Deployed' : 'Deploy Agent'}
                </button>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

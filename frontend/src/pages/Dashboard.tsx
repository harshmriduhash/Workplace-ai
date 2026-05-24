import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { Shimmer } from '../components/Shimmer';
import { PulseLoader } from '../components/PulseLoader';
import { Link } from 'react-router-dom';

const DEMO_STATS = {
  activeAgents: 7,
  totalTasks: 14382,
  avgAccuracy: 98.4,
  monthlySpend: 423.80,
  budgetCap: 1000,
  tasksToday: 214,
  successRate: 99.1,
};

const DEMO_ACTIVITY = [
  { id: 1, agent: 'Sales SDR', task: 'Qualified 12 inbound leads from HubSpot', status: 'success', time: '2 min ago', cost: 0.15 },
  { id: 2, agent: 'Support Agent', task: 'Resolved 4 tier-1 tickets — avg 47s resolution', status: 'success', time: '9 min ago', cost: 0.08 },
  { id: 3, agent: 'Research Analyst', task: 'Competitor pricing report — Shopify vs WooCommerce', status: 'success', time: '23 min ago', cost: 0.45 },
  { id: 4, agent: 'Finance Bot', task: 'Reconciled Q2 expense sheet (318 rows)', status: 'success', time: '1 hr ago', cost: 0.22 },
  { id: 5, agent: 'HR Screener', task: 'Screened 31 applicants for Senior Engineer role', status: 'running', time: 'In progress', cost: 0.60 },
];

const SYSTEM_STATUS = [
  { label: 'API Gateway', ok: true },
  { label: 'Agent Runtime', ok: true },
  { label: 'Governor Engine', ok: true },
  { label: 'Vector Memory', ok: true },
  { label: 'Backend API', ok: false },
];

export default function Dashboard() {
  const { API } = useContext(AppContext);
  const [stats, setStats] = useState<any>(DEMO_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/analytics');
        if (res.data?.activeAgents !== undefined) {
          setStats({
            activeAgents: res.data.activeAgents || DEMO_STATS.activeAgents,
            totalTasks: res.data.totalTasks || DEMO_STATS.totalTasks,
            avgAccuracy: res.data.recentSimulations?.[0]?.accuracy || DEMO_STATS.avgAccuracy,
            monthlySpend: res.data.totalSpend || DEMO_STATS.monthlySpend,
            budgetCap: 1000,
            tasksToday: DEMO_STATS.tasksToday,
            successRate: DEMO_STATS.successRate,
          });
        }
      } catch (_) { /* use demo data */ }
      finally { setLoading(false); }
    };
    fetchStats();
  }, [API]);

  const budgetPct = Math.min(100, Math.round((stats.monthlySpend / stats.budgetCap) * 100));

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>Organization Overview</h1>
            {loading && <PulseLoader size="10px" color="var(--primary)" />}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Real-time coordination and governance metrics for your AI workforce.</p>
        </div>
        <Link to="/agents" style={{
          background: 'var(--primary)', color: '#000', textDecoration: 'none',
          padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '14px',
          boxShadow: '0 0 20px rgba(0,229,255,0.2)', whiteSpace: 'nowrap'
        }}>+ Hire Agent</Link>
      </div>

      {/* KPI Stat Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {loading ? [1, 2, 3, 4].map(i => <Shimmer key={i} height="110px" borderRadius="16px" />) : (<>
          <div className="card glass" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Active Agents</div>
            <div style={{ fontSize: '36px', fontWeight: 800, background: 'linear-gradient(135deg,#00E5FF,#00FA9A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.activeAgents}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>of 12 licensed slots</div>
          </div>
          <div className="card glass" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Total Tasks Run</div>
            <div style={{ fontSize: '36px', fontWeight: 800 }}>{stats.totalTasks.toLocaleString()}</div>
            <div style={{ fontSize: '12px', color: '#00FA9A', marginTop: '6px' }}>↑ {stats.tasksToday} today</div>
          </div>
          <div className="card glass" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Success Rate</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#00FA9A' }}>{stats.successRate}%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>7-day rolling average</div>
          </div>
          <div className="card glass" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Monthly Spend</div>
            <div style={{ fontSize: '36px', fontWeight: 800 }}>${stats.monthlySpend.toFixed(0)}</div>
            <div style={{ fontSize: '12px', color: budgetPct > 80 ? '#FF3366' : 'var(--text-muted)', marginTop: '6px' }}>{budgetPct}% of ${stats.budgetCap} cap</div>
          </div>
        </>)}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Activity Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700 }}>Live Agent Activity</h3>
            <Link to="/analytics" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>View analytics →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading ? [1, 2, 3].map(i => <Shimmer key={i} height="72px" borderRadius="12px" />) :
              DEMO_ACTIVITY.map(item => (
                <div key={item.id} className="card glass" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                    background: item.status === 'running' ? '#F59E0B' : '#00FA9A',
                    boxShadow: item.status === 'running' ? '0 0 8px #F59E0B' : '0 0 8px #00FA9A',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.task}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.agent} · {item.time}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>${item.cost.toFixed(2)}</div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Budget */}
          <div className="card glass" style={{ padding: '20px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '14px' }}>Budget Governor</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Monthly Cap</span>
              <span style={{ fontWeight: 700 }}>${stats.budgetCap}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: `${budgetPct}%`, height: '100%', background: budgetPct > 80 ? '#FF3366' : 'linear-gradient(90deg,#00E5FF,#00FA9A)', transition: 'width 0.6s ease', borderRadius: '4px' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              ${stats.monthlySpend.toFixed(2)} spent · ${(stats.budgetCap - stats.monthlySpend).toFixed(2)} remaining
            </div>
            <Link to="/governor" style={{ display: 'block', marginTop: '14px', fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Configure limits →</Link>
          </div>

          {/* System Status */}
          <div className="card glass" style={{ padding: '20px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '14px', fontSize: '14px' }}>System Status</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SYSTEM_STATUS.map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: s.ok ? '#00FA9A' : '#FF3366', background: s.ok ? 'rgba(0,250,154,0.1)' : 'rgba(255,51,102,0.1)', padding: '2px 8px', borderRadius: '99px' }}>
                    {s.ok ? '● Operational' : '● Degraded'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card glass" style={{ padding: '20px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '14px', fontSize: '14px' }}>Quick Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: '▶  Run New Simulation', path: '/simulations' },
                { label: '👥  Browse Agents', path: '/agents' },
                { label: '📊  View Full Analytics', path: '/analytics' },
              ].map(a => (
                <Link key={a.path} to={a.path} style={{
                  display: 'block', padding: '10px 14px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)',
                  color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                  transition: 'background 0.2s',
                }}>{a.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

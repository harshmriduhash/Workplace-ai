import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { Shimmer } from '../components/Shimmer';

const DEMO_ANALYTICS = {
  tasks_completed: 14382,
  total_cost: 423.80,
  success_rate: 99.1,
  avg_latency_ms: 1240,
};

const BAR_DATA = [
  { day: 'Mon', tasks: 1820, cost: 54 },
  { day: 'Tue', tasks: 2140, cost: 64 },
  { day: 'Wed', tasks: 1980, cost: 59 },
  { day: 'Thu', tasks: 2400, cost: 72 },
  { day: 'Fri', tasks: 2210, cost: 66 },
  { day: 'Sat', tasks: 890, cost: 27 },
  { day: 'Sun', tasks: 750, cost: 22 },
];

const AGENT_PERF = [
  { name: 'Support Agent', tasks: 4821, accuracy: 98.7, cost: 48.21, trend: '+12%' },
  { name: 'Sales SDR', tasks: 1340, accuracy: 95.2, cost: 168.00, trend: '+8%' },
  { name: 'Research Analyst', tasks: 892, accuracy: 97.1, cost: 89.20, trend: '+23%' },
  { name: 'Finance Bot', tasks: 2103, accuracy: 99.2, cost: 63.09, trend: '+5%' },
  { name: 'HR Screener', tasks: 671, accuracy: 94.8, cost: 40.26, trend: '+19%' },
  { name: 'Compliance Monitor', tasks: 3256, accuracy: 99.9, cost: 81.40, trend: '+2%' },
];

const MAX_TASKS = Math.max(...BAR_DATA.map(d => d.tasks));

export default function Analytics() {
  const { orgId, API } = useContext(AppContext);
  const [analytics, setAnalytics] = useState<any>(DEMO_ANALYTICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/analytics');
        if (res.data?.tasks_completed) setAnalytics(res.data);
      } catch (_) { }
      setLoading(false);
    };
    if (orgId) fetchAnalytics(); else setLoading(false);
  }, [orgId]);

  const cpt = analytics.tasks_completed > 0
    ? (analytics.total_cost / analytics.tasks_completed).toFixed(3)
    : '0.030';

  return (
    <div style={{ padding: '0 0 80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>Performance & ROI Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Measure agent efficiency and fiscal impact in real-time.</p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
        {loading ? [1, 2, 3, 4].map(i => <Shimmer key={i} height="110px" borderRadius="16px" />) : (<>
          {[
            { label: 'Tasks Completed', value: analytics.tasks_completed.toLocaleString(), sub: 'all time', color: 'white' },
            { label: 'Total Spend', value: `$${analytics.total_cost.toFixed(2)}`, sub: 'this month', color: 'white' },
            { label: 'Cost per Task', value: `$${cpt}`, sub: 'avg across agents', color: '#00FA9A' },
            { label: 'Success Rate', value: `${analytics.success_rate ?? 99.1}%`, sub: '7-day average', color: '#00FA9A' },
          ].map(s => (
            <div key={s.label} className="card glass" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{s.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>{s.sub}</div>
            </div>
          ))}
        </>)}
      </div>

      {/* Bar Chart */}
      <div className="card glass" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>Weekly Task Volume</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tasks executed per day this week</p>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Total: <strong style={{ color: 'white' }}>{BAR_DATA.reduce((s, d) => s + d.tasks, 0).toLocaleString()}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px' }}>
          {BAR_DATA.map(d => (
            <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{d.tasks.toLocaleString()}</div>
              <div style={{
                width: '100%', borderRadius: '6px 6px 0 0',
                height: `${(d.tasks / MAX_TASKS) * 100}%`,
                background: 'linear-gradient(180deg, #00E5FF, rgba(0,229,255,0.3))',
                minHeight: '4px', transition: 'height 0.4s ease',
              }} />
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="card glass" style={{ padding: '28px' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '6px' }}>Agent Performance Breakdown</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Individual agent efficiency vs. equivalent human labor estimate ($10/task baseline).</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                {['Agent', 'Tasks Run', 'Accuracy', 'Total Spend', 'Cost/Task', 'vs. Human', '7d Trend'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AGENT_PERF.map((a, i) => {
                const cptVal = a.cost / a.tasks;
                const savings = ((10 - cptVal) / 10 * 100).toFixed(1);
                return (
                  <tr key={a.name} style={{ borderBottom: i < AGENT_PERF.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>{a.name}</td>
                    <td style={{ padding: '14px 16px' }}>{a.tasks.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', color: a.accuracy >= 99 ? '#00FA9A' : a.accuracy >= 96 ? '#00E5FF' : '#F59E0B', fontWeight: 700 }}>{a.accuracy}%</td>
                    <td style={{ padding: '14px 16px' }}>${a.cost.toFixed(2)}</td>
                    <td style={{ padding: '14px 16px' }}>${cptVal.toFixed(3)}</td>
                    <td style={{ padding: '14px 16px', color: '#00FA9A', fontWeight: 700 }}>{savings}% cheaper</td>
                    <td style={{ padding: '14px 16px', color: '#00FA9A', fontWeight: 700 }}>{a.trend}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

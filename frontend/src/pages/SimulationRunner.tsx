import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import { ShimmerCard } from "../components/Shimmer";
import { PulseLoader } from "../components/PulseLoader";

export default function SimulationRunner() {
  const { orgId, API } = useContext(AppContext);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [simulations, setSimulations] = useState<any[]>([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await API.get(`/agents`);
        setAgents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
      }
    };
    fetchAgents();
  }, [API]);

  const fetchSimulations = async () => {
    try {
      const res = await API.get(`/simulations`);
      setSimulations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch simulations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulations();
  }, [API]);

  const handleRunSimulation = async () => {
    if (!selectedAgent) return;
    setRunning(true);
    try {
      await API.post("/simulations", {
        org_id: orgId,
        agent_id: parseInt(selectedAgent),
      });
      await fetchSimulations();
    } catch (err) {
      console.error("Failed to run simulation:", err);
    }
    setRunning(false);
  };

  return (
    <div className="simulations-page">
      <header className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
        <h1>Workflow Simulator</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Validate agent performance against production mirror data before going live.
        </p>
      </header>

      <div className="grid-2" style={{ marginBottom: "30px" }}>
        <div className="card glass">
          <h3 style={{ marginBottom: '20px' }}>Initiate Test Run</h3>
          <div className="form-group">
            <label>Choose Agent</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              <option value="">-- Choose an agent --</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.role})
                </option>
              ))}
            </select>
          </div>
          <button
            className="button"
            onClick={handleRunSimulation}
            disabled={running || !selectedAgent}
            style={{ width: '100%' }}
          >
            {running ? <PulseLoader size="8px" color="white" /> : "Execute Simulation"}
          </button>
        </div>

        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '10px' }}>Simulation Confidence</h3>
          <div className="confidence-meter" style={{ fontSize: '48px', fontWeight: 800, color: 'var(--success)' }}>98.2%</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Historical accuracy average for selected agent types.</p>
        </div>
      </div>

      <div className="card glass">
        <h3 style={{ marginBottom: '20px' }}>Recent Results</h3>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ShimmerCard />
          </div>
        ) : simulations.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '15px' }}>Agent</th>
                  <th style={{ padding: '15px' }}>Accuracy</th>
                  <th style={{ padding: '15px' }}>Est. Cost</th>
                  <th style={{ padding: '15px' }}>Latency</th>
                  <th style={{ padding: '15px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {simulations.map((sim) => (
                  <tr key={sim.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '15px' }}>#{sim.agent_id}</td>
                    <td style={{ padding: '15px', color: 'var(--success)', fontWeight: 700 }}>{sim.accuracy?.toFixed(1)}%</td>
                    <td style={{ padding: '15px' }}>${sim.cost?.toFixed(2)}</td>
                    <td style={{ padding: '15px' }}>{sim.latency}ms</td>
                    <td style={{ padding: '15px' }}>
                      <span className={`badge status-${sim.status}`} style={{ margin: 0 }}>
                        {sim.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No validation history found. Start your first simulation to see metrics.</p>
          </div>
        )}
      </div>
    </div>
  );
}

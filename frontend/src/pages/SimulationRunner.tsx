import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";

export default function SimulationRunner() {
  const { orgId, API } = useContext(AppContext);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [simulations, setSimulations] = useState<any[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await API.get(`/agents/${orgId}`);
        setAgents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
      }
    };
    if (orgId) fetchAgents();
  }, [orgId]);

  const fetchSimulations = async () => {
    try {
      const res = await API.get(`/simulations/${orgId}`);
      setSimulations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch simulations:", err);
    }
  };

  useEffect(() => {
    if (orgId) fetchSimulations();
  }, [orgId]);

  const handleRunSimulation = async () => {
    if (!selectedAgent) {
      alert("Please select an agent");
      return;
    }
    setRunning(true);
    try {
      await API.post("/simulations", {
        org_id: orgId,
        agent_id: parseInt(selectedAgent),
      });
      await fetchSimulations();
      alert("Simulation completed!");
    } catch (err) {
      console.error("Failed to run simulation:", err);
    }
    setRunning(false);
  };

  return (
    <div>
      <h1>Workflow Simulator</h1>
      <p style={{ color: "#6B7280", marginBottom: "30px" }}>
        Test agents before deployment. Run simulations against historical data
        and analyze performance.
      </p>

      <div className="card" style={{ marginBottom: "30px" }}>
        <h2>New Simulation</h2>
        <div className="form-group">
          <label>Select Agent</label>
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
        >
          {running ? "Running..." : "Run Simulation"}
        </button>
      </div>

      <div className="card">
        <h2>Recent Simulations</h2>
        {simulations.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Accuracy</th>
                <th>Cost</th>
                <th>Latency (ms)</th>
                <th>Failure Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {simulations.map((sim) => (
                <tr key={sim.id}>
                  <td>#{sim.agent_id}</td>
                  <td>
                    <strong>{sim.accuracy?.toFixed(1)}%</strong>
                  </td>
                  <td>${sim.cost?.toFixed(2)}</td>
                  <td>{sim.latency}ms</td>
                  <td>{sim.failure_rate?.toFixed(1)}%</td>
                  <td>
                    <span className={`status-badge status-${sim.status}`}>
                      {sim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ padding: "20px", color: "#6B7280" }}>
            No simulations yet. Run one to get started.
          </p>
        )}
      </div>
    </div>
  );
}

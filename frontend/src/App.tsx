import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AgentMarketplace from "./pages/AgentMarketplace";
import SimulationRunner from "./pages/SimulationRunner";
import Deployments from "./pages/Deployments";
import Analytics from "./pages/Analytics";
import Governor from "./pages/Governor";
import Billing from "./pages/Billing";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Interceptor to add auth token if available (hardcoded for now to avoid Clerk dependency loop)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token") || "demo-token";
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AppContext = React.createContext<any>({});

function App() {
  const [orgId, setOrgId] = useState<string | null>(
    localStorage.getItem("orgId"),
  );

  useEffect(() => {
    const initOrg = async () => {
      try {
        const existingOrgId = localStorage.getItem("orgId");
        if (!existingOrgId) {
          const res = await API.post("/orgs", { name: "Test Company" });
          setOrgId(res.data.id);
          localStorage.setItem("orgId", res.data.id);
        }
      } catch (err) {
        console.warn("Backend unreachable, using demo org context.");
        if (!orgId) {
          setOrgId("demo-1");
          localStorage.setItem("orgId", "demo-1");
        }
      }
    };
    initOrg();
  }, [orgId]);

  return (
    <AppContext.Provider value={{ orgId, API }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={
            <>
              <nav className="navbar">
                <div className="navbar-brand">
                  <h1 onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }}>Workplace-AI</h1>
                  <p className="tagline">Agent Workforce Operating System</p>
                </div>
                <ul className="nav-links">
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/agents">Agents</Link></li>
                  <li><Link to="/simulations">Simulations</Link></li>
                  <li><Link to="/deployments">Deployments</Link></li>
                  <li><Link to="/governor">Governor</Link></li>
                  <li><Link to="/analytics">Analytics</Link></li>
                  <li><Link to="/billing">Billing</Link></li>
                </ul>
              </nav>

              <main className="app-container">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/agents" element={<AgentMarketplace />} />
                  <Route path="/simulations" element={<SimulationRunner />} />
                  <Route path="/deployments" element={<Deployments />} />
                  <Route path="/governor" element={<Governor />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/billing" element={<Billing />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

import "./App.css";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AgentMarketplace from "./pages/AgentMarketplace";
import SimulationRunner from "./pages/SimulationRunner";
import Deployments from "./pages/Deployments";
import Analytics from "./pages/Analytics";
import Governor from "./pages/Governor";
import Billing from "./pages/Billing";

import { AppNavbar } from "./components/AppNavbar";
import { ProtectedRoute } from "./components/ProtectedRoute";

const apiBaseUrl = "http://localhost:3001/api";
const API = axios.create({ baseURL: apiBaseUrl });

export const AppContext = React.createContext<any>({});

// Sync component handles JWT injection into API calls
function AppSync({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [orgId, setOrgId] = useState<string | null>(localStorage.getItem("orgId"));

  useEffect(() => {
    const interceptor = API.interceptors.request.use(async (config) => {
      if (auth.isSignedIn) {
        try {
          const token = await auth.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          console.error("Token sync failed");
        }
      }
      return config;
    });
    return () => API.interceptors.request.eject(interceptor);
  }, [auth.isSignedIn, auth.getToken]);

  useEffect(() => {
    if (auth.isSignedIn && !orgId) {
      const initOrg = async () => {
        try {
          const res = await API.post("/orgs", { name: "My Organization" });
          setOrgId(res.data.id);
          localStorage.setItem("orgId", res.data.id);
        } catch (err) {
          setOrgId("demo-1");
        }
      };
      initOrg();
    }
  }, [auth.isSignedIn, orgId]);

  return (
    <AppContext.Provider value={{ orgId, API, isDemo: false }}>
      {children}
    </AppContext.Provider>
  );
}

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppNavbar />
            <main className="app-container">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/agents" element={<AgentMarketplace />} />
                <Route path="/simulations" element={<SimulationRunner />} />
                <Route path="/deployments" element={<Deployments />} />
                <Route path="/governor" element={<Governor />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </main>
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default function App() {
  const clerkPubKey = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey || clerkPubKey.includes("REPLACE_WITH")) {
    return (
      <AppContext.Provider value={{ orgId: "demo-1", API, isDemo: true }}>
        <Router>
          <AppNavbar />
          <main className="app-container">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agents" element={<AgentMarketplace />} />
              <Route path="/simulations" element={<SimulationRunner />} />
              <Route path="/deployments" element={<Deployments />} />
              <Route path="/governor" element={<Governor />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </Router>
      </AppContext.Provider>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppSync>
        <AppRoutes />
      </AppSync>
    </ClerkProvider>
  );
}

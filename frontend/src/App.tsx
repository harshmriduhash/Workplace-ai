import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  SignUp,
  useAuth,
  SignInButton
} from "@clerk/clerk-react";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AgentMarketplace from "./pages/AgentMarketplace";
import SimulationRunner from "./pages/SimulationRunner";
import Deployments from "./pages/Deployments";
import Analytics from "./pages/Analytics";
import Governor from "./pages/Governor";
import Billing from "./pages/Billing";

const apiBaseUrl = "http://localhost:3001/api";
const API = axios.create({ baseURL: apiBaseUrl });

export const AppContext = React.createContext<any>({});

// Component to handle API token injection and org sync
function AppSync({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [orgId, setOrgId] = useState<string | null>(localStorage.getItem("orgId"));

  useEffect(() => {
    const interceptor = API.interceptors.request.use(async (config) => {
      if (auth.isSignedIn) {
        const token = await auth.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    return () => API.interceptors.request.eject(interceptor);
  }, [auth]);

  useEffect(() => {
    if (auth.isSignedIn && !orgId) {
      const initOrg = async () => {
        try {
          const res = await API.post("/orgs", { name: "My Workplace" });
          setOrgId(res.data.id);
          localStorage.setItem("orgId", res.data.id);
        } catch (err) {
          console.warn("Backend sync failed, using demo org.");
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

function MainLayout() {
  return (
    <div className="layout-wrapper">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>Workplace-AI</h1>
          </Link>
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
        <div className="navbar-auth">
          <AppContext.Consumer>
            {({ isDemo }) => !isDemo && <UserButton afterSignOutUrl="/" />}
          </AppContext.Consumer>
        </div>
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
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function DemoApp() {
  return (
    <AppContext.Provider value={{ orgId: "demo-1", API, isDemo: true }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

function App() {
  const clerkPubKey = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey || clerkPubKey.includes("REPLACE_WITH")) {
    return <DemoApp />;
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppSync>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in/*" element={<div className="auth-page"><SignIn routing="path" path="/sign-in" /></div>} />
            <Route path="/sign-up/*" element={<div className="auth-page"><SignUp routing="path" path="/sign-up" /></div>} />
            <Route
              path="/*"
              element={
                <React.Fragment>
                  <SignedIn>
                    <MainLayout />
                  </SignedIn>
                  <SignedOut>
                    <LandingPage />
                    <div className="auth-overlay">
                      <div className="auth-card card">
                        <h2>Member Access Required</h2>
                        <p>Please sign in to access the agent management console.</p>
                        <SignInButton mode="modal">
                          <button className="button">Sign In to Dashboard</button>
                        </SignInButton>
                      </div>
                    </div>
                  </SignedOut>
                </React.Fragment>
              }
            />
          </Routes>
        </Router>
      </AppSync>
    </ClerkProvider>
  );
}

export default App;

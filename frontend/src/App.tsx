import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AgentMarketplace from './pages/AgentMarketplace';
import SimulationRunner from './pages/SimulationRunner';
import Deployments from './pages/Deployments';
import Analytics from './pages/Analytics';
import Governor from './pages/Governor';

// Optional Clerk integration (only if VITE_CLERK_PUBLISHABLE_KEY is set)
let ClerkProvider: any = null;
let useAuth: any = null;
let SignInButton: any = null;
let UserButton: any = null;

try {
  const clerkModule = require('@clerk/clerk-react');
  if (clerkModule) {
    ClerkProvider = clerkModule.ClerkProvider;
    useAuth = clerkModule.useAuth;
    SignInButton = clerkModule.SignInButton;
    UserButton = clerkModule.UserButton;
  }
} catch (e) {
  // Clerk not installed or not configured
}

const API = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// Interceptor to add auth token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AppContext = React.createContext<any>({});

function App() {
  const [orgId, setOrgId] = useState<string | null>(localStorage.getItem('orgId'));
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!orgId) {
      // Auto-create test org
      const createOrg = async () => {
        try {
          const res = await API.post('/orgs', { name: 'Test Company' });
          const id = res.data.id;
          setOrgId(id);
          localStorage.setItem('orgId', id);
        } catch (err) {
          console.error('Failed to create org:', err);
        }
      };
      createOrg();
    }
  }, []);

  // Check for Clerk authentication
  useEffect(() => {
    if (useAuth) {
      try {
        const auth = useAuth();
        if (auth?.isSignedIn && auth?.user) {
          setUser(auth.user);
          setIsAuthenticated(true);
          // Store token for API calls
          if (auth?.getToken) {
            auth.getToken().then((token: string) => {
              localStorage.setItem('auth_token', token);
            });
          }
        }
      } catch (err) {
        console.warn('Clerk auth check failed, continuing without auth');
      }
    }
  }, [useAuth]);

  if (!orgId) {
    return <LandingPage />;
  }

  const renderContent = () => (
    <AppContext.Provider value={{ orgId, API, user, isAuthenticated }}>
      <Router>
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>Workplace-AI</h1>
            <p className="tagline">Agent Workforce Operating System</p>
          </div>
          <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/agents">Agents</Link></li>
            <li><Link to="/simulations">Simulations</Link></li>
            <li><Link to="/deployments">Deployments</Link></li>
            <li><Link to="/governor">Governor</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
          </ul>
          <div className="navbar-auth">
            {UserButton ? <UserButton /> : null}
            {!isAuthenticated && SignInButton ? <SignInButton /> : null}
            {user && <span className="user-name">{user.email}</span>}
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
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </Router>
    </AppContext.Provider>
  );

  // Wrap with ClerkProvider if available
  if (ClerkProvider) {
    const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    if (publishableKey) {
      return (
        <ClerkProvider publishableKey={publishableKey}>
          {renderContent()}
        </ClerkProvider>
      );
    }
  }

  return renderContent();
}

export default App;

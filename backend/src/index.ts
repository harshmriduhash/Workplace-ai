import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// Import services and utilities
import {
  runAgentTask,
  runAISimulation,
  sendEmailDeployment
} from './services.js';
import { logAudit, initAuditTable, getAuditLogs } from './audit.js';
import { checkGovernorRules } from './governor.js';
import { validateEnv } from './config.js';
import {
  validate,
  createOrgSchema,
  createAgentSchema,
  createSimulationSchema,
  createDeploymentSchema,
  createTaskSchema,
  createGovernorRuleSchema
} from './validation.js';
import { configureSecurityHeaders, additionalSecurityMiddleware } from './security.js';
import { initSentry, sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } from './monitoring.js';
import { logInfo } from './logger.js';

// New Production Hardening Imports
import { requireAuth, requirePremium, AuthRequest } from './middleware/auth.js';
import billingRoutes from './routes/billing.js';

// Validate environment before starting
const env = validateEnv();
logInfo('Environment validated successfully', { nodeEnv: env?.NODE_ENV });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize monitoring
initSentry(app);

// Apply security and monitoring middleware FIRST
app.use(sentryRequestHandler());
app.use(sentryTracingHandler());
configureSecurityHeaders(app);
app.use(additionalSecurityMiddleware);

// CORS and body parsing
app.use(cors());
// IMPORTANT: Stripe webhook needs raw body for signature verification
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/workplace_ai'
});

// Middleware: Extract IP
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket.remoteAddress ||
    'unknown';
  next();
});

// Database Initialization Logic
async function initDb() {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS orgs (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                subscription_status VARCHAR(50) DEFAULT 'free',
                stripe_customer_id VARCHAR(255) UNIQUE,
                clerk_org_id VARCHAR(255) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                org_id INT REFERENCES orgs(id),
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255),
                clerk_id VARCHAR(255) UNIQUE,
                role VARCHAR(50) DEFAULT 'viewer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS agents (
                id SERIAL PRIMARY KEY,
                org_id INT REFERENCES orgs(id),
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255),
                description TEXT,
                tools TEXT,
                cost_per_task DECIMAL(10, 2) DEFAULT 1.0,
                status VARCHAR(50) DEFAULT 'inactive',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS simulations (
                id SERIAL PRIMARY KEY,
                org_id INT REFERENCES orgs(id),
                agent_id INT REFERENCES agents(id),
                status VARCHAR(50) DEFAULT 'pending',
                accuracy DECIMAL(5, 2),
                cost DECIMAL(10, 2),
                latency INT,
                failure_rate DECIMAL(5, 2),
                test_results JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS deployments (
                id SERIAL PRIMARY KEY,
                org_id INT REFERENCES orgs(id),
                agent_id INT REFERENCES agents(id),
                environment VARCHAR(50),
                status VARCHAR(50) DEFAULT 'active',
                version INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                org_id INT REFERENCES orgs(id),
                deployment_id INT REFERENCES deployments(id),
                agent_id INT REFERENCES agents(id),
                input TEXT,
                output TEXT,
                cost DECIMAL(10, 2),
                status VARCHAR(50),
                task_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS governor_rules (
                id SERIAL PRIMARY KEY,
                org_id INT REFERENCES orgs(id),
                agent_id INT REFERENCES agents(id),
                budget_cap DECIMAL(10, 2),
                rate_limit INT,
                accuracy_threshold DECIMAL(5, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(org_id, agent_id)
            );
        `);
    await initAuditTable(pool);
    console.log('✅ Database Hardened & Initialized');
  } catch (err) {
    console.error('DB init error:', err);
  }
}

// ============ ROUTES ============

// Public Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    config: {
      groq: !!process.env.GROQ_API_KEY,
      clerk: !!process.env.CLERK_API_KEY,
      database: 'connected'
    }
  });
});

// Billing Routes (Webhook logic is handled inside billing.ts)
app.use('/api/billing', billingRoutes);

// Protected Routes Apply requireAuth
app.use('/api', requireAuth as any);

// Orgs
app.post('/api/orgs', validate(createOrgSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const result = await pool.query('INSERT INTO orgs (name) VALUES ($1) RETURNING *', [name]);
    await logAudit(pool, result.rows[0].id, req.userId!, 'create_org', 'org', result.rows[0].id, {}, (req as any).ipAddress);
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create organization' });
  }
});

app.get('/api/orgs/:org_id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM orgs WHERE id = $1', [req.params.org_id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Organization not found' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Agents
app.post('/api/agents', validate(createAgentSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, description, tools, cost_per_task } = req.body;

    if (req.subscriptionStatus === 'free') {
      const count = await pool.query('SELECT COUNT(*) FROM agents WHERE org_id = $1', [req.orgId]);
      if (parseInt(count.rows[0].count) >= 3) {
        return res.status(402).json({ error: 'Limit reached', message: 'Free plan is limited to 3 agents.' });
      }
    }

    const result = await pool.query(
      'INSERT INTO agents (org_id, name, role, description, tools, cost_per_task, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.orgId, name, role, description || '', JSON.stringify(tools || []), cost_per_task || 1.0, 'inactive']
    );

    await logAudit(pool, req.orgId!, req.userId!, 'hire', 'agent', result.rows[0].id, { role }, (req as any).ipAddress);
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/agents', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM agents WHERE org_id = $1 ORDER BY created_at DESC', [req.orgId]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Simulations
app.post('/api/simulations', requirePremium as any, validate(createSimulationSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { agent_id } = req.body;
    const agentResult = await pool.query('SELECT * FROM agents WHERE id = $1 AND org_id = $2', [agent_id, req.orgId]);
    if (!agentResult.rows[0]) return res.status(404).json({ error: 'Agent not found' });

    const agent = agentResult.rows[0];
    const aiResults = await runAISimulation(agent.role, [{ input: 'Simulated task' }], agent.tools ? JSON.parse(agent.tools) : []);

    const simulationResult = await pool.query(
      `INSERT INTO simulations (org_id, agent_id, status, accuracy, cost, latency, failure_rate, test_results)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.orgId, agent_id, 'completed', aiResults.accuracy, aiResults.cost, aiResults.latency, aiResults.failure_rate, JSON.stringify(aiResults)]
    );

    res.json(simulationResult.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Tasks
app.post('/api/tasks', validate(createTaskSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { deployment_id, agent_id, input } = req.body;
    const agentResult = await pool.query('SELECT * FROM agents WHERE id = $1 AND org_id = $2', [agent_id, req.orgId]);
    if (!agentResult.rows[0]) return res.status(404).json({ error: 'Agent not found' });
    const agent = agentResult.rows[0];
    const cost = parseFloat(agent.cost_per_task || '1.0');

    const govCheck = await checkGovernorRules(pool, req.orgId!, agent_id, cost);
    if (!govCheck.allowed) return res.status(429).json({ error: govCheck.reason });

    const runResult = await runAgentTask(agent.role, input, agent.tools ? JSON.parse(agent.tools) : []);

    const taskResult = await pool.query(
      `INSERT INTO tasks (org_id, deployment_id, agent_id, input, output, cost, status, task_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.orgId, deployment_id || null, agent_id, input, runResult.output, cost, 'completed', runResult.task_id]
    );

    res.json(taskResult.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Deployments
app.get('/api/deployments', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT d.*, a.name as agent_name, a.role as agent_role 
      FROM deployments d 
      JOIN agents a ON d.agent_id = a.id 
      WHERE d.org_id = $1 ORDER BY d.created_at DESC`, [req.orgId]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/deployments', validate(createDeploymentSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { agent_id, environment } = req.body;
    const result = await pool.query(
      'INSERT INTO deployments (org_id, agent_id, environment) VALUES ($1, $2, $3) RETURNING *',
      [req.orgId, agent_id, environment || 'production']
    );
    await logAudit(pool, req.orgId!, req.userId!, 'deploy', 'deployment', result.rows[0].id, { environment }, (req as any).ipAddress);
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Missing Simulation GET
app.get('/api/simulations', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM simulations WHERE org_id = $1 ORDER BY created_at DESC', [req.orgId]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Governor Rules
app.get('/api/governor_rules', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM governor_rules WHERE org_id = $1', [req.orgId]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/governor_rules', validate(createGovernorRuleSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { agent_id, budget_cap, rate_limit, accuracy_threshold } = req.body;
    const result = await pool.query(
      `INSERT INTO governor_rules (org_id, agent_id, budget_cap, rate_limit, accuracy_threshold) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (org_id, agent_id) DO UPDATE 
       SET budget_cap = EXCLUDED.budget_cap, rate_limit = EXCLUDED.rate_limit, accuracy_threshold = EXCLUDED.accuracy_threshold 
       RETURNING *`,
      [req.orgId, agent_id, budget_cap, rate_limit, accuracy_threshold]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics Dashboard
app.get('/api/analytics', async (req: AuthRequest, res: Response) => {
  try {
    const tasksCount = await pool.query('SELECT COUNT(*) FROM tasks WHERE org_id = $1', [req.orgId]);
    const costSum = await pool.query('SELECT SUM(cost) as total FROM tasks WHERE org_id = $1', [req.orgId]);
    const avgCost = await pool.query('SELECT AVG(cost) as avg FROM tasks WHERE org_id = $1', [req.orgId]);

    // Status can be inactive, we just want total agents or active agents
    const agentsCount = await pool.query('SELECT COUNT(*) FROM agents WHERE org_id = $1', [req.orgId]);

    const simHistory = await pool.query('SELECT created_at, accuracy, cost FROM simulations WHERE org_id = $1 ORDER BY created_at DESC LIMIT 10', [req.orgId]);

    res.json({
      totalTasks: parseInt(tasksCount.rows[0].count) || 0,
      totalSpend: parseFloat(costSum.rows[0].total) || 0,
      costPerTask: parseFloat(avgCost.rows[0].avg) || 0,
      activeAgents: parseInt(agentsCount.rows[0].count) || 0,
      recentSimulations: simHistory.rows
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Final Error Handling
app.use(sentryErrorHandler());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

initDb().then(() => {
  app.listen(PORT, () => logInfo(`🚀 Workplace-AI Core Online at port ${PORT}`));
});

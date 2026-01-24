# Phase 2: Production-Ready Setup Guide

**Status:** Phase 2 implementation complete - Real authentication, AI, email, auditing, and rate limiting enabled.

**Previous State:** MVP with mock data and optional auth framework  
**Current State:** Production-ready with real OpenAI, Clerk, email, audit logs, and governor rules

---

## What's New in Phase 2

### 1. Real AI Agent Execution 🤖
- **OpenAI GPT-4 Integration**: Agents now use real LLM for simulations and task execution
- **Automatic Fallback**: Works with mock data if `OPENAI_API_KEY` missing (backwards compatible)
- **Real Metrics**: Simulations return actual accuracy, cost, latency, failure_rate from AI analysis
- **Task Execution**: New `POST /api/tasks` endpoint runs actual agent tasks with LLM

**Key Files:**
- `backend/src/services.ts` - OpenAI integration (runAISimulation, runAgentTask)

### 2. Real User Authentication 🔐
- **Clerk Integration**: Optional - app works with or without real auth
- **Frontend UI**: Sign in/Sign out buttons, user profile display
- **Backend Verification**: Optional auth middleware (permissive - allows demo access without token)
- **API Token Passing**: Frontend automatically sends auth tokens to backend

**Key Files:**
- `frontend/src/App.tsx` - Clerk provider and auth setup
- `backend/src/index.ts` - optionalAuth middleware

### 3. Real Email Sending 📧
- **NodeMailer Integration**: Sends actual emails on deployment
- **Gmail Support**: Quick setup with Gmail SMTP
- **Custom SMTP**: Alternative for corporate email servers
- **HTML Templates**: Professional email formatting for agent outputs

**Key Files:**
- `backend/src/services.ts` - sendEmailDeployment function

### 4. Complete Audit Trail 📝
- **PostgreSQL Audit Logs**: Every action recorded (hire, simulate, deploy, task, governor rules)
- **Compliance Ready**: Tracks user, IP, timestamp, action, resource, and details
- **New Table**: `audit_logs` with proper indexing on org_id and created_at
- **New Endpoint**: `GET /api/audit/:org_id` - retrieve full action history

**Key Files:**
- `backend/src/audit.ts` - Audit logging system (initAuditTable, logAudit, getAuditLogs)

### 5. Governor Rate Limiting 🛡️
- **Budget Caps**: Prevent overspending per agent per day
- **Rate Limiting**: Max tasks per agent per day
- **Accuracy Thresholds**: Auto-pause agents if accuracy drops too low
- **Enforcement**: Governor rules checked before task execution
- **Recording**: Track accuracy metrics and pause/resume agents

**Key Files:**
- `backend/src/governor.ts` - Governor rule enforcement
- `backend/src/index.ts` - checkGovernorRules in POST /api/tasks

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+ (running locally or cloud)
- (Optional) OpenAI API key for real AI
- (Optional) Clerk account for authentication
- (Optional) Gmail account for email

### 1. Environment Configuration

#### Backend Setup
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Database (required)
DATABASE_URL=postgresql://user:password@localhost:5432/workplace_ai

# Server
PORT=3001
NODE_ENV=development

# Phase 2: Real AI (optional - works with mock data if missing)
OPENAI_API_KEY=sk-your-openai-api-key

# Phase 2: Real Auth (optional - works without auth)
CLERK_API_KEY=pk_test_your-clerk-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret

# Phase 2: Real Email (optional)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Phase 2: Governor Rate Limiting
GOVERNOR_BUDGET_CAP=1000        # $ per day
GOVERNOR_RATE_LIMIT=100         # tasks per day
GOVERNOR_ACCURACY_THRESHOLD=70  # % minimum
```

#### Frontend Setup
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-key  # optional
VITE_ENV=development
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Database Setup

Start PostgreSQL and create database:
```bash
psql -U postgres -c "CREATE DATABASE workplace_ai;"
```

Alternatively, if using a cloud database (Render, Railway, Supabase):
- Update `DATABASE_URL` in `.env` to your cloud database URL
- First run of backend will auto-create tables

### 4. Local Testing

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
# You'll see config status: OpenAI=true, Clerk=false, Email=false (depends on .env)
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

Open http://localhost:3000 in browser

---

## API Endpoints (Phase 2)

### Health Check
```bash
GET /api/health
# Response includes config status
{
  "status": "ok",
  "config": {
    "openai": true,
    "clerk": false,
    "email": true,
    "database": "connected"
  }
}
```

### Simulations (Now with Real AI)
```bash
POST /api/simulations
{
  "org_id": 1,
  "agent_id": 1
}
# Returns: accuracy, cost, latency, failure_rate from OpenAI analysis
```

### New: Task Execution (Real LLM)
```bash
POST /api/tasks
{
  "org_id": 1,
  "agent_id": 1,
  "deployment_id": 1,
  "input": "Process customer request about order status"
}
# Checks governor rules first
# Executes task with GPT-4
# Returns: output, cost, status
```

### Deployments (Now Sends Email)
```bash
POST /api/deployments
{
  "org_id": 1,
  "agent_id": 1,
  "environment": "production"
}
# Triggers email to user if EMAIL_USER configured
```

### New: Audit Logs
```bash
GET /api/audit/1
# Returns: all actions for org 1 (hire, deploy, simulate, task, etc.)
[
  {
    "id": "uuid",
    "action": "deploy",
    "resource_type": "agent",
    "resource_id": 1,
    "user_id": 1,
    "ip_address": "192.168.1.1",
    "details": { ... },
    "created_at": "2026-01-23T..."
  }
]
```

### Governor Rules
```bash
POST /api/governor
{
  "org_id": 1,
  "agent_id": 1,
  "budget_cap": 1000,
  "rate_limit": 100,
  "accuracy_threshold": 70
}

GET /api/governor/1/1
# Returns: current rules for org:agent
```

---

## Configuration Options

### OpenAI Integration

**Without OpenAI key** (demo mode):
- Simulations return mock metrics (85% accuracy, random cost)
- Works immediately, no setup needed
- Perfect for testing UI/UX

**With OpenAI key** (production):
- Simulations use real GPT-4 analysis
- Metrics based on actual test case evaluation
- Tasks execute with real agent reasoning
- Cost: ~$0.01-$0.10 per simulation, ~$0.02-$0.05 per task

**Get API Key:**
1. Visit https://platform.openai.com/api-keys
2. Create new secret key
3. Paste in `OPENAI_API_KEY` in `.env`

### Clerk Authentication

**Without Clerk** (demo mode):
- App works for any visitor
- Auto-creates test organization
- No login required
- Perfect for investor demos

**With Clerk** (production):
- Real user authentication
- Only verified users can access
- User data included in audit logs
- Email/password or social login

**Get Clerk Key:**
1. Sign up at https://dashboard.clerk.com
2. Create new application
3. Copy Publishable Key → `VITE_CLERK_PUBLISHABLE_KEY`
4. Copy API Key → `CLERK_API_KEY`
5. Copy Secret Key → `CLERK_SECRET_KEY`

### Email Sending

**Gmail (Recommended):**
1. Enable 2-factor authentication on your Gmail account
2. Generate app password: https://myaccount.google.com/apppasswords
3. Set `EMAIL_USER` = your Gmail address
4. Set `EMAIL_PASSWORD` = generated app password

**Custom SMTP:**
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
```

---

## Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables from `.env`
6. Deploy

Backend URL: `https://your-app.onrender.com`

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import GitHub project
4. Add environment variables:
   ```
   VITE_API_URL=https://your-app.onrender.com/api
   VITE_CLERK_PUBLISHABLE_KEY=pk_...
   ```
5. Deploy

Frontend URL: `https://your-app.vercel.app`

---

## Testing Phase 2 Features

### Test 1: Real AI Simulation
```bash
# Create agent
curl -X POST http://localhost:3001/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "name": "Support Agent",
    "role": "customer support",
    "description": "Handles customer queries",
    "tools": ["search_kb", "escalate", "send_email"],
    "cost_per_task": 5
  }'

# Run simulation (uses real OpenAI if key set)
curl -X POST http://localhost:3001/api/simulations \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "agent_id": 1
  }'

# Response will include real metrics from GPT-4 analysis
```

### Test 2: Governor Rate Limiting
```bash
# Set governor rules
curl -X POST http://localhost:3001/api/governor \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "agent_id": 1,
    "budget_cap": 50,      # $50 per day
    "rate_limit": 10,      # 10 tasks per day
    "accuracy_threshold": 80
  }'

# Run tasks until hitting limit (will fail with 429 when budget/rate exceeded)
for i in {1..15}; do
  curl -X POST http://localhost:3001/api/tasks \
    -H "Content-Type: application/json" \
    -d "{
      \"org_id\": 1,
      \"agent_id\": 1,
      \"input\": \"Test task $i\"
    }"
done
```

### Test 3: Audit Logs
```bash
# After hiring/deploying/simulating, check audit trail
curl http://localhost:3001/api/audit/1

# Response shows all actions:
# [
#   {"action": "hire", "resource_id": 1, ...},
#   {"action": "simulate", "resource_id": 1, ...},
#   {"action": "deploy", "resource_id": 1, ...}
# ]
```

### Test 4: Email Sending (if configured)
```bash
# Deploy an agent (should send email if EMAIL_USER set)
curl -X POST http://localhost:3001/api/deployments \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "agent_id": 1,
    "environment": "production"
  }'

# Check your email inbox for deployment notification
```

---

## Troubleshooting

### Issue: "Cannot find module 'openai'"
**Solution:**
```bash
cd backend
npm install @clerk/clerk-sdk-node openai zod uuid
```

### Issue: OpenAI returns 401 "Invalid API Key"
**Solution:**
1. Check `OPENAI_API_KEY` in `.env` - should be `sk-...`
2. Verify key is not expired at https://platform.openai.com/account/api-keys
3. Check key has not been revoked

### Issue: Clerk login not showing
**Solution:**
1. Verify `VITE_CLERK_PUBLISHABLE_KEY` is set in `frontend/.env`
2. Restart frontend dev server
3. Check browser console for errors
4. Clerk is optional - app still works without it

### Issue: Email not sending
**Solution:**
1. Check `EMAIL_USER` and `EMAIL_PASSWORD` in backend `.env`
2. For Gmail: use app password, not your login password
3. Verify 2FA is enabled on Gmail account
4. Check backend logs for nodemailer errors
5. Email is optional - app still works without it

### Issue: Governor rules not enforcing
**Solution:**
1. Verify governor rules created: `GET /api/governor/1/1`
2. Budget spent is tracked daily (midnight UTC reset)
3. Check audit logs: `GET /api/audit/1` to see enforcement

### Issue: Audit logs table not created
**Solution:**
- Restart backend server
- Check database connection in `DATABASE_URL`
- Verify PostgreSQL is running
- Check backend logs for SQL errors

---

## Next Steps

### Phase 3 Recommended Features (2-3 weeks)
1. **Advanced Analytics**: Dashboards with real usage metrics
2. **Agent Fine-tuning**: Custom training for specific domains
3. **Integration Marketplace**: Connect to Slack, Teams, external APIs
4. **Multi-tenancy**: Full workspace isolation per org
5. **Payment Processing**: Stripe integration for billing
6. **Advanced Monitoring**: Error tracking, performance metrics
7. **Custom Models**: Support for local or custom LLM providers

---

## Support

**Quick Links:**
- OpenAI Docs: https://platform.openai.com/docs
- Clerk Docs: https://clerk.com/docs
- NodeMailer Docs: https://nodemailer.com/smtp/
- PostgreSQL Docs: https://www.postgresql.org/docs/

**Questions?**
- Check logs: Backend runs on `http://localhost:3001`, Frontend on `http://localhost:3000`
- Run health check: `curl http://localhost:3001/api/health`
- Review new Phase 2 services: `backend/src/services.ts`, `audit.ts`, `governor.ts`

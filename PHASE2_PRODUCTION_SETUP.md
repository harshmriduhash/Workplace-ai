# Phase 2: Production-Ready Setup Guide

This guide walks you through enabling all Phase 2 features for a **real, production-ready** Workplace-AI product.

**Status**: MVP with real auth, real AI, real email, audit logging, and rate limiting.

---

## Quick Setup (5-10 minutes)

### 1. Get API Keys

#### OpenAI (Required for Real AI)
```bash
# Go to: https://platform.openai.com/api-keys
# Create new API key
# Add $20 credit at https://platform.openai.com/account/billing/overview
```

#### Clerk (Optional - Auth Works Without It)
```bash
# Go to: https://dashboard.clerk.com
# Create new app
# Copy CLERK_API_KEY and CLERK_SECRET_KEY
```

#### Gmail (For Email Sending)
```bash
# 1. Go to: https://myaccount.google.com/apppasswords
# 2. Select Mail and Windows/Mac/Linux
# 3. Copy the 16-character app password
# 4. Use this as EMAIL_PASSWORD (not your Gmail password!)
```

### 2. Configure Environment

```bash
# Copy template
cp backend/.env.example backend/.env

# Edit backend/.env with your keys
# REQUIRED:
#   - OPENAI_API_KEY (from OpenAI dashboard)
#   - EMAIL_USER (your Gmail address)
#   - EMAIL_PASSWORD (Gmail app password)

# OPTIONAL:
#   - CLERK_API_KEY (for real user auth)
#   - GOVERNOR_* (budget caps, rate limits)
```

### 3. Install & Run

```bash
cd backend
npm install
npm run dev
# Server should start on port 3001 with all features enabled
```

Check the logs:
```
✅ Server running on port 3001
🔧 Config: OpenAI=true, Clerk=true, Email=true
```

---

## Phase 2 Features

### 1. Real AI Simulations
**What's New**: Agent simulations now use OpenAI GPT-4 instead of random data.

```bash
# Run simulation with real AI analysis
curl -X POST http://localhost:3001/api/simulations \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "agent_id": 1
  }'
```

**Response includes real metrics**:
```json
{
  "accuracy": 87.5,
  "cost": 3.42,
  "latency": 1850,
  "failure_rate": 2.1,
  "test_results": { "detailed": "analysis" }
}
```

**Fallback Behavior**: If OPENAI_API_KEY missing, uses realistic mock data.

### 2. Real Task Execution
**New Endpoint**: `POST /api/tasks` - Execute actual agent tasks with LLM.

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "agent_id": 1,
    "deployment_id": 1,
    "input": "Analyze customer sentiment from feedback"
  }'
```

**Returns actual LLM output**:
```json
{
  "task_id": "uuid-xxx",
  "status": "completed",
  "output": "The customer feedback shows 85% positive sentiment...",
  "cost": 2.50
}
```

### 3. Real Email Deployment
**What's New**: Deployments now send real emails via Gmail.

```bash
curl -X POST http://localhost:3001/api/deployments \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "agent_id": 1,
    "environment": "production"
  }'
```

**Result**: User receives email:
```
To: user@company.com
Subject: Agent DataAnalyst Agent Deployed

Agent DataAnalyst Agent (role: data_analyst) has been deployed to production.
You can now run tasks and monitor performance.
```

### 4. Audit Logging
**What's New**: Every action is logged for compliance and debugging.

```bash
# Get audit trail for organization
curl http://localhost:3001/api/audit/1?limit=50
```

**Logged Actions**: hire, deploy, simulate, task, create_governor_rule, etc.

**Example Log Entry**:
```json
{
  "action": "deploy",
  "resource_type": "agent",
  "resource_id": 1,
  "user_id": 1,
  "details": { "environment": "production" },
  "ip_address": "192.168.1.1",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 5. Governor Rate Limiting
**What's New**: Automatic enforcement of budget caps, rate limits, accuracy thresholds.

```bash
# Set governance rules
curl -X POST http://localhost:3001/api/governor \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "agent_id": 1,
    "budget_cap": 500,
    "rate_limit": 50,
    "accuracy_threshold": 75
  }'
```

**Enforcement**:
- Task rejected if daily spend > budget_cap
- Task rejected if daily count > rate_limit
- Agent auto-paused if accuracy drops below threshold

**Response when blocked**:
```json
{
  "error": "Daily budget of $500 exceeded"
}
```

### 6. Real Authentication (Optional)
**What's New**: Clerk integration for real user identity.

**Works without Clerk**:
```bash
# This request works fine without authentication
curl http://localhost:3001/api/health
# Returns: { "status": "ok", "config": { "openai": true, ... } }
```

**With Clerk (Advanced)**:
```bash
# Pass Clerk token in header
curl -H "Authorization: Bearer <clerk-token>" \
  http://localhost:3001/api/agents/1
```

---

## Environment Variables Reference

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | Yes | `postgresql://...` | PostgreSQL connection |
| `OPENAI_API_KEY` | No* | `sk-...` | Real AI simulations & tasks |
| `EMAIL_USER` | No* | `user@gmail.com` | Sender email address |
| `EMAIL_PASSWORD` | No* | `xxxx xxxx xxxx xxxx` | Gmail app password |
| `CLERK_API_KEY` | No | `pk_test_...` | User authentication |
| `GOVERNOR_BUDGET_CAP` | No | `1000` | Daily spend limit ($) |
| `GOVERNOR_RATE_LIMIT` | No | `100` | Daily task limit |
| `GOVERNOR_ACCURACY_THRESHOLD` | No | `70` | Auto-pause accuracy (%) |

*Optional - system falls back to mock data/local email if missing

---

## Deployment Checklist

### Before Going to Production

- [ ] **OpenAI Account**: Create account and add payment method
- [ ] **Email Setup**: Gmail account with app password configured
- [ ] **Database**: PostgreSQL database created and accessible
- [ ] **Secrets**: All API keys stored in environment variables
- [ ] **Audit Table**: Database initialized (automatic on first run)
- [ ] **Rate Limiting**: Governor rules configured for your agents

### Render Deployment (Backend)

```bash
# 1. Connect repo to Render
# 2. Set environment variables in Render dashboard:
DATABASE_URL=<your-postgres-url>
OPENAI_API_KEY=<your-key>
EMAIL_USER=<your-gmail>
EMAIL_PASSWORD=<your-app-password>
CLERK_API_KEY=<optional>

# 3. Deploy
# 4. Monitor logs for errors
```

### Vercel Deployment (Frontend)

```bash
# 1. Connect repo to Vercel
# 2. Add environment variable:
REACT_APP_API_URL=<your-render-backend-url>

# 3. Deploy
```

---

## Testing Phase 2 Features

### Test Real AI Simulation

```bash
# 1. Hire an agent
AGENT_ID=$(curl -X POST http://localhost:3001/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "name": "Test Agent",
    "role": "data_analyst",
    "tools": ["pandas", "matplotlib"],
    "cost_per_task": 5.0
  }' | jq -r '.id')

# 2. Run simulation with real AI
curl -X POST http://localhost:3001/api/simulations \
  -H "Content-Type: application/json" \
  -d "{\"org_id\": 1, \"agent_id\": $AGENT_ID}"

# Check metrics are realistic (not random)
```

### Test Real Task Execution

```bash
# 1. Deploy agent
DEPLOY_ID=$(curl -X POST http://localhost:3001/api/deployments \
  -H "Content-Type: application/json" \
  -d "{\"org_id\": 1, \"agent_id\": $AGENT_ID, \"environment\": \"testing\"}" \
  | jq -r '.id')

# 2. Run real task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d "{
    \"org_id\": 1,
    \"agent_id\": $AGENT_ID,
    \"deployment_id\": $DEPLOY_ID,
    \"input\": \"What is the market size for AI agents?\"
  }"

# Check email was received (watch your Gmail inbox)
```

### Test Governor Rules

```bash
# 1. Set strict budget ($10/day)
curl -X POST http://localhost:3001/api/governor \
  -H "Content-Type: application/json" \
  -d "{
    \"org_id\": 1,
    \"agent_id\": $AGENT_ID,
    \"budget_cap\": 10,
    \"rate_limit\": 5,
    \"accuracy_threshold\": 80
  }"

# 2. Try to run expensive task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d "{
    \"org_id\": 1,
    \"agent_id\": $AGENT_ID,
    \"input\": \"Run 1000 test cases\"
  }"

# Should be blocked: Daily budget of $10 exceeded
```

### Test Audit Logs

```bash
# Fetch all actions for organization
curl http://localhost:3001/api/audit/1?limit=20 | jq

# See: hire, deploy, simulate, task, create_governor_rule actions
```

---

## Troubleshooting

### Error: "Cannot find module 'openai'"

```bash
npm install openai @clerk/clerk-sdk-node zod uuid
```

### Error: "OPENAI_API_KEY not found"

```bash
# Check your .env file
cat backend/.env | grep OPENAI_API_KEY

# If using Render, check dashboard Environment Variables
# If using local, make sure you ran:
# cp backend/.env.example backend/.env
# Then edited with your real key
```

### Simulations return random data

**This means OPENAI_API_KEY is not set.** System automatically falls back to mock data.

To enable real AI:
1. Get key from https://platform.openai.com/api-keys
2. Add to .env: `OPENAI_API_KEY=sk-...`
3. Restart server

### Email not being sent

Check EMAIL_USER and EMAIL_PASSWORD:
```bash
# Test with nodemailer
npm run test:email

# Or check:
1. Using Gmail app password (not Gmail password)
2. Account has less-secure apps disabled (using app passwords instead)
3. EMAIL_USER matches the Gmail account
```

### Governor rules not blocking

Check rates are configured:
```bash
curl http://localhost:3001/api/governor/1/1
# Should return your rules, not empty object
```

---

## Performance Tuning

### Speed Up Simulations

```env
# Use faster model (gpt-3.5-turbo instead of gpt-4)
# In backend/src/services.ts, change:
model: 'gpt-3.5-turbo'  # 10x faster, cheaper
```

### Reduce Email Latency

```env
# Use SMTP instead of Gmail
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<your-sendgrid-key>
```

### Optimize Database

```sql
-- Add indexes for common queries
CREATE INDEX idx_tasks_org_created ON tasks(org_id, created_at DESC);
CREATE INDEX idx_audit_org_created ON audit_logs(org_id, created_at DESC);
```

---

## Cost Estimation

**Monthly costs for 1000 tasks/month**:

| Service | Price | Monthly (1000 tasks) |
|---------|-------|---------------------|
| OpenAI GPT-4 | $0.03/1K tokens | ~$30 |
| Email (SendGrid) | Free (100/day) | $0 |
| Database (Render) | Free-$15 | $15 |
| **Total** | | **~$45** |

**To reduce costs**:
1. Use gpt-3.5-turbo instead of gpt-4 (-80%)
2. Batch tasks together
3. Use model caching
4. Set reasonable rate limits via governor

---

## Next Steps

1. ✅ Phase 2 Core Features (Completed)
   - Real AI via OpenAI
   - Real email via Gmail
   - Audit logging
   - Governor rate limiting
   - Optional Clerk auth

2. 🔲 Phase 3 (Future)
   - Advanced workflow automation
   - Webhook handlers
   - Custom agent templates
   - Advanced analytics
   - Stripe billing (optional)

---

## Support

- **Backend Issues**: Check `backend/src/index.ts` logs
- **OpenAI Issues**: Verify API key at https://platform.openai.com
- **Email Issues**: Check Gmail app passwords at https://myaccount.google.com/apppasswords
- **Database Issues**: Verify DATABASE_URL connection string

---

**Status**: 🎉 Your Workplace-AI MVP is now production-ready with real users!

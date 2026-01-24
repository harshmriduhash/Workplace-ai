# Phase 2 Deployment Checklist

## Pre-Deployment (Development)

### Environment Setup
- [ ] OpenAI account created at https://platform.openai.com
- [ ] OpenAI API key generated and tested
- [ ] Gmail account configured with app password
- [ ] PostgreSQL database created and accessible
- [ ] Backend `.env` file created with all required keys
- [ ] `npm install` completed in backend directory
- [ ] `npm run dev` starts without errors
- [ ] Server logs show: ✅ Server running on port 3001

### Feature Testing

#### Test Real AI Simulations
```bash
# 1. Hire test agent
curl -X POST http://localhost:3001/api/agents \
  -H "Content-Type: application/json" \
  -d '{"org_id":1,"name":"Test","role":"analyst","tools":[],"cost_per_task":5}'

# 2. Run simulation
curl -X POST http://localhost:3001/api/simulations \
  -H "Content-Type: application/json" \
  -d '{"org_id":1,"agent_id":1}'

# VERIFY: accuracy, cost, latency, failure_rate are realistic (not random)
- [ ] Accuracy is between 70-95%
- [ ] Cost is between $0.01-$10.00
- [ ] Latency is between 500-5000ms
- [ ] Failure rate is between 0-10%
```

#### Test Real Task Execution
```bash
# 1. Deploy agent
curl -X POST http://localhost:3001/api/deployments \
  -H "Content-Type: application/json" \
  -d '{"org_id":1,"agent_id":1,"environment":"test"}'

# 2. Execute task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"org_id":1,"agent_id":1,"input":"Analyze this data"}'

# VERIFY: Task returns real LLM output
- [ ] Task status is "completed"
- [ ] Output contains substantive text (not mock)
- [ ] Cost is calculated realistically
- [ ] Email was sent (check Gmail inbox)
```

#### Test Governor Rules
```bash
# 1. Set strict limit
curl -X POST http://localhost:3001/api/governor \
  -H "Content-Type: application/json" \
  -d '{"org_id":1,"agent_id":1,"budget_cap":1,"rate_limit":1,"accuracy_threshold":95}'

# 2. Try to run task (should fail)
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"org_id":1,"agent_id":1,"input":"test"}'

# VERIFY: Blocked with 429 error
- [ ] Response status is 429
- [ ] Error message mentions budget exceeded
```

#### Test Audit Logging
```bash
# Fetch audit trail
curl http://localhost:3001/api/audit/1

# VERIFY: Contains all actions
- [ ] 'hire' action present
- [ ] 'simulate' action present
- [ ] 'deploy' action present
- [ ] 'task' action present
- [ ] Timestamps are correct
```

### Code Quality Checks

- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors in `backend/src/`
- [ ] All imports resolve correctly
- [ ] Database tables initialize automatically
- [ ] Error handling works (test with invalid input)

---

## Production Deployment (Render)

### Prepare Repository

- [ ] All Phase 2 code committed to git
- [ ] `.env.example` includes all new variables
- [ ] `README.md` updated with Phase 2 features
- [ ] `package.json` includes new dependencies (uuid, openai, zod)
- [ ] No secrets committed (only in `.env.example`)

### Configure Render Dashboard

**Set Environment Variables**:
```
DATABASE_URL = <your-production-postgres-url>
OPENAI_API_KEY = <your-production-openai-key>
EMAIL_USER = <your-gmail@gmail.com>
EMAIL_PASSWORD = <your-gmail-app-password>
CLERK_API_KEY = <optional-production-key>
GOVERNOR_BUDGET_CAP = 1000
GOVERNOR_RATE_LIMIT = 100
GOVERNOR_ACCURACY_THRESHOLD = 70
NODE_ENV = production
PORT = 3001
```

- [ ] All variables set in Render dashboard
- [ ] Database URL is production PostgreSQL (not local)
- [ ] OpenAI key is from production account
- [ ] Email credentials are verified and working

### Deploy & Verify

```bash
# Push to main branch (if using automatic deploys)
git push origin main

# OR manually deploy in Render dashboard
# Watch build logs for errors
```

**Post-Deployment Checks**:
- [ ] Backend starts without errors
- [ ] Health check passes: `GET /api/health`
- [ ] Response includes: `"config": { "openai": true, "email": true }`
- [ ] Database tables created automatically
- [ ] Can create organization: `POST /api/orgs`

### Smoke Tests on Production

```bash
# 1. Health check
curl https://<your-render-backend>/api/health

# 2. Create test agent
AGENT=$(curl -X POST https://<your-render-backend>/api/agents \
  -d '{"org_id":1,"name":"Test","role":"analyst"}' \
  | jq -r '.id')

# 3. Run production simulation
curl -X POST https://<your-render-backend>/api/simulations \
  -d "{\"org_id\":1,\"agent_id\":$AGENT}"

# VERIFY: Real metrics from OpenAI
- [ ] Request succeeded (200 status)
- [ ] Response includes realistic metrics
- [ ] No errors in backend logs
```

---

## Frontend Deployment (Vercel - Optional)

### Update Environment

Create `.env.local` in frontend directory:
```
REACT_APP_API_URL=https://<your-render-backend-url>
```

- [ ] API URL points to production Render backend
- [ ] Frontend builds without errors: `npm run build`
- [ ] No console errors in browser

### Deploy to Vercel

```bash
# Push frontend code
git push origin main

# Vercel auto-deploys
```

**Post-Deployment**:
- [ ] Frontend loads at `https://<your-vercel-domain>`
- [ ] Can navigate all pages
- [ ] API calls reach production backend
- [ ] Real simulation results display

---

## Post-Deployment Monitoring

### First 24 Hours

- [ ] Check backend logs hourly for errors
- [ ] Monitor database query performance
- [ ] Verify emails are sending successfully
- [ ] Check OpenAI API usage (should be low)
- [ ] Confirm no unexpected errors in Render dashboard

### Weekly Checklist

- [ ] Review audit logs for suspicious activity
- [ ] Check governor rules are functioning correctly
- [ ] Monitor OpenAI API costs
- [ ] Verify email delivery rates
- [ ] Performance metrics look normal

### Monthly Tasks

- [ ] Backup PostgreSQL database
- [ ] Review and optimize slow queries
- [ ] Check for security updates
- [ ] Analyze usage patterns
- [ ] Plan Phase 3 features

---

## Rollback Plan (If Issues)

### If Simulations Return Random Data
1. Check OPENAI_API_KEY is set in Render dashboard
2. Verify OpenAI account has sufficient credits
3. Check OpenAI API status page
4. Rollback to previous commit if needed

### If Emails Not Sending
1. Verify EMAIL_USER and EMAIL_PASSWORD in Render dashboard
2. Check Gmail account - may have disabled app password
3. Check spam folder for test emails
4. Temporary fix: Use SMTP_* variables instead of Gmail

### If Governor Rules Not Blocking
1. Verify GOVERNOR_BUDGET_CAP is set correctly
2. Check database has governance rules configured
3. Monitor POST /api/governor endpoint
4. Clear any cached governor state

### If Database Offline
1. Check PostgreSQL connection string
2. Verify database is running
3. Check inbound connections allowed from Render IP
4. Use Render database auto-backup to recover

---

## Success Criteria

You've successfully deployed Phase 2 when:

✅ **Real AI Works**
- [ ] Simulations return GPT-4 analysis (not random numbers)
- [ ] Accuracy metrics are 70-95% (realistic)
- [ ] Costs are calculated properly
- [ ] Fallback to mock data if key missing

✅ **Real Email Works**
- [ ] Deployment emails arrive in inbox
- [ ] Emails contain agent details
- [ ] Sent from configured EMAIL_USER

✅ **Audit Logging Works**
- [ ] All actions logged (hire, deploy, simulate, task)
- [ ] Can retrieve audit trail via API
- [ ] Includes timestamps and user info

✅ **Governor Enforcement Works**
- [ ] Tasks blocked when budget exceeded
- [ ] Tasks blocked when rate limit hit
- [ ] Agents paused when accuracy drops
- [ ] Pre-flight checks prevent expensive tasks

✅ **Production Ready**
- [ ] Zero unhandled errors in logs
- [ ] Database handles concurrent requests
- [ ] OpenAI API calls complete in <10 seconds
- [ ] Email sends within <1 second
- [ ] Can scale to multiple users

---

## Go-Live Announcement

Once all checks pass, you can announce:

> **Workplace-AI Phase 2 is Live! 🎉**
>
> We've built a **production-ready AI agent platform** with:
> - Real OpenAI GPT-4 integration for intelligent simulations
> - Real task execution with actual LLM outputs  
> - Real email notifications for deployments
> - Comprehensive audit logging for compliance
> - Automatic rate limiting for cost control
>
> **Ready for real users, real investment, real business impact.**

---

## Quick Fixes for Common Issues

### Issue: "openai module not found"
```bash
npm install openai
npm run dev
```

### Issue: "OPENAI_API_KEY not found"
```bash
# Check .env file has the key
cat backend/.env | grep OPENAI_API_KEY

# If not, add it:
echo "OPENAI_API_KEY=sk-your-key" >> backend/.env
```

### Issue: "simulations still returning random data"
```bash
# Check OpenAI API is actually being called
grep "OpenAI" backend/src/index.ts

# If not using real, check environment variable:
echo $OPENAI_API_KEY  # Should print your key, not empty
```

### Issue: "Emails not sending"
```bash
# Use Gmail app password, not regular Gmail password
# Go to: https://myaccount.google.com/apppasswords
# Get 16-character password and use as EMAIL_PASSWORD
```

---

## Support Resources

- **Phase 2 Setup Guide**: [PHASE2_PRODUCTION_SETUP.md](PHASE2_PRODUCTION_SETUP.md)
- **Implementation Details**: [PHASE2_COMPLETE.md](PHASE2_COMPLETE.md)
- **OpenAI Documentation**: https://platform.openai.com/docs
- **Render Deployment**: https://render.com/docs
- **Gmail App Passwords**: https://myaccount.google.com/apppasswords

---

**Status: Ready for production deployment! 🚀**

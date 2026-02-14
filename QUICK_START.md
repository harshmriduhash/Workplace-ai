# 🚀 WORKPLACE-AI - QUICK START GUIDE

**Complete Setup in 10 Minutes** | Last Updated: Feb 14, 2026

---

## ✅ STEP 1: Install Dependencies

```bash
# Install backend dependencies
cd workplace-ai/backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

**Status:** ✅ Already completed - 642 packages installed

---

## ✅ STEP 2: Configure Environment Variables

### Backend Configuration

Edit: `backend/.env.local`

**Required (Minimum Setup):**
```bash
# 1. Database URL
DATABASE_URL=postgresql://localhost:5432/workplace_ai

# 2. JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=GENERATE_A_RANDOM_64_CHARACTER_HEX_STRING

# 3. OpenAI API Key (get from: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

**Optional (Recommended for Production):**
```bash
# Email notifications (get from: https://myaccount.google.com/apppasswords)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Error tracking (get from: https://sentry.io/signup/)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Frontend Configuration

Edit: `frontend/.env.local`

```bash
# Backend API URL  
VITE_API_URL=http://localhost:3001
```

---

## 📦 STEP 3: Setup Database

### Option A: Local PostgreSQL (Recommended for Development)

```bash
# 1. Install PostgreSQL (if not already installed)
# macOS: brew install postgresql@14
# Start: brew services start postgresql@14

# 2. Create database
createdb workplace_ai

# 3. Update backend/.env.local
DATABASE_URL=postgresql://localhost:5432/workplace_ai
```

### Option B: Cloud Database (Recommended for Production)

**Using Supabase (FREE):**
1. Sign up: https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy "URI" format and paste into `backend/.env.local`

**Using Render (FREE):**
1. Sign up: https://render.com
2. Dashboard → New → PostgreSQL
3. Copy "External Database URL"
4. Paste into `backend/.env.local`

---

## 🎯 STEP 4: Initialize Database (Using Prisma)

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Verify tables created
npx prisma studio  # Opens database browser at http://localhost:5555
```

**Expected Output:**
```
✔ Generated Prisma Client
✔ Applied migration: init
✔ Database synced
```

---

## 🚀 STEP 5: Start the Application

### Terminal 1: Backend Server

```bash
cd workplace-ai/backend
npm run dev
```

**Expected Output:**
```
✅ Environment validated successfully
✅ Security headers configured
✅ Sentry initialized for error tracking
✅ Database initialized
✅ Server running on port 3001
📊 Dashboard: http://localhost:3001
```

### Terminal 2: Frontend App

```bash
cd workplace-ai/frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h for help, r to restart
```

---

## ✅ STEP 6: Verify Setup

### Test Backend Health

```bash
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-14T...",
  "config": {
    "openai": true,
    "clerk": false,
    "email": true,
    "database": "connected"
  }
}
```

### Test Frontend

1. Open browser: http://localhost:3000
2. You should see:
   - Workplace-AI landing page
   - Navigation bar
   - System status indicators

---

## 🎮 STEP 7: Quick Demo Flow

### 1. Create Organization
```bash
curl -X POST http://localhost:3001/api/orgs \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo Inc"}'
```

### 2. Hire an Agent (via UI or API)

**Via Frontend:**
- Go to "Agent Marketplace" tab
- Click "Hire Agent" on Support Agent
- Fill in details

**Via API:**
```bash
curl -X POST http://localhost:3001/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "name": "Support Agent Alpha",
    "role": "customer_support",
    "description": "Handles customer inquiries",
    "cost_per_task": 2.50
  }'
```

### 3. Run Simulation

```bash
curl -X POST http://localhost:3001/api/simulations \
  -H "Content-Type: application/json" \
  -d '{"org_id": 1, "agent_id": 1}'
```

### 4. View Analytics

Visit: http://localhost:3000/analytics

Or via API:
```bash
curl http://localhost:3001/api/analytics/1
```

---

## 🔧 TROUBLESHOOTING

### Issue: "DATABASE_URL is required"
**Solution:**
- Check `backend/.env.local` exists
- Verify DATABASE_URL is set
- Test connection: `psql $DATABASE_URL`

### Issue: "jest: command not found"
**Solution:**
- Already fixed - dependencies are installed
- Run: `cd backend && npm test`

### Issue: "Cannot connect to database"
**Solutions:**
1. PostgreSQL not running
   ```bash
   # macOS
   brew services start postgresql@14
   
   # Linux
   sudo systemctl start postgresql
   ```

2. Wrong connection string
   - Format: `postgresql://username:password@host:port/database`
   - Default local: `postgresql://localhost:5432/workplace_ai`

3. Database doesn't exist
   ```bash
   createdb workplace_ai
   ```

### Issue: "OpenAI API error"
**Solutions:**
1. Invalid API key
   - Verify key starts with `sk-` or `sk-proj-`
   - Get new key: https://platform.openai.com/api-keys

2. No credits
   - Add payment method: https://platform.openai.com/account/billing
   - Start with $20

3. Fallback mode
   - App works without OpenAI (uses mock data)
   - Real AI requires valid key

### Issue: Port already in use
**Solution:**
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

---

## 📊 NEXT STEPS

### Immediate (Week 1)
- [ ] Configure all API keys in`.env.local`
- [ ] Run tests: `cd backend && npm test`
- [ ] Test all features (hire, simulate, deploy, govern)
- [ ] View audit logs and analytics

### Short-term (Week 2-3)
- [ ] Deploy to Render/Vercel (see DEPLOYMENT.md)
- [ ] Invite 5-10 beta testers
- [ ] Monitor Sentry for errors
- [ ] Collect user feedback

### Production (Week 4+)
- [ ] Security audit
- [ ] Load testing
- [ ] Set up CI/CD
- [ ] Configure production database backups
- [ ] Set up monitoring alerts

---

## 📚 DOCUMENTATION

### Key Files Created
- `backend/.env.local` - Backend environment variables + API key sources
- `frontend/.env.local` - Frontend configuration
- `backend/prisma/schema.prisma` - Database schema (8 tables)
- `backend/src/index.ts` - Main server (543 lines)

### Full Documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide
- [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) - Detailed API setup
- [CRITICAL_FIXES_COMPLETE.md](CRITICAL_FIXES_COMPLETE.md) - Implementation details
- [production_readiness_audit.md](.gemini/antigravity/brain/.../production_readiness_audit.md) - Code review

### API Endpoints
```
GET    /api/health              - Health check
POST   /api/orgs                - Create organization
GET    /api/orgs/:id            - Get organization
POST   /api/agents              - Hire agent
GET    /api/agents/:org_id      - List agents
POST   /api/simulations         - Run simulation
GET    /api/simulations/:org_id - List simulations
POST   /api/deployments         - Deploy agent
GET    /api/deployments/:org_id - List deployments
POST   /api/tasks               - Execute task
GET    /api/tasks/:org_id       - List tasks
POST   /api/governor            - Create rule
GET    /api/governor/:org/:agent - Get rule
GET    /api/audit/:org_id       - Audit logs
GET    /api/analytics/:org_id   - Analytics
```

---

## 🆘 SUPPORT

### If Something Goes Wrong

1. **Check logs:**
   ```bash
   # Backend logs
   cd backend && npm run dev
   # Watch for errors in console
   
   # Database logs
   npx prisma studio  # Browse data at http://localhost:5555
   ```

2. **Reset database:**
   ```bash
   cd backend
   npx prisma migrate reset  # WARNING: Deletes all data
   npx prisma migrate dev --name init
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Get Help
- **Documentation:** Check `docs/` folder
- **Issues:** Review previous conversation logs
- **Testing:** Run `npm test` to verify code quality

---

## ✅ CHECKLIST: Is Everything Working?

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Health check returns `{"status":"ok"}`
- [ ] Can create organization via API
- [ ] Can hire agent (UI or API)
- [ ] Can run simulation
- [ ] Can deploy agent
- [ ] Can view analytics
- [ ] Database has data (check with Prisma Studio)
- [ ] Audit logs are recording actions

**Expected Time: 10-15 minutes for complete setup**

---

## 🎉 SUCCESS CRITERIA

When you see this, you're ready to use the platform:

✅ Backend running on http://localhost:3001  
✅ Frontend running on http://localhost:3000  
✅ Database connected and initialized  
✅ OpenAI API configured (or using fallback)  
✅ All health checks passing  
✅ Can create and manage agents  
✅ Simulations generating results  
✅ Audit logs recording actions  

---

**You're now ready to build your AI Agent Workforce! 🚀**

For production deployment, see: [DEPLOYMENT.md](DEPLOYMENT.md)

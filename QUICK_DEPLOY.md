# ⚡ 60-Minute Production Deployment Guide

**Goal:** Get working MVP live for investor demo in 60 minutes  
**Difficulty:** Easy (copy-paste steps)  
**Result:** Full-stack app on Vercel + Render with custom domain (optional)

---

## Prerequisites (Have These Ready)

- GitHub account (free)
- Vercel account (free, sign up with GitHub)
- Render account (free, sign up with GitHub)
- Credit card for Render PostgreSQL (optional, can use Supabase free tier)

**Total Cost:** $0 - $10/month (free tier to start)

---

## Step 1: Push to GitHub (5 min)

```bash
cd f:\Mark\ 14\Workplace-ai\workplace-ai-mvp

# Initialize git
git init
git add .
git commit -m "Initial commit: Workplace-AI MVP"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/workplace-ai-mvp.git
git branch -M main
git push -u origin main
```

✅ **Done!** Code is on GitHub.

---

## Step 2: Deploy Frontend to Vercel (15 min)

### 2.1 Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Find and select `workplace-ai-mvp`
5. Click "Import"

### 2.2 Configure Build

On the "Configure Project" page:
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 2.3 Environment Variables

Add these variables:
```
VITE_API_URL=http://localhost:3001
```

(You'll update this after backend deployment)

### 2.4 Deploy

Click "Deploy" and wait ~2-3 minutes.

✅ **Result:** Frontend is live at `https://workplace-ai-mvp.vercel.app`

---

## Step 3: Deploy Backend to Render (20 min)

### 3.1 Create Database

1. Go to https://render.com
2. Click "New +" → "PostgreSQL"
3. **Name:** `workplace-ai-db`
4. **Region:** Choose nearest to you
5. Click "Create Database"
6. Wait 2-3 minutes, then copy **DATABASE_URL** (looks like `postgresql://...`)
7. **Keep this secret!** Save it somewhere safe.

### 3.2 Deploy Backend

1. Click "New +" → "Web Service"
2. Select your GitHub repo
3. Configure:
   - **Name:** `workplace-ai-api`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or Starter for better performance)

### 3.3 Add Environment Variables

Click "Environment" and add:
```
DATABASE_URL=postgresql://user:pass@...   (from database creation)
JWT_SECRET=your-secret-key-here            (any random string)
NODE_ENV=production
VERCEL_URL=https://workplace-ai-mvp.vercel.app
```

### 3.4 Deploy

Click "Create Web Service" and wait ~5-10 minutes.

✅ **Result:** Backend is live at `https://workplace-ai-api.onrender.com`

---

## Step 4: Link Frontend to Backend (5 min)

### 4.1 Update Vercel Environment

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://workplace-ai-api.onrender.com
   ```

### 4.2 Redeploy Frontend

1. Go to Deployments tab
2. Click the latest deployment
3. Click "..." → "Redeploy"
4. Click "Redeploy" again

Wait ~2 minutes for new build.

✅ **Done!** Frontend and backend are connected.

---

## Step 5: Verify Deployment (5 min)

### 5.1 Test Backend Health

```bash
curl https://workplace-ai-api.onrender.com/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### 5.2 Test Frontend

1. Visit `https://workplace-ai-mvp.vercel.app`
2. You should see:
   - Workplace-AI navbar
   - Dashboard with metrics
   - Can navigate to Agents, Simulations, etc.

### 5.3 Test Full Flow

1. Click "Agents" → "Hire Agent" (Support Agent)
2. Click "Simulations" → "Run Simulation"
3. Click "Deployments" → "Deploy Agent"
4. Click "Governor" → Set rules
5. Click "Analytics" → See metrics

✅ **Everything works!**

---

## Step 6: Custom Domain (Optional, 10 min)

### 6.1 Vercel Custom Domain

1. In Vercel, go to Settings → Domains
2. Add your domain (e.g., `workplace-ai.com`)
3. Follow Vercel's DNS setup instructions
4. Wait ~15-30 min for DNS propagation

### 6.2 Render Custom Domain

1. In Render, select your backend service
2. Go to Settings → Custom Domain
3. Add API domain (e.g., `api.workplace-ai.com`)
4. Follow Render's DNS setup instructions

✅ **You now have:**
- `https://workplace-ai.com` → Frontend
- `https://api.workplace-ai.com` → Backend

---

## Troubleshooting

### "Frontend can't reach backend"

**Solution:**
1. Check Render backend is running: https://your-api.onrender.com/api/health
2. Verify `VITE_API_URL` in Vercel matches your backend URL
3. Redeploy frontend in Vercel

### "Database connection failed"

**Solution:**
1. Check DATABASE_URL in Render environment is correct
2. Verify IP whitelist allows all IPs (Render dashboard → Database)
3. Restart backend in Render dashboard

### "Deployment still building"

**Solution:**
- Backend builds take 5-10 min on free tier
- Frontend rebuilds take 2-3 min
- Check deployment status in dashboard

---

## Post-Deployment Checklist

- [ ] GitHub repo created and pushed
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] PostgreSQL database created
- [ ] Environment variables set (both services)
- [ ] Frontend can reach backend API
- [ ] Can hire agents
- [ ] Can run simulations
- [ ] Can deploy agents
- [ ] Can set governor rules
- [ ] Analytics dashboard loads

---

## Demo with Investors Tomorrow

### URLs to Share

```
Frontend:  https://workplace-ai-mvp.vercel.app
Backend:   https://workplace-ai-api.onrender.com
GitHub:    https://github.com/YOUR_USERNAME/workplace-ai-mvp
```

### Demo Script (15 min)

See `INVESTOR_DEMO.md` in project root.

### Live Demo Flow

1. **Open dashboard** (show metrics)
2. **Hire Support Agent** (show marketplace)
3. **Run Simulation** (show accuracy/cost)
4. **Deploy Agent** (show environment)
5. **Set Governor Rules** (show governance)
6. **View Analytics** (show ROI)

---

## Costs

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100 GB/month | Free |
| Render | 0.5 GB RAM | Free |
| PostgreSQL | - | $7/month |
| **Total** | - | **$7/month** |

**To reduce costs:**
- Use Supabase PostgreSQL (free tier: 500 MB)
- Use Railway PostgreSQL (free $5 credit)
- Total cost: **$0-5/month**

---

## Monitoring After Launch

### Daily Checks
- [ ] Backend is responding: `/api/health` endpoint
- [ ] No database errors: Check Render logs
- [ ] Frontend loads: Visit deployed URL

### Weekly Checks
- [ ] Agent tasks running smoothly
- [ ] No cost overages
- [ ] Performance is acceptable

### Monthly Checks
- [ ] Upgrade to Starter tier if needed
- [ ] Review database size (auto-scale if needed)
- [ ] Check error logs

---

## Success Indicators

✅ All these should work:
- Frontend loads without errors
- Navigation between pages works
- Can create organization (auto)
- Can hire agents from marketplace
- Can run simulations and see results
- Can deploy agents
- Can set governor rules
- Can view analytics dashboard
- API responds to all endpoints

---

## Next Steps After Deployment

1. **Share URLs with investors** (send them the deployed links)
2. **Run investor demo** (use script in INVESTOR_DEMO.md)
3. **Collect feedback** (what features do they want?)
4. **Plan Phase 2** (Slack integration, custom agents, etc.)

---

## Support

**If something breaks:**

1. **Check deployment logs:**
   - Vercel: Dashboard → Deployments → [latest] → Logs
   - Render: Dashboard → [service] → Logs

2. **Check database connection:**
   - Render: Database → Logs
   - Query: `SELECT 1;`

3. **Restart services:**
   - Vercel: Redeploy latest
   - Render: Manual restart in dashboard

4. **Last resort:**
   - Delete deployment and start over
   - Code doesn't change, just redeploy

---

## Timeline Summary

| Step | Time | Status |
|------|------|--------|
| 1. Push to GitHub | 5 min | ✅ |
| 2. Vercel Frontend | 15 min | ✅ |
| 3. Render Backend | 20 min | ✅ |
| 4. Link Services | 5 min | ✅ |
| 5. Verify | 5 min | ✅ |
| 6. Custom Domain | 10 min | ⏳ Optional |
| **Total** | **60 min** | **✅ Done** |

---

**You're now ready for your investor demo tomorrow!** 🎉

After deployment, visit your live URLs and confirm everything works before the meeting.

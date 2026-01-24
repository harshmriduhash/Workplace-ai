# Investor Demo Script - Workplace-AI MVP

## Presentation Timeline: 15 minutes

---

## PART 1: Introduction (2 min)

**Script:**
"Workplace-AI is an Agent Workforce Operating System. Think of it like hiring AI employees - with full accountability, governance, and ROI metrics.

Most AI tools today are chatbots that break silently. We solve this with mandatory testing, production governance, and cost transparency.

Today I'll show you four core capabilities: hiring, testing, deployment, and governance."

---

## PART 2: Agent Marketplace Demo (3 min)

**Live Demo - Walk through:**

1. **Click "Agents" in navbar**
   - Show three pre-configured agent cards
   - Point out: Role, Description, Cost/Task

2. **Hire Support Agent**
   - Click "Hire Agent"
   - Show success message
   - Explain: "Just hired a 24/7 support worker for $0.50/task vs $10/task for humans"

3. **Hire Sales SDR**
   - Show cost is $1.25/task
   - Mention: "Handles lead qualification, meeting scheduling, outreach"

**Key Talking Point:**
"These agents are pre-configured with specific tools, permissions, and success metrics. You don't hire chaos - you hire professionals."

---

## PART 3: Simulation (Testing) Demo (3 min)

**Live Demo - Walk through:**

1. **Click "Simulations" in navbar**
   - Explain: "Before any agent touches real data, it must pass simulation"

2. **Select Support Agent, click "Run Simulation"**
   - Show progress
   - Wait for completion

3. **Review Simulation Results**
   - Accuracy: 87.3%
   - Cost: $12.50
   - Latency: 2,341ms
   - Failure Rate: 4.2%

4. **Point out metrics**
   - "This agent is good enough to deploy"
   - "If accuracy was below 80%, we'd reject it"

**Key Talking Point:**
"Simulation is our safety net. Every agent must prove itself on historical data before touching production. No surprises, no fires at 3am."

---

## PART 4: Deployment & Governor Demo (4 min)

1. **Click "Deployments"**
   - Show deployment form
   - Select Support Agent
   - Click "Deploy Agent"
   - Show success

2. **Check Dashboard**
   - Refresh
   - Show "Active Agents: 1"
   - Show updated metrics

3. **Click "Governor"**
   - Select Support Agent
   - Set:
     - Budget Cap: $100/month
     - Rate Limit: 1000 tasks/day
     - Accuracy Threshold: 80%
   - Click "Save Rules"

4. **Explain Governor**
   - "Budget cap: if agent exceeds $100, it pauses automatically"
   - "Rate limit: prevents runaway execution"
   - "Accuracy threshold: if accuracy drops below 80%, we rollback"

**Key Talking Point:**
"This is infrastructure governance. Just like Kubernetes manages containers, Governor manages AI agents. You maintain full control, full visibility."

---

## PART 5: Analytics (ROI) Demo (2 min)

1. **Click "Analytics"**
   - Show dashboards
   - Metrics:
     - Total Tasks: 0 (new deployment)
     - Total Cost: $0.00
     - Cost Per Task: $0.00

2. **Scroll to ROI Table**
   - Show comparison:
     - AI Cost: $0.50-$2.00/task
     - Human Cost: $10.00/task
     - Savings: 75-95%
   - Show capacity: 10 tasks/hour AI vs 3 tasks/hour human
   - Show availability: 24/7 vs 9-5

**Key Talking Point:**
"On day one, you've already justified the cost. On day 30, you're saving 10x what you spent. That's leverage."

---

## PART 6: Closing Pitch (1 min)

**Script:**
"What we've shown you today is enterprise-grade AI:
- Safe: Mandatory testing
- Governed: Budget/accuracy/rate controls
- Transparent: Real ROI metrics
- Scalable: Hire agents like employees

This isn't ChatGPT with guardrails. This is an OS for managing AI labor at scale.

The market for AI workforce management is just opening up. We're building the Kubernetes of AI agents."

---

## PART 7: Q&A / Follow-up

**Anticipated Questions & Answers:**

**Q: "How do you prevent hallucinations?"**
A: "Three layers: 1) Agent design with constrained tools, 2) Mandatory simulation with accuracy metrics, 3) Governor rules that pause on accuracy drops."

**Q: "Can I integrate my own data/tools?"**
A: "V2 ships with custom tool builder and connector framework. MVP includes email, APIs, and knowledge bases."

**Q: "What's your pricing?"**
A: "$49/agent/month for Starter, $99/agent/month for Pro. Usage-based overage pricing."

**Q: "How is this different from [competitor]?"**
A: "We focus on governance + ROI, not chat. Others optimize for UX; we optimize for accountability. That's the enterprise difference."

**Q: "Timeline to revenue?"**
A: "MVP ships this week. We're starting with 3 agents. By Q2, 20 agents across HR, ops, sales, support."

---

## Demo Data Refresh (if needed)

If you need fresh demo data between presentations:

```bash
# Reset database
DROP DATABASE workplace_ai;
CREATE DATABASE workplace_ai;

# Restart backend
cd backend && npm run dev
```

This resets to empty org.

---

## Presentation Files to Download

1. **Deployed MVP:**
   - Frontend: https://workplace-ai-xxxxx.vercel.app
   - Backend Health: https://workplace-ai-api.onrender.com/api/health

2. **Code Access:**
   - GitHub: [your repo]
   - README: See README.md in repo

3. **Metrics to Show:**
   - MVP built in < 24 hours
   - 5 modules (Marketplace, Simulator, Deployments, Governor, Analytics)
   - React + TypeScript frontend
   - Node.js + PostgreSQL backend
   - Production-ready architecture

---

## Backup Slides (optional)

### Architecture Slide
```
┌─────────────────────────────────────────┐
│           React Frontend                 │
│         (Vercel CDN)                     │
└──────────────┬──────────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────────┐
│         Express API Server               │
│         (Render/Railway)                 │
└──────────────┬──────────────────────────┘
               │ TCP/5432
┌──────────────▼──────────────────────────┐
│       PostgreSQL Database                │
│    (Render/Railway/Supabase)            │
└─────────────────────────────────────────┘
```

### Features Grid
| Feature | Status | Value |
|---------|--------|-------|
| Agent Marketplace | ✅ | Pre-configured hiring |
| Simulation Engine | ✅ | Safety testing |
| Deployments | ✅ | Safe production |
| Governor Rules | ✅ | Cost/accuracy control |
| Analytics | ✅ | ROI transparency |
| RBAC | ✅ | Enterprise access |
| Audit Logs | ⏳ | Phase 2 |
| Custom Tools | ⏳ | Phase 2 |

---

## Post-Demo Follow-up

Send investor:
1. GitHub repo link
2. Deployed MVP URLs
3. This deck + architecture diagrams
4. PRD (marketplace_ai_full_prd_mvp.md)
5. 30-day roadmap

---

**Good luck with investor meetings!** 🚀

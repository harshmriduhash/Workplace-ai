# ⚙️ Production Checklist

**Purpose**: Ensure production environment is stable and secure  
**Audience**: DevOps, Engineering Team  
**Review Frequency**: Before each release

---

## Infrastructure Requirements

### Database
- [ ] PostgreSQL 12+ with replication enabled
- [ ] Connection pooling (PgBouncer or similar)
  - [ ] Min connections: 5
  - [ ] Max connections: 20
  - [ ] Connection timeout: 3 seconds
- [ ] Automated backups
  - [ ] Daily backup schedule set
  - [ ] Backup retention: 30 days minimum
  - [ ] Test restore procedure documented
- [ ] Monitoring
  - [ ] CPU usage alert: > 80%
  - [ ] Disk space alert: > 90%
  - [ ] Connection count alert: > 18
  - [ ] Query time alert: > 1 second (p95)

### Backend Server
- [ ] Node.js 18+ installed
- [ ] Process manager (PM2, systemd, or Render native)
- [ ] Auto-restart on crash enabled
- [ ] Memory limit: 512MB minimum
- [ ] CPU cores: 2 minimum
- [ ] Storage: 10GB minimum
- [ ] Network: 100Mbps minimum

### Frontend CDN
- [ ] Static assets cached
  - [ ] Cache expiry: 1 year for versioned files
  - [ ] Cache expiry: 1 hour for index.html
- [ ] Gzip compression enabled
- [ ] Brotli compression enabled (optional)
- [ ] HTTPS with TLS 1.2+
- [ ] HTTP/2 enabled

---

## Security Configuration

### Network Security
- [ ] Firewall rules
  - [ ] SSH (22): restricted to admin IPs
  - [ ] HTTP (80): open to all
  - [ ] HTTPS (443): open to all
  - [ ] Database (5432): restricted to app server only
- [ ] DDoS protection enabled
- [ ] WAF (Web Application Firewall) enabled
- [ ] VPN access for team (if applicable)

### Application Security
- [ ] CORS properly configured
  - [ ] Allowed origins: production domain only
  - [ ] Allowed methods: GET, POST
  - [ ] Allowed headers: Content-Type, Authorization
- [ ] CSRF protection enabled
- [ ] Rate limiting enabled
  - [ ] 100 requests/minute per IP for API
  - [ ] 1000 requests/minute per authenticated user
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)

### Secrets Management
- [ ] No hardcoded secrets in code
- [ ] Environment variables used for all secrets
- [ ] Secrets stored in secure vault (AWS Secrets Manager, etc.)
- [ ] Secrets rotation schedule: every 90 days
- [ ] Secrets access logged and audited

### SSL/TLS
- [ ] Valid certificate installed
- [ ] Certificate auto-renewal configured
- [ ] TLS 1.2 minimum enforced
- [ ] Strong cipher suites only
- [ ] HSTS header enabled

---

## Performance Optimization

### Database
- [ ] Indexes created on:
  - [ ] orgs(id)
  - [ ] agents(org_id)
  - [ ] simulations(org_id, created_at)
  - [ ] deployments(org_id, agent_id)
  - [ ] tasks(org_id, status)
  - [ ] audit_logs(org_id, created_at)
- [ ] Query optimization completed
- [ ] N+1 query problems resolved
- [ ] Connection pooling tuned

### API
- [ ] Response gzipped
- [ ] JSON responses minified
- [ ] Pagination implemented for list endpoints
  - [ ] Limit: 100 items max
  - [ ] Default: 20 items
- [ ] Caching headers set
  - [ ] Cache-Control: max-age=3600
  - [ ] ETag support

### Frontend
- [ ] JavaScript bundled and minified
- [ ] CSS bundled and minified
- [ ] Images optimized and lazy-loaded
- [ ] Code splitting implemented
- [ ] Service worker for offline support (optional)

---

## Monitoring & Logging

### Application Monitoring
- [ ] Error tracking (Sentry/similar)
  - [ ] Alert threshold: 5 errors per minute
  - [ ] Notification channels: email, Slack
- [ ] Performance monitoring (New Relic/similar)
  - [ ] Transaction tracing enabled
  - [ ] Threshold: 500ms for 95th percentile
- [ ] Uptime monitoring
  - [ ] Health check every 30 seconds
  - [ ] Alert if down for 2+ minutes

### Logging
- [ ] Centralized log aggregation (ELK, Datadog, etc.)
- [ ] Log levels properly set
- [ ] Sensitive data scrubbed from logs
- [ ] Log retention: 30 days minimum
- [ ] Log search and analysis tools available

### Metrics to Track
- [ ] Request rate (requests/minute)
- [ ] Error rate (errors/minute)
- [ ] Response time (p50, p95, p99)
- [ ] Database query time
- [ ] API endpoint latency
- [ ] Agent utilization rate
- [ ] Simulation success rate
- [ ] Task completion rate

---

## Backup & Disaster Recovery

### Backups
- [ ] Database backups
  - [ ] Frequency: daily at 2 AM UTC
  - [ ] Retention: 30 days
  - [ ] Location: separate region/provider
  - [ ] Encryption: AES-256
- [ ] Configuration backups
  - [ ] Environment variables backed up
  - [ ] SSL certificates backed up
  - [ ] DNS records backed up
- [ ] Code backups
  - [ ] Git repository backed up (GitHub)

### Disaster Recovery Plan
- [ ] RTO (Recovery Time Objective): 1 hour
- [ ] RPO (Recovery Point Objective): 1 hour
- [ ] Failover procedure documented
- [ ] Failover tested monthly
- [ ] Team trained on failover process

---

## Scalability Readiness

- [ ] Horizontal scaling planned
  - [ ] Load balancer configured
  - [ ] Multiple app instances ready
  - [ ] Session storage (Redis) if needed
- [ ] Database scaling planned
  - [ ] Read replicas configured
  - [ ] Sharding strategy documented
- [ ] CDN scaling
  - [ ] Multiple edge locations
  - [ ] Cache strategy documented

---

## Compliance & Audit

- [ ] Audit logging enabled
  - [ ] All user actions logged
  - [ ] Logs immutable (cannot be deleted)
- [ ] Data privacy
  - [ ] Encryption at rest: AES-256
  - [ ] Encryption in transit: TLS 1.2+
  - [ ] Data retention policy: documented
- [ ] Compliance requirements
  - [ ] GDPR: user data deletion process documented
  - [ ] SOC 2: controls implemented
  - [ ] PCI DSS: if handling payments
- [ ] Regular audits
  - [ ] Security audit: quarterly
  - [ ] Compliance audit: annually

---

## Runbooks & Documentation

- [ ] Deployment runbook
  - [ ] Step-by-step deployment process
  - [ ] Rollback procedures
  - [ ] Verification steps
- [ ] Incident response runbook
  - [ ] Escalation procedures
  - [ ] Communication template
  - [ ] Mitigation steps for common issues
- [ ] Scaling runbook
  - [ ] How to add database replicas
  - [ ] How to add app servers
  - [ ] How to handle traffic spikes
- [ ] Maintenance runbook
  - [ ] Database maintenance procedures
  - [ ] SSL certificate renewal process
  - [ ] Dependency updates procedure

---

## Operational Excellence

- [ ] On-call rotation established
- [ ] Incident communication channels
  - [ ] Slack for team
  - [ ] Status page for customers
- [ ] Post-incident reviews conducted
- [ ] Knowledge base maintained
- [ ] Team training completed
  - [ ] How to respond to alerts
  - [ ] How to scale infrastructure
  - [ ] How to debug issues

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| DevOps Lead | _______ | _______ | _______ |
| Security | _______ | _______ | _______ |
| Engineering | _______ | _______ | _______ |
| Product | _______ | _______ | _______ |

**Status**: ☐ Ready for Production  |  ☐ Needs Work

**Notes**:
```
[Space for additional notes]
```

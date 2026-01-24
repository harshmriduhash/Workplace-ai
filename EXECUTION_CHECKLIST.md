# ▶️ Execution Checklist

**Purpose**: Pre-execution checks before running agents or simulations  
**Audience**: Operations Team, Agent Managers  
**Review Frequency**: Before each major execution

---

## Pre-Execution Planning

- [ ] **Objective Defined**
  - [ ] Clear business goal set
  - [ ] Success metrics identified
  - [ ] Budget allocated
  - [ ] Timeline established
  - [ ] Risk assessment completed

- [ ] **Agent Selection**
  - [ ] Right agents selected for task
  - [ ] Agent capabilities verified
  - [ ] Agent status: active
  - [ ] Agent deployment verified
  - [ ] Agent performance history reviewed

- [ ] **Input Preparation**
  - [ ] Input data collected
  - [ ] Input data validated (format, completeness)
  - [ ] Input data sanitized (no PII exposure)
  - [ ] Edge cases identified
  - [ ] Expected output defined

---

## Resource Allocation

- [ ] **Budget Check**
  - [ ] Estimated cost calculated
  - [ ] Governor budget cap checked
  - [ ] Sufficient budget available
  - [ ] Cost approval obtained
  - [ ] Budget reserve maintained (20%+)

- [ ] **Rate Limit Check**
  - [ ] Daily task count checked
  - [ ] Rate limit not exceeded
  - [ ] Available quota: ____ tasks
  - [ ] Governor rules reviewed
  - [ ] Time of execution optimal

- [ ] **System Capacity**
  - [ ] Database CPU < 80%
  - [ ] Database memory < 80%
  - [ ] API response time < 500ms
  - [ ] No active incidents
  - [ ] All services healthy

---

## Agent Verification

- [ ] **Agent Health**
  - [ ] Agent status: ACTIVE (not paused/inactive)
  - [ ] Last execution: < 7 days ago
  - [ ] Error rate: < 5%
  - [ ] Average accuracy: meets threshold
  - [ ] No recent performance degradation

- [ ] **Agent Configuration**
  - [ ] Tools configured correctly
  - [ ] Role matches task requirements
  - [ ] Parameters optimized for task
  - [ ] Training data up-to-date
  - [ ] Version: latest stable

- [ ] **Governor Rules**
  - [ ] Budget cap: $_____ remaining today
  - [ ] Rate limit: _____ tasks remaining today
  - [ ] Accuracy threshold: _____ % (current: _____ %)
  - [ ] Pause rule: not triggered
  - [ ] Rules appropriate for task

---

## Simulation & Testing

- [ ] **Test Simulation**
  - [ ] Test simulation executed
  - [ ] Results reviewed
  - [ ] Accuracy acceptable (> 80%)
  - [ ] Cost within budget
  - [ ] No errors encountered
  - [ ] Output format correct

- [ ] **Edge Cases**
  - [ ] Tested with minimum input
  - [ ] Tested with maximum input
  - [ ] Tested with invalid input (graceful failure)
  - [ ] Tested with edge cases
  - [ ] Behavior as expected

- [ ] **Performance**
  - [ ] Execution time acceptable
  - [ ] Memory usage acceptable
  - [ ] API response time < 500ms
  - [ ] Database load acceptable

---

## Data & Security

- [ ] **Data Validation**
  - [ ] Input data format correct
  - [ ] Data completeness verified
  - [ ] No missing required fields
  - [ ] Data types correct
  - [ ] Data ranges within acceptable limits

- [ ] **Data Privacy**
  - [ ] PII removed from input
  - [ ] Sensitive data masked
  - [ ] GDPR compliance checked
  - [ ] Data classification: [PUBLIC / INTERNAL / CONFIDENTIAL]
  - [ ] Data retention policy reviewed

- [ ] **Access Control**
  - [ ] User/org has permission
  - [ ] API key valid and not revoked
  - [ ] No override flags enabled
  - [ ] Audit logging enabled
  - [ ] Action will be logged

---

## Execution Environment

- [ ] **Environment Verification**
  - [ ] Environment: [STAGING / PRODUCTION]
  - [ ] Correct endpoint: _________________
  - [ ] API key: verified (last 4 chars: ____)
  - [ ] Database: connected and responsive
  - [ ] All dependencies: running

- [ ] **Monitoring Setup**
  - [ ] Error tracking enabled (Sentry/similar)
  - [ ] Performance monitoring active
  - [ ] Log aggregation active
  - [ ] Alerts configured
  - [ ] Dashboard accessible

- [ ] **Communication**
  - [ ] Stakeholders notified
  - [ ] Execution window communicated
  - [ ] Escalation contacts defined
  - [ ] Status page updated (if public)

---

## Execution

- [ ] **Pre-Execution (T-30 mins)**
  - [ ] Team in execution meeting
  - [ ] All checklists completed
  - [ ] Systems health verified one last time
  - [ ] Go/No-Go decision made
  - [ ] Runbook open and reviewed

- [ ] **Execution (T-0)**
  - [ ] Input submitted to API
  - [ ] Confirmation received
  - [ ] Task ID captured: ________________
  - [ ] Monitoring dashboard open
  - [ ] Team actively monitoring

- [ ] **Monitoring (T+0 to T+30 mins)**
  - [ ] Task status checked every 1 minute
  - [ ] No critical errors
  - [ ] Performance within acceptable range
  - [ ] Costs tracking to estimate
  - [ ] Output generating

---

## Post-Execution

- [ ] **Results Verification**
  - [ ] Task completed successfully
  - [ ] Output received and reviewed
  - [ ] Output format correct
  - [ ] Output accuracy acceptable
  - [ ] No errors in results

- [ ] **Quality Assurance**
  - [ ] Output spot-checked (sample validation)
  - [ ] Results match expected output (80%+)
  - [ ] No anomalies detected
  - [ ] Agent behavior as expected
  - [ ] Performance as expected

- [ ] **Audit & Documentation**
  - [ ] Audit log entry created
  - [ ] Results documented
  - [ ] Costs recorded
  - [ ] Execution time recorded
  - [ ] Issues logged (if any)

- [ ] **Post-Execution Metrics**
  - [ ] Total cost: $______
  - [ ] Execution time: ______ seconds
  - [ ] Agent accuracy: ______ %
  - [ ] Success rate: ______ %
  - [ ] Customer satisfaction: ______ %

---

## Escalation Procedure

If any of these occur, escalate immediately:

- [ ] Critical error (error_code >= 500)
- [ ] Budget exceeded
- [ ] Rate limit exceeded
- [ ] Accuracy below threshold
- [ ] Agent paused by governor
- [ ] Unexpected output format
- [ ] Performance degraded
- [ ] Data inconsistency
- [ ] Security concern
- [ ] Audit log discrepancy

**Escalation Contact**: ________________  
**Escalation Phone**: ________________  
**Escalation Email**: ________________

---

## Sign-off

| Role | Decision | Time | Notes |
|------|----------|------|-------|
| Execution Lead | ☐ GO ☐ NO-GO | _______ | _____________ |
| Technical Lead | ☐ GO ☐ NO-GO | _______ | _____________ |
| Business Owner | ☐ GO ☐ NO-GO | _______ | _____________ |

**Final Decision**: ☐ PROCEED  |  ☐ DELAY  |  ☐ CANCEL

**Reason if delayed/cancelled**:
```
[Space for notes]
```

**Execution Start Time**: ________________  
**Execution End Time**: ________________  
**Total Duration**: ________________  
**Status**: ☐ SUCCESS  |  ☐ PARTIAL SUCCESS  |  ☐ FAILED

**Post-Execution Notes**:
```
[Space for notes and lessons learned]
```

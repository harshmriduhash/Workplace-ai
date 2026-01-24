import { Pool } from 'pg';

export interface GovernorState {
  agentId: number;
  dailySpent: number;
  dailyTaskCount: number;
  lastResetDate: Date;
  recentAccuracy: number[];
  isPaused: boolean;
}

const governorStates = new Map<string, GovernorState>();

export async function checkGovernorRules(
  pool: Pool,
  orgId: number,
  agentId: number,
  costOfTask: number
) {
  try {
    const key = `${orgId}-${agentId}`;
    const rules = await pool.query(
      `SELECT * FROM governor_rules WHERE org_id = $1 AND agent_id = $2`,
      [orgId, agentId]
    );

    if (rules.rows.length === 0) {
      return { allowed: true, reason: 'No rules set' };
    }

    const rule = rules.rows[0];
    let state = governorStates.get(key);

    if (!state) {
      state = {
        agentId,
        dailySpent: 0,
        dailyTaskCount: 0,
        lastResetDate: new Date(),
        recentAccuracy: [],
        isPaused: false
      };
      governorStates.set(key, state);
    }

    // Reset if it's a new day
    const today = new Date().toDateString();
    if (state.lastResetDate.toDateString() !== today) {
      state.dailySpent = 0;
      state.dailyTaskCount = 0;
      state.lastResetDate = new Date();
    }

    // Check budget cap
    if (state.dailySpent + costOfTask > rule.budget_cap) {
      await pauseAgent(pool, agentId);
      return {
        allowed: false,
        reason: `Budget cap exceeded: $${state.dailySpent} + $${costOfTask} > $${rule.budget_cap}`
      };
    }

    // Check rate limit
    if (state.dailyTaskCount >= rule.rate_limit) {
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${state.dailyTaskCount} >= ${rule.rate_limit} tasks/day`
      };
    }

    // Update state
    state.dailySpent += costOfTask;
    state.dailyTaskCount += 1;

    return { allowed: true, reason: 'Passed all checks' };
  } catch (err) {
    console.error('Governor check error:', err);
    return { allowed: false, reason: 'Governor error' };
  }
}

export async function recordAccuracy(
  pool: Pool,
  orgId: number,
  agentId: number,
  accuracy: number
) {
  const key = `${orgId}-${agentId}`;
  const state = governorStates.get(key);

  if (state) {
    state.recentAccuracy.push(accuracy);
    // Keep last 10 accuracy readings
    if (state.recentAccuracy.length > 10) {
      state.recentAccuracy.shift();
    }

    // Check accuracy threshold
    const rules = await pool.query(
      `SELECT * FROM governor_rules WHERE org_id = $1 AND agent_id = $2`,
      [orgId, agentId]
    );

    if (rules.rows.length > 0) {
      const avgAccuracy = state.recentAccuracy.reduce((a, b) => a + b, 0) / state.recentAccuracy.length;
      if (avgAccuracy < rules.rows[0].accuracy_threshold) {
        await pauseAgent(pool, agentId);
        console.warn(`⚠️ Agent ${agentId} accuracy dropped below threshold: ${avgAccuracy}%`);
      }
    }
  }
}

export async function pauseAgent(pool: Pool, agentId: number) {
  try {
    await pool.query('UPDATE agents SET status = $1 WHERE id = $2', ['paused', agentId]);
    console.log(`⏸️ Agent ${agentId} paused by governor`);
  } catch (err) {
    console.error('Pause agent error:', err);
  }
}

export function getGovernorStatus(orgId: number, agentId: number) {
  const key = `${orgId}-${agentId}`;
  return governorStates.get(key);
}

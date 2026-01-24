import { Pool } from 'pg';
import { logInfo, logError } from './logger';

/**
 * GDPR Compliance Endpoints
 * Implements user rights: access, rectification, erasure, portability
 */

/**
 * Export all user data (GDPR Right to Access & Data Portability)
 */
export const exportUserData = async (pool: Pool, orgId: number, userId?: number) => {
  try {
    logInfo('Exporting user data', { orgId, userId });

    const data: any = {
      exportDate: new Date().toISOString(),
      organization: {},
      users: [],
      agents: [],
      simulations: [],
      deployments: [],
      tasks: [],
      governorRules: [],
      auditLogs: []
    };

    // Export organization data
    const orgResult = await pool.query(
      'SELECT * FROM orgs WHERE id = $1',
      [orgId]
    );
    data.organization = orgResult.rows[0];

    // Export users
    const usersResult = await pool.query(
      'SELECT id, email, name, role, created_at FROM users WHERE org_id = $1',
      [orgId]
    );
    data.users = usersResult.rows;

    // Export agents
    const agentsResult = await pool.query(
      'SELECT * FROM agents WHERE org_id = $1',
      [orgId]
    );
    data.agents = agentsResult.rows;

    // Export simulations
    const simulationsResult = await pool.query(
      'SELECT * FROM simulations WHERE org_id = $1',
      [orgId]
    );
    data.simulations = simulationsResult.rows;

    // Export deployments
    const deploymentsResult = await pool.query(
      'SELECT * FROM deployments WHERE org_id = $1',
      [orgId]
    );
    data.deployments = deploymentsResult.rows;

    // Export tasks (limit to last 1000 for performance)
    const tasksResult = await pool.query(
      'SELECT * FROM tasks WHERE org_id = $1 ORDER BY created_at DESC LIMIT 1000',
      [orgId]
    );
    data.tasks = tasksResult.rows;

    // Export governor rules
    const governorResult = await pool.query(
      'SELECT * FROM governor_rules WHERE org_id = $1',
      [orgId]
    );
    data.governorRules = governorResult.rows;

    // Export audit logs (last 90 days)
    const auditResult = await pool.query(
      `SELECT * FROM audit_logs 
       WHERE org_id = $1 AND created_at > NOW() - INTERVAL '90 days'
       ORDER BY created_at DESC`,
      [orgId]
    );
    data.auditLogs = auditResult.rows;

    logInfo('User data exported successfully', { orgId, recordCount: data.auditLogs.length });
    return data;
  } catch (error: any) {
    logError('Failed to export user data', error, { orgId, userId });
    throw error;
  }
};

/**
 * Delete user data (GDPR Right to Erasure / "Right to be Forgotten")
 */
export const deleteUserData = async (pool: Pool, orgId: number, userId?: number) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    logInfo('Starting user data deletion', { orgId, userId });

    // Delete in reverse order of dependencies
    await client.query('DELETE FROM audit_logs WHERE org_id = $1', [orgId]);
    await client.query('DELETE FROM governor_rules WHERE org_id = $1', [orgId]);
    await client.query('DELETE FROM tasks WHERE org_id = $1', [orgId]);
    await client.query('DELETE FROM deployments WHERE org_id = $1', [orgId]);
    await client.query('DELETE FROM simulations WHERE org_id = $1', [orgId]);
    await client.query('DELETE FROM agents WHERE org_id = $1', [orgId]);
    await client.query('DELETE FROM users WHERE org_id = $1', [orgId]);
    await client.query('DELETE FROM orgs WHERE id = $1', [orgId]);

    await client.query('COMMIT');
    logInfo('User data deleted successfully', { orgId });

    return {
      success: true,
      message: 'All data has been permanently deleted',
      deletedAt: new Date().toISOString()
    };
  } catch (error: any) {
    await client.query('ROLLBACK');
    logError('Failed to delete user data', error, { orgId, userId });
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Anonymize user data (alternative to deletion for audit compliance)
 */
export const anonymizeUserData = async (pool: Pool, orgId: number) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    logInfo('Starting user data anonymization', { orgId });

    // Anonymize user information
    await client.query(
      `UPDATE users 
       SET email = CONCAT('deleted_', id, '@anonymized.local'),
           name = 'Deleted User'
       WHERE org_id = $1`,
      [orgId]
    );

    // Anonymize organization
    await client.query(
      `UPDATE orgs 
       SET name = CONCAT('Deleted Organization ', id)
       WHERE id = $1`,
      [orgId]
    );

    // Anonymize audit logs (keep structure for compliance)
    await client.query(
      `UPDATE audit_logs 
       SET ip_address = '0.0.0.0',
           details = jsonb_set(details, '{anonymized}', 'true')
       WHERE org_id = $1`,
      [orgId]
    );

    // Delete sensitive task data
    await client.query(
      `UPDATE tasks 
       SET input = '[REDACTED]',
           output = '[REDACTED]'
       WHERE org_id = $1`,
      [orgId]
    );

    await client.query('COMMIT');
    logInfo('User data anonymized successfully', { orgId });

    return {
      success: true,
      message: 'Personal data has been anonymized while preserving audit trail',
      anonymizedAt: new Date().toISOString()
    };
  } catch (error: any) {
    await client.query('ROLLBACK');
    logError('Failed to anonymize user data', error, { orgId });
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Update user data (GDPR Right to Rectification)
 */
export const updateUserData = async (
  pool: Pool, 
  userId: number, 
  updates: { email?: string; name?: string }
) => {
  try {
    logInfo('Updating user data', { userId, updates });

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.email) {
      setClauses.push(`email = $${paramIndex++}`);
      values.push(updates.email);
    }

    if (updates.name) {
      setClauses.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }

    if (setClauses.length === 0) {
      throw new Error('No updates provided');
    }

    values.push(userId);

    const result = await pool.query(
      `UPDATE users 
       SET ${setClauses.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, email, name, role, created_at`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    logInfo('User data updated successfully', { userId });
    return result.rows[0];
  } catch (error: any) {
    logError('Failed to update user data', error, { userId });
    throw error;
  }
};

/**
 * Get data processing consent status
 */
export const getConsentStatus = async (pool: Pool, userId: number) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        email, 
        created_at,
        (SELECT COUNT(*) FROM audit_logs WHERE user_id = $1) as actions_logged
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return {
      userId: result.rows[0].id,
      email: result.rows[0].email,
      accountCreated: result.rows[0].created_at,
      dataProcessingConsent: true, // Implied by account creation
      actionsLogged: result.rows[0].actions_logged,
      canWithdrawConsent: true,
      dataRetentionDays: 90
    };
  } catch (error: any) {
    logError('Failed to get consent status', error, { userId });
    throw error;
  }
};

import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

export interface AuditLog {
  id: string;
  org_id: number;
  user_id: number | null;
  action: string;
  resource_type: string;
  resource_id: number;
  details: Record<string, any>;
  ip_address: string;
  timestamp: Date;
}

export async function initAuditTable(pool: Pool) {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        org_id INT REFERENCES orgs(id),
        user_id INT REFERENCES users(id),
        action VARCHAR(50) NOT NULL,
        resource_type VARCHAR(50),
        resource_id INT,
        details JSONB,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_org_action (org_id, action),
        INDEX idx_timestamp (created_at)
      );
    `);
    console.log("✅ Audit logs table initialized");
  } catch (err) {
    console.error("Audit table init error:", err);
  }
}

export async function logAudit(
  pool: Pool,
  orgId: number,
  userId: number | null,
  action: string,
  resourceType: string,
  resourceId: number,
  details: Record<string, any>,
  ipAddress: string,
) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (org_id, user_id, action, resource_type, resource_id, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        orgId,
        userId,
        action,
        resourceType,
        resourceId,
        JSON.stringify(details),
        ipAddress,
      ],
    );
  } catch (err) {
    console.error("Audit logging error:", err);
  }
}

export async function getAuditLogs(
  pool: Pool,
  orgId: number,
  limit: number = 100,
) {
  try {
    const result = await pool.query(
      `SELECT * FROM audit_logs WHERE org_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [orgId, limit],
    );
    return result.rows;
  } catch (err) {
    console.error("Get audit logs error:", err);
    return [];
  }
}

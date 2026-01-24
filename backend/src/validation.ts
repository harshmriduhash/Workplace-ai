import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation schemas for API requests
 */

// Organization schemas
export const createOrgSchema = z.object({
  name: z.string().min(1).max(255).trim(),
});

// Agent schemas
export const createAgentSchema = z.object({
  org_id: z.number().int().positive(),
  name: z.string().min(1).max(255).trim(),
  role: z.string().min(1).max(255).trim(),
  description: z.string().max(2000).optional(),
  tools: z.array(z.string()).optional(),
  cost_per_task: z.number().nonnegative().optional(),
});

// Simulation schemas
export const createSimulationSchema = z.object({
  org_id: z.number().int().positive(),
  agent_id: z.number().int().positive(),
});

// Deployment schemas
export const createDeploymentSchema = z.object({
  org_id: z.number().int().positive(),
  agent_id: z.number().int().positive(),
  environment: z.enum(['development', 'staging', 'production']),
});

// Task schemas
export const createTaskSchema = z.object({
  org_id: z.number().int().positive(),
  agent_id: z.number().int().positive(),
  deployment_id: z.number().int().positive().optional(),
  input: z.string().min(1).max(10000).trim(),
});

// Governor schemas
export const createGovernorRuleSchema = z.object({
  org_id: z.number().int().positive(),
  agent_id: z.number().int().positive(),
  budget_cap: z.number().nonnegative().optional(),
  rate_limit: z.number().int().positive().optional(),
  accuracy_threshold: z.number().min(0).max(100).optional(),
});

// Audit log query schemas
export const auditLogQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).default('50'),
  offset: z.string().regex(/^\d+$/).transform(Number).default('0'),
});

/**
 * Validation middleware factory
 */
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body, query, or params based on what's present
      const dataToValidate = req.body && Object.keys(req.body).length > 0 
        ? req.body 
        : req.query && Object.keys(req.query).length > 0
        ? req.query
        : req.params;

      const validated = schema.parse(dataToValidate);
      
      // Replace request data with validated data
      if (req.body && Object.keys(req.body).length > 0) {
        req.body = validated;
      } else if (req.query && Object.keys(req.query).length > 0) {
        req.query = validated as any;
      }
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

/**
 * Sanitize string to prevent XSS
 */
export const sanitizeString = (str: string): string => {
  return str
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

/**
 * Validate and sanitize org_id from params
 */
export const validateOrgId = (req: Request, res: Response, next: NextFunction) => {
  const orgId = parseInt(req.params.org_id);
  
  if (isNaN(orgId) || orgId <= 0) {
    return res.status(400).json({ error: 'Invalid org_id parameter' });
  }
  
  req.params.org_id = orgId.toString();
  next();
};

/**
 * Validate and sanitize agent_id from params
 */
export const validateAgentId = (req: Request, res: Response, next: NextFunction) => {
  const agentId = parseInt(req.params.agent_id);
  
  if (isNaN(agentId) || agentId <= 0) {
    return res.status(400).json({ error: 'Invalid agent_id parameter' });
  }
  
  req.params.agent_id = agentId.toString();
  next();
};

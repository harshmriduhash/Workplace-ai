import { z } from 'zod';

/**
 * Environment variable validation schema
 * Ensures all required config is present and valid
 */
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3001'),
  
  // Database (REQUIRED)
  DATABASE_URL: z.string().url().min(1, 'DATABASE_URL is required'),
  
  // Security (REQUIRED in production)
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  
  // Frontend URL
  VERCEL_URL: z.string().url().optional(),
  BACKEND_URL: z.string().url().optional(),
  
  // OpenAI (optional but recommended)
  OPENAI_API_KEY: z.string().startsWith('sk-').optional(),
  
  // Email (optional)
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  
  // SMTP (optional alternative to Gmail)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().regex(/^\d+$/).transform(Number).optional(),
  SMTP_SECURE: z.string().transform(val => val === 'true').optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  
  // Clerk (optional)
  CLERK_API_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  
  // Governor defaults
  GOVERNOR_BUDGET_CAP: z.string().regex(/^\d+$/).transform(Number).default('1000'),
  GOVERNOR_RATE_LIMIT: z.string().regex(/^\d+$/).transform(Number).default('100'),
  GOVERNOR_ACCURACY_THRESHOLD: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).default('70'),
  
  // Monitoring (optional)
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().regex(/^\d+$/).transform(Number).default('60000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().regex(/^\d+$/).transform(Number).default('100'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 * Throws error if validation fails
 */
export const validateEnv = (): Env => {
  try {
    const parsed = envSchema.parse(process.env);
    
    // Additional production checks
    if (parsed.NODE_ENV === 'production') {
      if (!parsed.OPENAI_API_KEY) {
        console.warn('⚠️  OPENAI_API_KEY not set - AI features will use fallback data');
      }
      if (!parsed.EMAIL_USER || !parsed.EMAIL_PASSWORD) {
        console.warn('⚠️  Email credentials not set - notifications will be logged only');
      }
      if (!parsed.SENTRY_DSN) {
        console.warn('⚠️  SENTRY_DSN not set - error tracking disabled');
      }
      if (parsed.JWT_SECRET === 'your-jwt-secret-key-change-in-production') {
        throw new Error('❌ CRITICAL: JWT_SECRET must be changed in production!');
      }
    }
    
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error('Invalid environment configuration');
    }
    throw error;
  }
};

/**
 * Get validated environment config
 */
export const getEnv = (): Env => {
  return validateEnv();
};

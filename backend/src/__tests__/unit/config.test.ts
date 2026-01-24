import { describe, it, expect } from '@jest/globals';
import { validateEnv } from '../config';

describe('Config Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should validate correct environment variables', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long';
    process.env.NODE_ENV = 'development';
    process.env.PORT = '3001';

    const env = validateEnv();
    
    expect(env.DATABASE_URL).toBe('postgresql://user:pass@localhost:5432/db');
    expect(env.JWT_SECRET).toBe('test-jwt-secret-minimum-32-characters-long');
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3001);
  });

  it('should throw error if DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL;
    process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long';

    expect(() => validateEnv()).toThrow();
  });

  it('should throw error if JWT_SECRET is too short', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'short';

    expect(() => validateEnv()).toThrow('JWT_SECRET must be at least 32 characters');
  });

  it('should use default values for optional fields', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long';

    const env = validateEnv();
    
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3001);
    expect(env.GOVERNOR_BUDGET_CAP).toBe(1000);
    expect(env.GOVERNOR_RATE_LIMIT).toBe(100);
  });

  it('should validate OpenAI API key format', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long';
    process.env.OPENAI_API_KEY = 'invalid-key';

    expect(() => validateEnv()).toThrow();
  });

  it('should accept valid OpenAI API key', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long';
    process.env.OPENAI_API_KEY = 'sk-test123456789';

    const env = validateEnv();
    expect(env.OPENAI_API_KEY).toBe('sk-test123456789');
  });
});

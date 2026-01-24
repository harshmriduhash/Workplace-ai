import { Pool } from 'pg';

// Mock database pool for tests
export const mockPool = {
  query: jest.fn(),
  connect: jest.fn(),
  end: jest.fn(),
} as unknown as Pool;

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs in tests unless explicitly needed
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error for debugging test failures
  error: console.error,
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.JWT_SECRET = 'test-jwt-secret-key-minimum-32-characters-long';
process.env.PORT = '3001';

// Setup for server tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';

// Mock database
jest.mock('../config/database/database.js', () => ({
  query: jest.fn(),
  run: jest.fn(),
  get: jest.fn(),
  all: jest.fn(),
}));

// Suppress console.error in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

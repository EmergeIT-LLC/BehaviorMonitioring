const request = require('supertest');
const express = require('express');
const authRoutes = require('../../../routes/Auth');
const employeeQueries = require('../../../middleware/helpers/EmployeeQueries');

// Mock employeeQueries
jest.mock('../../../middleware/helpers/EmployeeQueries');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/validateEmployeeAccount', () => {
    it('returns 401 when username does not exist', async () => {
      employeeQueries.employeeExistByUsername.mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/validateEmployeeAccount')
        .send({ username: 'nonexistent', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.locatedAccount).toBe(false);
    });

    it('handles employee in verification status', async () => {
      employeeQueries.employeeExistByUsername.mockResolvedValue(true);
      employeeQueries.employeeDataByUsername.mockResolvedValue({
        account_status: 'In Verification',
        username: 'testuser'
      });
      employeeQueries.employeeSetEmployeeCredentialsByUsername.mockResolvedValue(true);
      employeeQueries.employeeUpdateEmployeeAccountStatusByUsername.mockResolvedValue(true);

      const response = await request(app)
        .post('/auth/validateEmployeeAccount')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.accountVerified).toBe(true);
    });
  });

  describe('POST /auth/verifyEmployeeLogin', () => {
    it('returns 200 with error when username does not exist', async () => {
      employeeQueries.employeeExistByUsername.mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/verifyEmployeeLogin')
        .send({ username: 'nonexistent', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('returns 401 when refresh token cookie is missing', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({});

      expect(response.status).toBe(401);
      expect(response.body.error).toMatch(/refresh token/i);
    });
  });

  describe('POST /auth/verifyEmployeeLogout', () => {
    it('returns 401 when refresh token is missing', async () => {
      const response = await request(app)
        .post('/auth/verifyEmployeeLogout')
        .send({});

      expect(response.status).toBe(401);
    });
  });
});

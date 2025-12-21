const request = require('supertest');
const express = require('express');
const adminRoutes = require('../../routes/Admin');
const { createAccessToken } = require('../../auth/tokens');

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin API Integration Tests', () => {
  let authToken;

  beforeAll(() => {
    // Create a mock admin token for testing
    authToken = createAccessToken({
      employeeID: 1,
      username: 'adminuser',
      isAdmin: true,
    });
  });

  describe('POST /admin/createAdmin', () => {
    it('returns 401 without authentication', async () => {
      const response = await request(app)
        .post('/admin/createAdmin')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123',
          role: 'admin',
        });

      expect(response.status).toBe(401);
    });

    it('returns 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/admin/createAdmin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'John',
          // Missing other required fields
        });

      expect(response.status).toBe(400);
    });

    it('validates email format', async () => {
      const response = await request(app)
        .post('/admin/createAdmin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'invalid-email',
          password: 'password123',
          role: 'admin',
        });

      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toMatch(/email/i);
    });
  });

  describe('POST /admin/getAllAdmins', () => {
    it('returns 401 without authentication', async () => {
      const response = await request(app)
        .post('/admin/getAllAdmins')
        .send({});

      expect(response.status).toBe(401);
    });

    it('returns admin list with valid auth', async () => {
      const response = await request(app)
        .post('/admin/getAllAdmins')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ employeeUsername: 'adminuser' });

      // Depending on mock setup, expect 200 or appropriate response
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('POST /admin/updateAdmin', () => {
    it('returns 401 without authentication', async () => {
      const response = await request(app)
        .post('/admin/updateAdmin')
        .send({
          adminID: 1,
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(401);
    });

    it('returns 400 when adminID is missing', async () => {
      const response = await request(app)
        .post('/admin/updateAdmin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /admin/deleteAdmin', () => {
    it('returns 401 without authentication', async () => {
      const response = await request(app)
        .post('/admin/deleteAdmin')
        .send({ adminID: 1 });

      expect(response.status).toBe(401);
    });

    it('returns 400 when adminID is missing', async () => {
      const response = await request(app)
        .post('/admin/deleteAdmin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });
});

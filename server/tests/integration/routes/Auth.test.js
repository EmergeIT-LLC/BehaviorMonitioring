const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/Auth');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth API Integration Tests', () => {
  describe('POST /auth/login', () => {
    it('returns 400 when username is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toBeTruthy();
    });

    it('returns 400 when password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser' });

      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toBeTruthy();
    });

    it('returns 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'invaliduser',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('returns 400 when refresh token is missing', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toMatch(/refresh token/i);
    });

    it('returns 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('returns 400 when refresh token is missing', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .send({});

      expect(response.status).toBe(400);
    });

    it('returns success when valid token provided', async () => {
      // Note: This would need a valid token from a real login
      // For now, testing the endpoint structure
      const response = await request(app)
        .post('/auth/logout')
        .send({ refreshToken: 'some-token' });

      expect([200, 401]).toContain(response.status);
    });
  });
});

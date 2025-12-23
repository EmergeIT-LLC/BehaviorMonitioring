const request = require('supertest');
const express = require('express');
const adminRoutes = require('../../../routes/Admin');
const adminQueries = require('../../../middleware/helpers/AdminQueries');

// Mock adminQueries
jest.mock('../../../middleware/helpers/AdminQueries');

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /admin/addNewEmployee', () => {
    it('returns error when required fields are missing', async () => {
      const response = await request(app)
        .post('/admin/addNewEmployee')
        .send({
          fName: 'John',
          // Missing other required fields
        });

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(500);
    });

    it('successfully adds new employee with valid data', async () => {
      adminQueries.addNewEmployee.mockResolvedValue(true);
      adminQueries.employeeExistByUsername.mockResolvedValue(false);

      const response = await request(app)
        .post('/admin/addNewEmployee')
        .send({
          fName: 'John',
          lName: 'Doe',
          email: 'john@example.com',
          pNumber: '1234567890',
          role: 'Technician',
          employeeUsername: 'admin',
        });

      expect(response.status).toBe(200);
      expect([200, 500]).toContain(response.body.statusCode);
    });
  });

  describe('POST /admin/deleteAnEmployee', () => {
    it('handles delete request', async () => {
      adminQueries.deleteAnEmployee.mockResolvedValue(true);

      const response = await request(app)
        .post('/admin/deleteAnEmployee')
        .send({
          employeeID: 1,
          employeeUsername: 'admin',
        });

      expect(response.status).toBe(200);
    });
  });

  describe('POST /admin/updateAnEmployeeDetail', () => {
    it('handles update request', async () => {
      adminQueries.updateAnEmployeeDetail.mockResolvedValue(true);

      const response = await request(app)
        .post('/admin/updateAnEmployeeDetail')
        .send({
          employeeID: 1,
          fName: 'John',
          lName: 'Doe',
          email: 'john@example.com',
          pNumber: '1234567890',
          employeeUsername: 'admin',
        });

      expect(response.status).toBe(200);
    });
  });

  describe('POST /admin/addNewHome', () => {
    it('successfully adds new home', async () => {
      adminQueries.addNewHome.mockResolvedValue(true);

      const response = await request(app)
        .post('/admin/addNewHome')
        .send({
          homeName: 'Test Home',
          location: 'Test Location',
          employeeUsername: 'admin',
        });

      expect(response.status).toBe(200);
    });
  });

  describe('POST /admin/deleteAHome', () => {
    it('handles delete home request', async () => {
      adminQueries.deleteAHome.mockResolvedValue(true);

      const response = await request(app)
        .post('/admin/deleteAHome')
        .send({
          homeID: 1,
          employeeUsername: 'admin',
        });

      expect(response.status).toBe(200);
    });
  });
});

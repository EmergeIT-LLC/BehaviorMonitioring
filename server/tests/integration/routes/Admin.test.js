const request = require('supertest');
const express = require('express');
const adminRoutes = require('../../../routes/Admin');

// Mock adminQueries module
jest.mock('../../../middleware/helpers/AdminQueries', () => ({
  adminExistByUsername: jest.fn(),
  adminExistByID: jest.fn(),
  adminDataByUsername: jest.fn(),
  adminDataById: jest.fn(),
  adminAddNewEmployee: jest.fn(),
  adminDeleteAnEmployeeByID: jest.fn(),
  adminDeleteAnEmployeeByUsername: jest.fn(),
  adminUpdateEmployeeAccountStatusByUsername: jest.fn(),
  adminUpdateEmployeeAccountStatusByID: jest.fn(),
  adminUpdateEmployeeAccountByUsername: jest.fn(),
  adminUpdateEmployeeAccountByID: jest.fn(),
}));

// Mock generate username
jest.mock('../../../functions/users/generateUsername', () => jest.fn(() => 'test.user'));

// Mock email handler
jest.mock('../../../middleware/email/emailTemplate', () => jest.fn());

const adminQueries = require('../../../middleware/helpers/AdminQueries');

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /admin/addNewEmployee', () => {
    it('handles add employee request', async () => {
      // Mock authorization check
      adminQueries.adminExistByUsername.mockResolvedValue(true);
      adminQueries.adminDataByUsername.mockResolvedValue({
        role: 'admin',
        fName: 'Test',
        lName: 'Admin',
      });
      adminQueries.adminAddNewEmployee.mockResolvedValue(true);

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
      expect([200, 201]).toContain(response.body.statusCode);
    });
  });

  describe('POST /admin/deleteAnEmployee', () => {
    it('handles delete request', async () => {
      adminQueries.adminExistByUsername.mockResolvedValue(true);
      adminQueries.adminDataByUsername.mockResolvedValue({
        role: 'admin',
      });
      adminQueries.adminDeleteAnEmployeeByID.mockResolvedValue(true);

      const response = await request(app)
        .post('/admin/deleteAnEmployee')
        .send({
          employeeID: 1,
          employeeUsername: 'admin',
        });

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(201);
    });
  });

  describe('POST /admin/updateAnEmployeeDetail', () => {
    it('handles update request', async () => {
      adminQueries.adminExistByUsername.mockResolvedValue(true);
      adminQueries.adminDataByUsername.mockResolvedValue({
        role: 'admin',
      });
      adminQueries.adminUpdateEmployeeAccountByID.mockResolvedValue(true);

      const response = await request(app)
        .post('/admin/updateAnEmployeeDetail')
        .send({
          employeeID: 1,
          fName: 'John',
          lName: 'Doe',
          email: 'john@example.com',
          pNumber: '1234567890',
          role: 'Technician',
          employeeUsername: 'admin',
        });

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(201);
    });
  });

  describe('POST /admin/addNewHome', () => {
    it('successfully adds new home', async () => {
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

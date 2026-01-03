require('dotenv').config();
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

// Employee management routes
router.post('/addNewEmployee', adminController.addNewEmployee.bind(adminController));
router.post('/deleteAnEmployee', adminController.deleteAnEmployee.bind(adminController));
router.post('/updateAnEmployeeDetail', adminController.updateAnEmployeeDetail.bind(adminController));
router.post('/updateAnEmployeeAccountStatus', adminController.updateAnEmployeeAccountStatus.bind(adminController));

// Home management routes
router.post('/addNewHome', adminController.addNewHome.bind(adminController));
router.post('/deleteAHome', adminController.deleteAHome.bind(adminController));
router.post('/updateAHome', adminController.updateAHome.bind(adminController));

module.exports = router;
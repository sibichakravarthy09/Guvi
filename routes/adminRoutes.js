const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, isAdmin, isLead, isAdminOrLead } = require('../middlewares/authMiddleware');

// ------------------ Lead Routes ------------------
router.post('/leads', authMiddleware, isAdmin, adminController.createLead);
router.get('/leads', authMiddleware, isAdminOrLead, adminController.getLeads); // shared
router.put('/leads/:id', authMiddleware, isAdmin, adminController.updateLead);
router.delete('/leads/:id', authMiddleware, isAdmin, adminController.deleteLead);

// ------------------ Customer Routes ------------------
router.post('/customers', authMiddleware, isAdmin, adminController.createCustomer);
router.get('/customers', authMiddleware, isAdminOrLead, adminController.getCustomers); // shared
router.put('/customers/:id', authMiddleware, isAdmin, adminController.updateCustomer);
router.delete('/customers/:id', authMiddleware, isAdmin, adminController.deleteCustomer);

// ------------------ Task Routes ------------------
router.post('/tasks', authMiddleware, isAdmin, adminController.createTask);
router.get('/tasks', authMiddleware, isAdminOrLead, adminController.getTasks); // shared
router.put('/tasks/:id', authMiddleware, isAdmin, adminController.updateTask);
router.delete('/tasks/:id', authMiddleware, isAdmin, adminController.deleteTask);

// ------------------ Sales Routes ------------------
router.post('/sales', authMiddleware, isAdmin, adminController.createSale);
router.get('/sales', authMiddleware, isAdminOrLead, adminController.getSales); // shared
router.put('/sales/:id', authMiddleware, isAdmin, adminController.updateSale);
router.delete('/sales/:id', authMiddleware, isAdmin, adminController.deleteSale);

// ------------------ Purchase History ------------------
router.get('/customers/:name/purchase-history', authMiddleware, isAdminOrLead, adminController.getPurchaseHistoryByCustomerName);

// ------------------ Email Routes ------------------
router.post('/emails', authMiddleware, isAdmin, adminController.createEmail);
router.get('/emails', authMiddleware, isAdminOrLead, adminController.getEmails); // shared
router.put('/emails/:id', authMiddleware, isAdmin, adminController.updateEmail);
router.delete('/emails/:id', authMiddleware, isAdmin, adminController.deleteEmail);

// ------------------ Analytics ------------------
router.get('/analytics', authMiddleware, isAdminOrLead, adminController.getAnalytics); // shared

module.exports = router;

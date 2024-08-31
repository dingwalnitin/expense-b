const express = require('express');
const { getExpenseReport, getCategoryReport, getBudgetReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get expense report for a user
router.get('/expenses', authMiddleware, getExpenseReport);

// Get category report for a user
router.get('/categories', authMiddleware, getCategoryReport);

// Get budget report for a user
router.get('/budgets', authMiddleware, getBudgetReport);

module.exports = router;

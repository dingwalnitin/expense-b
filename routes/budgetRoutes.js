const express = require('express');
const { addBudget, getBudgets, updateBudget, deleteBudget } = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add a new budget
router.post('/', authMiddleware, addBudget);

// Get all budgets for a user
router.get('/', authMiddleware, getBudgets);

// Update a budget
router.put('/:id', authMiddleware, updateBudget);

// Delete a budget
router.delete('/:id', authMiddleware, deleteBudget);

module.exports = router;

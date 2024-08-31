const express = require('express');
const { addCategory, getCategories, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add a new category
router.post('/', authMiddleware, addCategory);

// Get all categories for a user
router.get('/', authMiddleware, getCategories);

// Delete a category
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;

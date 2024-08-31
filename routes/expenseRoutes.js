const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');

const Expense = require('../models/Expense');

// Get all expenses for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new expense
router.post(
  '/',
  [
    auth,
    [
      check('amount', 'Amount is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, category, description, date } = req.body;

    try {
      const newExpense = new Expense({
        user: req.user.id,
        amount,
        category,
        description,
        date,
      });

      const expense = await newExpense.save();
      res.json(expense);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update an expense
router.put('/:id', auth, async (req, res) => {
  const { amount, category, description, date } = req.body;

  const expenseFields = {};
  if (amount) expenseFields.amount = amount;
  if (category) expenseFields.category = category;
  if (description) expenseFields.description = description;
  if (date) expenseFields.date = date;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: expenseFields },
      { new: true }
    );

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Expense.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
const Expense = require('../models/Expense');

// Add a new expense
exports.addExpense = async (req, res) => {
    const { amount, category, description, date, receipt } = req.body;

    try {
        const newExpense = new Expense({
            user: req.user.id,
            amount,
            category,
            description,
            date,
            receipt
        });

        const expense = await newExpense.save();
        res.json(expense);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all expenses for a user
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update an expense
exports.updateExpense = async (req, res) => {
    const { amount, category, description, date, receipt } = req.body;

    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        // Ensure user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { $set: { amount, category, description, date, receipt } },
            { new: true }
        );

        res.json(expense);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        // Ensure user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Expense.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Expense removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

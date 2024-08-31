const Budget = require('../models/Budget');

// Add a new budget
exports.addBudget = async (req, res) => {
    const { category, limit, period } = req.body;

    try {
        const newBudget = new Budget({
            user: req.user.id,
            category,
            limit,
            period
        });

        const budget = await newBudget.save();
        res.json(budget);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all budgets for a user
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(budgets);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update a budget
exports.updateBudget = async (req, res) => {
    const { category, limit, period } = req.body;

    try {
        let budget = await Budget.findById(req.params.id);
        if (!budget) return res.status(404).json({ msg: 'Budget not found' });

        // Ensure user owns the budget
        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        budget = await Budget.findByIdAndUpdate(
            req.params.id,
            { $set: { category, limit, period } },
            { new: true }
        );

        res.json(budget);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id);
        if (!budget) return res.status(404).json({ msg: 'Budget not found' });

        // Ensure user owns the budget
        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Budget.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Budget removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

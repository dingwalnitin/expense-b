const Expense = require('../models/Expense');
const Category = require('../models/Category');
const Budget = require('../models/Budget');

// Get expense report
exports.getExpenseReport = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

        res.json({ totalExpenses });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get category report
exports.getCategoryReport = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id });
        const categoryReport = {};

        for (const category of categories) {
            const expenses = await Expense.find({ user: req.user.id, category: category.name });
            const totalAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
            categoryReport[category.name] = totalAmount;
        }

        res.json(categoryReport);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get budget report
exports.getBudgetReport = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });
        const budgetReport = [];

        for (const budget of budgets) {
            const expenses = await Expense.find({ user: req.user.id, category: budget.category });
            const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);
            const remainingBudget = budget.limit - totalSpent;

            budgetReport.push({
                category: budget.category,
                limit: budget.limit,
                spent: totalSpent,
                remaining: remainingBudget
            });
        }

        res.json(budgetReport);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

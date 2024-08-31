const Category = require('../models/Category');

// Add a new category
exports.addCategory = async (req, res) => {
    const { name, type } = req.body;

    try {
        const newCategory = new Category({
            user: req.user.id,
            name,
            type
        });

        const category = await newCategory.save();
        res.json(category);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all categories for a user
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(categories);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });

        // Ensure user owns the category
        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Category.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Category removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

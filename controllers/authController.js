const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            console.log(`Registration failed: User with email ${email} already exists`);
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password
        });

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) {
                console.error('JWT Sign Error:', err);
                throw err;
            }
            console.log(`User registered successfully: ${email}`);
            res.json({ token });
        });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).send('Server error');
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.log(`Login failed: No user found with email ${email}`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login failed: Incorrect password for user ${email}`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) {
                console.error('JWT Sign Error:', err);
                throw err;
            }
            console.log(`User logged in successfully: ${email}`);
            res.json({ token });
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).send('Server error');
    }
};

// Get user data
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log(`Get user failed: No user found with id ${req.user.id}`);
            return res.status(404).json({ msg: 'User not found' });
        }
        console.log(`User data fetched successfully for id: ${req.user.id}`);
        res.json(user);
    } catch (err) {
        console.error('Get User Error:', err);
        res.status(500).send('Server Error');
    }
};
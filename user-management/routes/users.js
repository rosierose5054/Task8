const express = require('express');
const router = express.Router();
const User = require('../models/Users'); // 👈 match the capital U
const { authenticate, isAdmin } = require('../middleware/auth'); // 👈 use correct middleware
const bcrypt = require('bcryptjs');

// Get all users (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get one user (admin or self)
router.get('/:id', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id != req.params.id)
            return res.status(403).json({ error: 'Forbidden' });

        const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user (admin or self)
router.put('/:id', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id != req.params.id)
            return res.status(403).json({ error: 'Forbidden' });

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { username, email, password } = req.body;
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.json({ message: 'User updated', user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        await user.destroy();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

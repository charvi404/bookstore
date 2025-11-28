const express = require('express');
const router = express.Router();
const db = require('../db');

// Registration (only for customers)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        (err, result) => {
            if(err) return res.status(500).json(err);
            res.json({ message: 'User registered successfully' });
        }
    );
});

// Login (handles both customer and admin)
router.post('/login', (req, res) => {
    const { email, password, role } = req.body;

    // If admin login
    if (role === 'admin') {
        db.query('SELECT * FROM admins WHERE email = ?', [email], (err, results) => {
            if(err) return res.status(500).json(err);
            if(results.length === 0) return res.status(400).json({ message: 'Admin not found' });

            const admin = results[0];
            if(password !== admin.password) return res.status(400).json({ message: 'Invalid password' });

            res.json({ message: 'Admin login successful', user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
        });
    } 
    // If customer login
    else {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if(err) return res.status(500).json(err);
            if(results.length === 0) return res.status(400).json({ message: 'User not found' });

            const user = results[0];
            if(password !== user.password) return res.status(400).json({ message: 'Invalid password' });

            res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: 'customer' } });
        });
    }
});

module.exports = router;

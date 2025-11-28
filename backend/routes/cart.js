const express = require('express');
const router = express.Router();
const db = require('../db');

// Temporary in-memory cart (for demonstration)
let cart = [];

// Get cart items
router.get('/', (req, res) => {
    res.json(cart);
});

// Add item to cart
router.post('/add', (req, res) => {
    const { bookId, quantity } = req.body;

    // Check if book already in cart
    const existing = cart.find(item => item.bookId === bookId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ bookId, quantity });
    }
    res.json({ message: 'Book added to cart', cart });
});

// Remove item from cart
router.post('/remove', (req, res) => {
    const { bookId } = req.body;
    cart = cart.filter(item => item.bookId !== bookId);
    res.json({ message: 'Book removed from cart', cart });
});

module.exports = router;

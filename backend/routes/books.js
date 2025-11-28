const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if(err) return res.status(500).json(err);
        res.json(results);
    });
});

router.post('/add', (req, res) => {
    const { title, author, price, image } = req.body;
    if (!title || !author || !price || !image) {
        return res.status(400).json({ message: 'All fields required' });
    }
    db.query(
        'INSERT INTO books (title, author, price, image) VALUES (?, ?, ?, ?)',
        [title, author, price, image],
        (err, result) => {
            if(err) return res.status(500).json(err);
            res.json({ message: 'Book added', bookId: result.insertId });
        }
    );
});

router.post('/delete', (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Book ID required' });
    db.query('DELETE FROM books WHERE id = ?', [id], (err, result) => {
        if(err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    });
});

module.exports = router;

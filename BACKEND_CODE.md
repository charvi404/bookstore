# Online Bookstore Backend (Node.js/Express)

## backend/server.js
```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/cart', cartRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## backend/db.js
```javascript
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ritesh2799@',
    database: 'bookstore'
});

db.connect((err) => {
    if(err) throw err;
    console.log('MySQL Connected...');
});

module.exports = db;
```

## backend/routes/auth.js
```javascript
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
```

## backend/routes/books.js
```javascript
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
```

## backend/routes/cart.js
```javascript
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
```

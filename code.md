# Full Source Code for Online Bookstore

## backend/server.js
```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);

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
const bcrypt = require('bcryptjs');

// Registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
            if(err) return res.status(500).json(err);
            res.json({ message: 'User registered successfully' });
        }
    );
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if(err) return res.status(500).json(err);
        if(results.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) return res.status(400).json({ message: 'Invalid password' });

        res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
    });
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

module.exports = router;
```

## frontend/src/pages/Home.js
```javascript
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container">
            <h1>Welcome to Online Book Store</h1>
            <nav>
                <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/catalogue">Catalogue</Link>
            </nav>
        </div>
    );
}

export default Home;
```

## frontend/src/pages/Login.js
```javascript
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
            alert(res.data.message);
            navigate('/catalogue');
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
```

## frontend/src/pages/Register.js
```javascript
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/register', { name, email, password });
            alert(res.data.message);
            navigate('/login');
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
```

## frontend/src/pages/Catalogue.js
```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';

function Catalogue() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/books')
            .then(res => setBooks(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="catalogue">
            <h2>Book Catalogue</h2>
            <div className="books-grid">
                {books.map(book => (
                    <div className="book-card" key={book.id}>
                        <img src={book.image} alt={book.title} />
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                        <p>${book.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Catalogue;
```

## frontend/src/App.js
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogue from './pages/Catalogue';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalogue" element={<Catalogue />} />
      </Routes>
    </Router>
  );
}

export default App;
```

## frontend/src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## frontend/src/styles/App.css
```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: #f4f4f4;
}

.container {
    text-align: center;
    padding: 50px;
}

nav a {
    margin: 0 15px;
    text-decoration: none;
    color: #333;
    font-weight: bold;
    transition: color 0.3s;
}

nav a:hover {
    color: #007bff;
}

.form-container {
    max-width: 400px;
    margin: 50px auto;
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.form-container h2 {
    margin-top: 0;
    color: #333;
}

.form-container input {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-size: 14px;
}

.form-container input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.form-container button {
    width: 100%;
    padding: 12px;
    background: #333;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background 0.3s;
}

.form-container button:hover {
    background: #555;
}

.catalogue {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.catalogue h2 {
    text-align: center;
    color: #333;
}

.books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.book-card {
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 0 8px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.book-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
}

.book-card h3 {
    margin: 10px 0 5px;
    color: #333;
}

.book-card p {
    margin: 5px 0;
    color: #666;
}
```

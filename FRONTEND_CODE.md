# Online Bookstore Frontend (React)

## Main Files

### src/App.js
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogue from './pages/Catalogue';
import Cart from './pages/cart';
import Admin from './pages/Admin';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### src/pages/Login.js
```javascript
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', { email, password, role });
            alert(res.data.message);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', email);
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/catalogue');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{margin: '10px 0'}}>
                    <label style={{marginRight: '20px'}}>
                        <input type="radio" value="customer" checked={role === 'customer'} onChange={e => setRole(e.target.value)} />
                        Customer
                    </label>
                    <label>
                        <input type="radio" value="admin" checked={role === 'admin'} onChange={e => setRole(e.target.value)} />
                        Admin
                    </label>
                </div>
                                <input
                                    type={role === 'admin' ? 'text' : 'email'}
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
```

### src/pages/Catalogue.js
```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';


function Catalogue() {
    const [books, setBooks] = useState([]);
    const [addedBookId, setAddedBookId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5001/api/books')
            .then(res => setBooks(res.data))
            .catch(() => {});
    }, []);

    const addToCart = (bookId) => {
        axios.post('http://localhost:5001/api/cart/add', { bookId, quantity: 1 })
            .then(() => {
                setAddedBookId(bookId);
                setTimeout(() => setAddedBookId(null), 1200);
            })
            .catch(() => {});
    };

    return (
        <div className="catalogue">
            <h2>Book Catalogue</h2>
            <div className="books-grid">
                {books.map(book => (
                    <div className="book-card" key={book.id}>
                        <img src={book.image} alt={book.title} />
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                        <p>{book.price}</p>
                        <button onClick={() => addToCart(book.id)} disabled={addedBookId === book.id}>
                            {addedBookId === book.id ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Catalogue;
```

### src/pages/Admin.js
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'admin') {
            alert('Unauthorized');
            navigate('/login');
        }
        fetchBooks();
    }, [navigate]);

    const fetchBooks = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/books');
            setBooks(res.data);
        } catch (err) {}
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!title || !author || !price || !image) {
            alert('Fill all fields');
            return;
        }
        try {
            await axios.post('http://localhost:5001/api/books/add', {
                title, author, price: parseFloat(price), image
            });
            alert('Book added');
            setTitle('');
            setAuthor('');
            setPrice('');
            setImage('');
            fetchBooks();
        } catch (err) {
            alert('Error adding book');
        }
    };

    const handleDelete = async (bookId) => {
        if (window.confirm('Delete this book?')) {
            try {
                await axios.post('http://localhost:5001/api/books/delete', { id: bookId });
                alert('Deleted');
                fetchBooks();
            } catch (err) {
                alert('Error deleting');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    return (
        <div style={{padding: '30px', maxWidth: '1250px', margin: '30px auto', background: '#fff', borderRadius: '12px', border: '1px solid #e8eef5', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e8eef5'}}>
                <h2 style={{margin: 0, color: '#2c3e50', fontSize: '26px', fontWeight: '500'}}>Admin Dashboard</h2>
                <button onClick={handleLogout} style={{padding: '11px 22px', background: '#d4727f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease'}} onMouseOver={e => e.target.style.background = '#c15563'} onMouseOut={e => e.target.style.background = '#d4727f'}>
                    Logout
                </button>
            </div>

            <div style={{background: '#f8fafc', padding: '28px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e8eef5'}}>
                <h3 style={{margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px', fontWeight: '500'}}>Add New Book</h3>
                <form onSubmit={handleAddBook}>
                    <input type="text" placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)} style={{width: '100%', padding: '12px 14px', margin: '10px 0', borderRadius: '6px', border: '1px solid #d4dfe6', boxSizing: 'border-box', background: '#fff', fontSize: '14px', color: '#2c3e50', transition: 'all 0.3s ease'}} onFocus={e => e.target.style.borderColor = '#5a7a9e'} onBlur={e => e.target.style.borderColor = '#d4dfe6'} required />
                    <input type="text" placeholder="Author Name" value={author} onChange={e => setAuthor(e.target.value)} style={{width: '100%', padding: '12px 14px', margin: '10px 0', borderRadius: '6px', border: '1px solid #d4dfe6', boxSizing: 'border-box', background: '#fff', fontSize: '14px', color: '#2c3e50'}} onFocus={e => e.target.style.borderColor = '#5a7a9e'} onBlur={e => e.target.style.borderColor = '#d4dfe6'} required />
                    <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} step="0.01" style={{width: '100%', padding: '12px 14px', margin: '10px 0', borderRadius: '6px', border: '1px solid #d4dfe6', boxSizing: 'border-box', background: '#fff', fontSize: '14px', color: '#2c3e50'}} onFocus={e => e.target.style.borderColor = '#5a7a9e'} onBlur={e => e.target.style.borderColor = '#d4dfe6'} required />
                    <input type="text" placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} style={{width: '100%', padding: '12px 14px', margin: '10px 0', borderRadius: '6px', border: '1px solid #d4dfe6', boxSizing: 'border-box', background: '#fff', fontSize: '14px', color: '#2c3e50'}} onFocus={e => e.target.style.borderColor = '#5a7a9e'} onBlur={e => e.target.style.borderColor = '#d4dfe6'} required />
                    <button type="submit" style={{padding: '12px 24px', background: '#5a7a9e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '15px', fontWeight: '500', fontSize: '15px', transition: 'all 0.3s ease'}} onMouseOver={e => e.target.style.background = '#4a6585'} onMouseOut={e => e.target.style.background = '#5a7a9e'}>Add Book</button>
                </form>
            </div>

            <h3 style={{margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px', fontWeight: '500'}}>Manage Books</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'}}>
                {books.map(book => (
                    <div key={book.id} style={{background: '#fff', padding: '18px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e8eef5', transition: 'all 0.3s ease'}} onMouseOver={e => {e.currentTarget.style.boxShadow = '0 8px 25px rgba(90, 122, 158, 0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'}} onMouseOut={e => {e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'}}>
                        <img src={book.image} alt={book.title} style={{width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px'}} />
                        <h4 style={{margin: '12px 0 6px', color: '#2c3e50', fontSize: '16px', fontWeight: '500'}}>{book.title}</h4>
                        <p style={{margin: '5px 0', fontSize: '13px', color: '#7a8fa3'}}>{book.author}</p>
                        <p style={{margin: '8px 0', fontWeight: '500', color: '#2c3e50', fontSize: '15px'}}>{book.price}</p>
                        <button onClick={() => handleDelete(book.id)} style={{width: '100%', padding: '10px', background: '#d4727f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px', fontWeight: '500', fontSize: '14px', transition: 'all 0.3s ease'}} onMouseOver={e => e.target.style.background = '#c15563'} onMouseOut={e => e.target.style.background = '#d4727f'}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Admin;
```

### src/pages/cart.js
```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Fetch cart items
        axios.get('http://localhost:5001/api/cart')
            .then(res => setCartItems(res.data))
            .catch(err => console.error(err));

        // Fetch books to get book details
        axios.get('http://localhost:5001/api/books')
            .then(res => setBooks(res.data))
            .catch(err => console.error(err));
    }, []);

    const removeFromCart = (bookId) => {
        axios.post('http://localhost:5001/api/cart/remove', { bookId })
            .then(res => setCartItems(res.data.cart))
            .catch(err => console.error(err));
    };

    const getBookDetails = (bookId) => books.find(b => b.id === bookId) || {};

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? <p>Cart is empty</p> :
            <div className="books-grid">
                {cartItems.map(item => {
                    const book = getBookDetails(item.bookId);
                    return (
                        <div className="book-card" key={item.bookId}>
                            <img src={book.image} alt={book.title} />
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <p>Qty: {item.quantity}</p>
                            <p>Price: {book.price * item.quantity}</p>
                            <button onClick={() => removeFromCart(item.bookId)}>Remove</button>
                        </div>
                    );
                })}
            </div>}
        </div>
    );
}

export default Cart;
```

### src/styles/App.css
```css
body {
    font-family: 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
}

.container {
    text-align: center;
    padding: 50px 40px;
    background: #fff;
    max-width: 900px;
    margin: 30px auto;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    border: none;
}

.container h1 {
    color: #2c3e50;
    margin: 0 0 25px 0;
    font-size: 30px;
    font-weight: 500;
}

nav {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
}

nav a {
    text-decoration: none;
    color: #5a7a9e;
    font-weight: 500;
    font-size: 15px;
    padding: 10px 18px;
    border: 1px solid #d4dfe6;
    border-radius: 6px;
    transition: all 0.3s ease;
    background: #f8fafc;
}

nav a:hover {
    background: #5a7a9e;
    color: #fff;
    border-color: #5a7a9e;
    box-shadow: 0 4px 12px rgba(90, 122, 158, 0.2);
}

.form-container {
    max-width: 420px;
    margin: 40px auto;
    background: #fff;
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #e8eef5;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.form-container h2 {
    margin: 0 0 28px 0;
    color: #2c3e50;
    font-size: 24px;
    font-weight: 500;
}

.form-container input {
    width: 100%;
    padding: 12px 14px;
    margin: 12px 0;
    border-radius: 6px;
    border: 1px solid #d4dfe6;
    box-sizing: border-box;
    font-size: 14px;
    background: #f8fafc;
    transition: all 0.3s ease;
    color: #2c3e50;
}

.form-container input:focus {
    outline: none;
    border-color: #5a7a9e;
    box-shadow: 0 0 8px rgba(90, 122, 158, 0.15);
    background: #fff;
}

.form-container button {
    width: 100%;
    padding: 12px;
    background: #5a7a9e;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.3s ease;
    margin-top: 15px;
}

.form-container button:hover {
    background: #4a6585;
    box-shadow: 0 4px 15px rgba(90, 122, 158, 0.25);
}

.catalogue {
    padding: 35px;
    max-width: 1250px;
    margin: 30px auto;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e8eef5;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.catalogue h2 {
    text-align: center;
    color: #2c3e50;
    font-size: 26px;
    margin-bottom: 30px;
    font-weight: 500;
}

.books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 22px;
}

.book-card {
    background: linear-gradient(135deg, #f8fafc 60%, #e9ecef 100%);
    padding: 22px 18px 18px 18px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 4px 18px rgba(90, 122, 158, 0.07);
    border: 1.5px solid #e8eef5;
    transition: all 0.3s cubic-bezier(.4,1,.7,1.2);
    position: relative;
    overflow: hidden;
}

.book-card:hover {
    box-shadow: 0 12px 32px rgba(90, 122, 158, 0.16);
    border-color: #d4dfe6;
    transform: translateY(-5px) scale(1.025);
}

.book-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 14px;
    box-shadow: 0 2px 10px rgba(90, 122, 158, 0.08);
    transition: transform 0.3s cubic-bezier(.4,1,.7,1.2), box-shadow 0.3s;
}
.book-card:hover img {
    transform: scale(1.035);
    box-shadow: 0 8px 24px rgba(90, 122, 158, 0.13);
}

.book-card h3 {
    margin: 10px 0 4px;
    color: #2c3e50;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.01em;
}

.book-card p {
    margin: 4px 0;
    color: #7a8fa3;
    font-size: 14px;
    line-height: 1.5;
}
.book-card p:last-of-type {
    color: #5a7a9e;
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 14px;
}

.book-card button {
    background: #5a7a9e;
    color: #fff;
    border: none;
    padding: 12px 0;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    margin-top: 0;
    width: 100%;
    font-size: 15px;
    transition: all 0.3s cubic-bezier(.4,1,.7,1.2);
    box-shadow: 0 2px 8px rgba(90, 122, 158, 0.08);
}

.book-card button:hover {
    background: #4a6585;
    box-shadow: 0 6px 18px rgba(90, 122, 158, 0.18);
}

.cart {
    padding: 35px;
    max-width: 1250px;
    margin: 30px auto;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e8eef5;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.cart h2 {
    color: #2c3e50;
    font-size: 26px;
    margin: 0 0 25px 0;
    text-align: center;
    font-weight: 500;
}
```

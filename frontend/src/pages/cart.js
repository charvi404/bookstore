import { useEffect, useState } from 'react';
import axios from 'axios';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [books, setBooks] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5001/api/cart')
            .then(res => setCartItems(res.data))
            .catch(() => {});

        axios.get('http://localhost:5001/api/books')
            .then(res => setBooks(res.data))
            .catch(() => {});
    }, []);
    const removeFromCart = (bookId) => {
        axios.post('http://localhost:5001/api/cart/remove', { bookId })
            .then(res => {
                setCartItems(res.data.cart);
                setMessage('Removed from Cart');
                setTimeout(() => setMessage(''), 2000);
            })
            .catch(() => {});
    };

    const getBookDetails = (bookId) => books.find(b => b.id === bookId) || {};

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {message && <p style={{color: '#5a7a9e', fontWeight: '500'}}>{message}</p>}
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

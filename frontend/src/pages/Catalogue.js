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

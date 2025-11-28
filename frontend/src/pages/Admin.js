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

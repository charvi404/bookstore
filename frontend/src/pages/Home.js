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

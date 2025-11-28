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

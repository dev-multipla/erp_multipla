// LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './LoginForm.css';
import logo from './logomodelo.png';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password,
            });
            const token = response.data.access;
            localStorage.setItem('token', token);
            login(token, username); // Passa o token e o nome de usuário
            navigate('/home');
        } catch (error) {
            setError('Erro ao fazer login.');
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-color"></div>
            <div className="login-form">
                <img src={logo} alt="Logo" className="logo" />
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuário:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-button">Acessar</button>
                    <p className="links">
                        <a href="/register" className="link-highlight">Cadastrar-se</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;

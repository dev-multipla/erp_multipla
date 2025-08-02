// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api'; // importa a instância configurada de axios
import './LoginForm.css';
import logo from './logomodelo.png';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      // 1) obtém tokens via endpoint /api/token/
      const response = await api.post('/api/token/', { username, password });
      const token = response.data.access;

      // 2) salva no localStorage e no AuthContext
      localStorage.setItem('token', token);
      login(token, username);

      // 3) redireciona para a rota principal (por ex., /home)
      navigate('/home');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Usuário ou senha inválidos');
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
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">
            Acessar
          </button>

          <p className="links">
            <a href="/register" className="link-highlight">Cadastrar-se</a>
          </p>
        </form>
      </div>
    </div>
  );
}

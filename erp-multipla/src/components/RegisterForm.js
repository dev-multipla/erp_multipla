import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css'; // Usando a mesma estilização do LoginForm
import logo from './logomodelo.png'

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        username,
        password,
        perfilusuario: {
          email,
          empresa: empresa ? parseInt(empresa, 10) : null,
        },
      });
      setSuccess('Cadastro realizado com sucesso!');
      setError(null);
    } catch (error) {
      setError('Erro ao cadastrar. Verifique as informações.');
      setSuccess(null);
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-color">
        {/* Opções de personalização, se necessário */}
      </div>
      <div className="login-form">
      <img src={logo} alt="Logo" className="logo" />
        <h2>Cadastro de Usuário</h2>
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
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="empresa">ID da Empresa:</label>
            <input
              type="number"
              id="empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="submit-button">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;

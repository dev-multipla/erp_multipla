// src/components/RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';                  // usa a instância API já configurada
import './RegisterForm.css';
import logo from './logomodelo.png';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 1) carrega lista de empresas no mount
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const response = await api.get('/api/empresas-list/');
        setEmpresas(response.data);
      } catch (err) {
        console.error('Erro ao buscar empresas:', err);
        setError('Erro ao carregar lista de empresas.');
      }
    }
    fetchEmpresas();
  }, []);

  // 2) ao submeter o formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!empresa) {
      setError('Por favor, selecione uma empresa.');
      return;
    }

    try {
      // Monta exatamente o JSON que o UserSerializer espera
      const payload = {
        username,
        password,
        email,                                // nível root
        perfilusuario: {
          email,                             // deve repetir aqui
          empresa_padrao: parseInt(empresa, 10)
          // empresas_acessiveis: []        // opcional
        }
      };

      // Se você mapeou “register” em vez de “usuarios/”, use '/api/register/'
      await api.post('/api/usuarios/', payload);
      setSuccess('Cadastro realizado com sucesso!');
      setUsername('');
      setPassword('');
      setEmail('');
      setEmpresa('');
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      const detail = err.response?.data || err.message;
      setError(
        typeof detail === 'string'
          ? detail
          : JSON.stringify(detail)
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-color" />
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

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="empresa">Empresa:</label>
            <select
              id="empresa"
              value={empresa}
              onChange={e => setEmpresa(e.target.value)}
              required
            >
              <option value="">Selecione a empresa</option>
              {empresas.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.nome}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="submit-button">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

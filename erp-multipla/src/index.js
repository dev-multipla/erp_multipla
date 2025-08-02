// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import App from './App';
import { AuthProvider } from './AuthContext'; // Importe o provedor de contexto
=======
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './App';
import { AuthProvider } from './AuthContext';
import { CompanyProvider } from './CompanyContext';
import './index.css'; // caso tenha estilos globais
>>>>>>> e62255e (Atualizações no projeto)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <AuthProvider> {/* Envolva o App com o AuthProvider */}
      <App />
    </AuthProvider>
=======
    <Router>
      <AuthProvider>
        <CompanyProvider>
          <AppRoutes />
        </CompanyProvider>
      </AuthProvider>
    </Router>
>>>>>>> e62255e (Atualizações no projeto)
  </React.StrictMode>
);

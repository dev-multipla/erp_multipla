// App.js
import React, { useState, useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ContaPagarForm from './components/ContaPagarForm';
import ContaAReceberForm from './components/ContaReceberForm';
import RelatorioFinanceiro from './components/RelatorioFinanceiro';
import RelatorioProjecoes from './components/RelatorioProjecoes';
import HomePage from './components/HomePage';
import ContractForm from './components/ContratoForm';
import { useAuth } from './AuthContext';
import ProjetoForm from './components/ProjetoForm';
import ContasPagarAvulsoForm from './components/ContasPagarAvalsoForm';
import ContasReceberAvulsoForm from './components/ContasReceberAvulsoForm';
import './App.css';
import ContractsList from './components/ContractsList';
import ProjetoList from './components/ProjetoListForm';
import ClienteList from './components/ClienteListForm';
import FornecedorList from './components/FornecedorListForm';
import FornecedorForm from './components/FornecedorForm';
import ClientForm from './components/ClientForm';
import PagamentoList from './components/PagamentoListForm';
import PagamentoForm from './components/PagamentoForm';
import { jwtDecode } from 'jwt-decode';
import useIdleTimer from './useIdleTimer';
import InactivityModal from './components/InactivityModal';

function App() {
  const { isLoggedIn, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        logout();
        window.location.href = '/login?message=Token expired, please login again';
      } else {
        login(storedToken);
      }
    }

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimeout);
  }, [login, logout]);

  useIdleTimer(() => {
    logout();
    setIsModalOpen(true);
  }, 300000); // 5 minutos de inatividade

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.href = '/login?message=You have been logged out due to inactivity';
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <BarLoader color="#009C95" size={50} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/contas-pagar"
          element={isLoggedIn ? <ContaPagarForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/contas-receber"
          element={isLoggedIn ? <ContaAReceberForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/relatorio-financeiro"
          element={isLoggedIn ? <RelatorioFinanceiro /> : <Navigate to="/" replace />}
        />
        <Route
          path="/relatorio-projecoes"
          element={isLoggedIn ? <RelatorioProjecoes /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cadastro-contrato"
          element={isLoggedIn ? <ContractForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/editar-contrato/:id"
          element={isLoggedIn ? <ContractForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cadastro-projeto"
          element={isLoggedIn ? <ProjetoForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/editar-projeto/:id"
          element={isLoggedIn ? <ProjetoForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/contas-pagar-avulso"
          element={isLoggedIn ? <ContasPagarAvulsoForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/contas-receber-avulso"
          element={isLoggedIn ? <ContasReceberAvulsoForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/contratos-lista"
          element={isLoggedIn ? <ContractsList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/projeto-listar"
          element={isLoggedIn ? <ProjetoList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cliente-listar"
          element={isLoggedIn ? <ClienteList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/fornecedor-listar"
          element={isLoggedIn ? <FornecedorList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/editar-fornecedor/:id"
          element={isLoggedIn ? <FornecedorForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cadastro-fornecedor"
          element={isLoggedIn ? <FornecedorForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cadastro-cliente"
          element={isLoggedIn ? <ClientForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/editar-cliente/:id"
          element={isLoggedIn ? <ClientForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/pagamento-listar"
          element={isLoggedIn ? <PagamentoList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cadastro-pagamento"
          element={isLoggedIn ? <PagamentoForm /> : <Navigate to="/" replace />}
        />
      </Routes>
      <InactivityModal isOpen={isModalOpen} onRequestClose={handleCloseModal} />
    </Router>
  );
}

export default App;
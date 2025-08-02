<<<<<<< HEAD
// App.js
import React, { useState, useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
=======
// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';
import ProtectedRoute from './routes/ProtectedRoute';

import CompanySelectionModal from './components/CompanySelectionModal';
import InactivityModal from './components/InactivityModal';
import useIdleTimer from './useIdleTimer';
import { ToastContainer, toast } from 'react-toastify';

// Páginas públicas
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

// Páginas privadas - mantendo as mesmas importações
import HomePage from './components/HomePage';
>>>>>>> e62255e (Atualizações no projeto)
import ContaPagarForm from './components/ContaPagarForm';
import ContaAReceberForm from './components/ContaReceberForm';
import RelatorioFinanceiro from './components/RelatorioFinanceiro';
import RelatorioProjecoes from './components/RelatorioProjecoes';
<<<<<<< HEAD
import HomePage from './components/HomePage';
import ContractForm from './components/ContratoForm';
import { useAuth } from './AuthContext';
import ProjetoForm from './components/ProjetoForm';
import ContasPagarAvulsoForm from './components/ContasPagarAvulsoForm';
import ContasReceberAvulsoForm from './components/ContasReceberAvulsoForm';
import './App.css';
=======
import ContractForm from './components/ContratoForm';
import ProjetoForm from './components/ProjetoForm';
import ContasPagarAvulsoForm from './components/ContasPagarAvulsoForm';
import ContasReceberAvulsoForm from './components/ContasReceberAvulsoForm';
import CadastroContasFinanceiras from './components/CadastroContasFinanceiras';
import CadastroCentroCusto from './components/CadastroCentroCusto';
import RegistroContasPagar from './components/RegistrosContasPagar';
import MovFinanceira from './components/MovFinanceira';
>>>>>>> e62255e (Atualizações no projeto)
import ContractsList from './components/ContractsList';
import ProjetoList from './components/ProjetoListForm';
import ClienteList from './components/ClienteListForm';
import FornecedorList from './components/FornecedorListForm';
import FornecedorForm from './components/FornecedorForm';
<<<<<<< HEAD
import ClientForm from './components/ClientForm';
import PagamentoList from './components/PagamentoListForm';
import PagamentoForm from './components/PagamentoForm';
import { jwtDecode } from 'jwt-decode';
import useIdleTimer from './useIdleTimer';
import InactivityModal from './components/InactivityModal';
import CadastroContasFinanceiras from './components/CadastroContasFinanceiras';
import CadastroCentroCusto from './components/CadastroCentroCusto';
import RegistroContasPagar from './components/RegistrosContasPagar'
import MovFinanceira from './components/MovFinanceira'


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
  }, 1000000); // 5 minutos de inatividade

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.href = '/login?message=You have been logged out due to inactivity';
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <BarLoader color="#009C95" size={50} />
=======
import FuncionarioList from './components/FuncionarioListForm';
import FuncionarioForm from './components/FuncionarioForm';
import ClientForm from './components/ClientForm';
import PagamentoList from './components/PagamentoListForm';
import PagamentoForm from './components/PagamentoForm';
import RelatorioContrato from './components/RelatorioContrato';
import AdminEmpresas from './components/AdminEmpresas';
import RelatorioResultadoProjeto from './components/RelatorioProjetos';
import RelatorioDinamico from './components/RelatorioDinamico';

function AppRoutes() {
  const { isLoggedIn, isLoading, logout } = useAuth();
  const { companies, selectedCompanyId } = useCompany();
  const navigate = useNavigate();

  // Estados para modais
  const [idleOpen, setIdleOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);

  // Configuração do timer de inatividade - 30 minutos
  const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutos
  const WARNING_TIMEOUT = 25 * 60 * 1000; // 25 minutos (5 min antes do logout)

  // Timer de aviso (5 minutos antes do logout)
  useIdleTimer(() => {
    if (isLoggedIn) {
      setWarningOpen(true);
      toast.warn('⚠️ Sua sessão expirará em 5 minutos por inatividade!', {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, WARNING_TIMEOUT);

  // Timer de logout forçado
  useIdleTimer(() => {
    if (isLoggedIn) {
      console.log('⏰ Logout por inatividade (30 minutos)');
      logout();
      setIdleOpen(true);
    }
  }, IDLE_TIMEOUT);

  // Modal de seleção de empresa
  const showCompanyModal = isLoggedIn && companies.length > 0 && !selectedCompanyId;

  // Handlers para modais
  const handleIdleClose = () => {
    setIdleOpen(false);
    navigate('/', { replace: true });
  };

  const handleWarningClose = () => {
    setWarningOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
>>>>>>> e62255e (Atualizações no projeto)
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
          path="/cadastro-contas-financeiras"
          element={isLoggedIn ? <CadastroContasFinanceiras /> : <Navigate to="/" replace />}
        />

        <Route
          path="/cadastro-centro-custos"
          element={isLoggedIn ? <CadastroCentroCusto /> : <Navigate to="/" replace />}
        />  

        <Route
          path="/registro-contas-pagar"
          element={isLoggedIn ? <RegistroContasPagar /> : <Navigate to="/" replace />}
        />
        <Route
          path="/movimentacao-financeira"
          element={isLoggedIn ? <MovFinanceira /> : <Navigate to="/" replace />}
=======
    <>
      {/* Modal de seleção de empresa */}
      <CompanySelectionModal isOpen={showCompanyModal} />

      {/* Modal de inatividade */}
      <InactivityModal 
        isOpen={idleOpen} 
        onRequestClose={handleIdleClose}
        title="Sessão Expirada"
        message="Sua sessão expirou por inatividade. Você será redirecionado para o login."
      />

      {/* Modal de aviso de inatividade */}
      <InactivityModal 
        isOpen={warningOpen} 
        onRequestClose={handleWarningClose}
        title="Aviso de Inatividade"
        message="Sua sessão expirará em 5 minutos. Mova o mouse ou clique para continuar."
        showContinueButton={true}
      />

      {/* Toast container */}
      <ToastContainer />

      {/* Definição das rotas */}
      <Routes>
        {/** ROTAS PÚBLICAS **/}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/home" replace /> : <LoginForm />
          }
        />
        <Route path="/register" element={<RegisterForm />} />

        {/** ROTAS PROTEGIDAS **/}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contas-pagar"
          element={
            <ProtectedRoute>
              <ContaPagarForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contas-receber"
          element={
            <ProtectedRoute>
              <ContaAReceberForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/relatorio-financeiro"
          element={
            <ProtectedRoute>
              <RelatorioFinanceiro />
            </ProtectedRoute>
          }
        />
        <Route
          path="/relatorio-projecoes"
          element={
            <ProtectedRoute>
              <RelatorioProjecoes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cadastro-contrato"
          element={
            <ProtectedRoute>
              <ContractForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-contrato/:id"
          element={
            <ProtectedRoute>
              <ContractForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cadastro-projeto"
          element={
            <ProtectedRoute>
              <ProjetoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-projeto/:id"
          element={
            <ProtectedRoute>
              <ProjetoForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contas-pagar-avulso"
          element={
            <ProtectedRoute>
              <ContasPagarAvulsoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contas-receber-avulso"
          element={
            <ProtectedRoute>
              <ContasReceberAvulsoForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cadastro-contas-financeiras"
          element={
            <ProtectedRoute>
              <CadastroContasFinanceiras />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cadastro-centro-custos"
          element={
            <ProtectedRoute>
              <CadastroCentroCusto />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registro-contas-pagar"
          element={
            <ProtectedRoute>
              <RegistroContasPagar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movimentacao-financeira"
          element={
            <ProtectedRoute>
              <MovFinanceira />
            </ProtectedRoute>
          }
>>>>>>> e62255e (Atualizações no projeto)
        />

        <Route
          path="/contratos-lista"
<<<<<<< HEAD
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
=======
          element={
            <ProtectedRoute>
              <ContractsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projeto-listar"
          element={
            <ProtectedRoute>
              <ProjetoList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente-listar"
          element={
            <ProtectedRoute>
              <ClienteList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fornecedor-listar"
          element={
            <ProtectedRoute>
              <FornecedorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cadastro-fornecedor"
          element={
            <ProtectedRoute>
              <FornecedorForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-fornecedor/:id"
          element={
            <ProtectedRoute>
              <FornecedorForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/funcionario-listar"
          element={
            <ProtectedRoute>
              <FuncionarioList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cadastro-funcionario"
          element={
            <ProtectedRoute>
              <FuncionarioForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editar-funcionario/:id"
          element={
            <ProtectedRoute>
              <FuncionarioForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cadastro-cliente"
          element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-cliente/:id"
          element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagamento-listar"
          element={
            <ProtectedRoute>
              <PagamentoList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cadastro-pagamento"
          element={
            <ProtectedRoute>
              <PagamentoForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/relatorio-contrato"
          element={
            <ProtectedRoute>
              <RelatorioContrato />
            </ProtectedRoute>
          }
        />

        <Route
          path="/relatorio-projetos"
          element={
            <ProtectedRoute>
              <RelatorioResultadoProjeto />
            </ProtectedRoute>
          }
        />

        <Route
          path="/relatorio-dinamico"
          element={
            <ProtectedRoute>
              <RelatorioDinamico />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-empresas"
          element={
            <ProtectedRoute>
              <AdminEmpresas />
            </ProtectedRoute>
          }
        />

        {/** 404 **/}
        <Route path="*" element={<h1>404 – Página não encontrada</h1>} />
      </Routes>
    </>
  );
}

export default AppRoutes;
>>>>>>> e62255e (Atualizações no projeto)

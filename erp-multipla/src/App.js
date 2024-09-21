import React, { useState, useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm'; // Importa o novo componente
import ContaPagarForm from './components/ContaPagarForm';
import ContaAReceberForm from './components/ContaReceberForm';
import RelatorioFinanceiro from './components/RelatorioFinanceiro';
import HomePage from './components/HomePage';
import ContractForm from './components/ContratoForm'; // Importa o novo componente
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

function App() {
  const { isLoggedIn, login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      login(storedToken);
    }

    // Simula um atraso e define isLoading como false
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Ajuste o tempo de carregamento conforme necessário

    return () => clearTimeout(loadingTimeout); // Limpa o timeout se o componente for desmontado antes do tempo
  }, [login]);

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
        <Route path="/register" element={<RegisterForm />} /> {/* Adiciona a nova rota */}
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
          path="/cadastro-contrato"
          element={isLoggedIn ? <ContractForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cadastro-projeto"
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
          path="/cadastro-fornecedor"
          element={isLoggedIn ? <FornecedorForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cadastro-cliente"
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

    </Router>
  );
}

export default App;

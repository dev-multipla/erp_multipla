// src/BranchContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BranchContext = createContext({
  empresa: null,
  selectedFilialId: '',
  setSelectedFilialId: () => {}
});

export const BranchProvider = ({ children }) => {
  const { token } = useAuth();
  const [empresa, setEmpresa] = useState(null);
  const [selectedFilialId, setSelectedFilialIdState] = useState(
    localStorage.getItem('selectedFilialId') || ''
  );

  // 1) Busca empresa + filiais
  useEffect(() => {
    if (!token) return;
    axios.get('/api/me/', {
      baseURL: 'https://financeiro.multipla.tec.br',
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(meRes => {
      const empId = meRes.data.perfilusuario.empresa;
      return axios.get(`/api/empresas/${empId}/`, {
        baseURL: 'https://financeiro.multipla.tec.br',
        headers: { Authorization: `Bearer ${token}` }
      });
    })
    .then(empRes => setEmpresa(empRes.data))
    .catch(err => console.error('Erro ao carregar empresa e filiais:', err));
  }, [token]);

  // 2) Configura o interceptor **aqui**  
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(config => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      // usa o state/localStorage sincronizado
      const id = selectedFilialId || 'all';
      config.headers['X-Filial-ID'] = id;
      config.baseURL = 'https://financeiro.multipla.tec.br';  // se quiser centralizar o baseURL
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, [token, selectedFilialId]);

  // setter que grava em state + localStorage
  const setSelectedFilialId = (id) => {
    setSelectedFilialIdState(id);
    localStorage.setItem('selectedFilialId', id);
  };

  return (
    <BranchContext.Provider value={{
      empresa,
      selectedFilialId,
      setSelectedFilialId
    }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);

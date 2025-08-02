// src/CompanyContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

const CompanyContext = createContext({ companies: [], selectedCompanyId: '', switchCompany: () => {} });

export function CompanyProvider({ children }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    () => localStorage.getItem('selectedCompanyId') || ''
  );

  useEffect(() => {
    if (!user) return;
    api.get('/api/minhas-empresas/')
      .then(res => setCompanies(res.data))
      .catch(err => { console.error('Erro ao buscar empresas:', err); setCompanies([]); });
  }, [user]);

  useEffect(() => {
    if (companies.length === 1 && !selectedCompanyId) {
      const only = companies[0].id.toString();
      setSelectedCompanyId(only);
      localStorage.setItem('selectedCompanyId', only);
    }
  }, [companies, selectedCompanyId]);

  useEffect(() => {
    if (
      selectedCompanyId &&
      companies.length > 0 &&
      !companies.find(c => c.id.toString() === selectedCompanyId)
    ) {
      setSelectedCompanyId('');
      localStorage.removeItem('selectedCompanyId');
    }
  }, [companies, selectedCompanyId]);

  const switchCompany = companyId => {
    setSelectedCompanyId(companyId);
    localStorage.setItem('selectedCompanyId', companyId);
    window.location.reload();
  };

  return (
    <CompanyContext.Provider value={{ companies, selectedCompanyId, switchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export const useCompany = () => useContext(CompanyContext);

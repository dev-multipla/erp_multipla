<<<<<<< HEAD
// src/AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    userName: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [userName, setUserName] = useState(null);

    const login = (token, userName) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setToken(token);
        setUserName(userName);
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await axios.post('http://127.0.0.1:8000/api/logout/', { refresh_token: refreshToken });
            }
        } catch (error) {
            console.error('Erro ao fazer logout no backend:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            setIsLoggedIn(false);
            setToken(null);
            setUserName(null);
            window.location.href = '/';
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};
=======
// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from './api';

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  userName: null,
  user: null,
  login: () => {},
  logout: () => {},
  refreshUserData: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para fazer logout limpo
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/api/logout/', { refresh_token: refreshToken });
      }
    } catch (err) {
      console.error('Erro ao invalidar token no backend:', err);
    } finally {
      // Limpa todos os dados
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userName');
      localStorage.removeItem('selectedCompanyId');
      
      setIsLoggedIn(false);
      setToken(null);
      setUserName(null);
      setUser(null);
      
      // Redireciona para login
      window.location.href = '/';
    }
  }, []);

  // Função para buscar dados do usuário
  const fetchUserData = useCallback(async (currentToken) => {
    if (!currentToken) {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.get('/api/me/');
      const userData = res.data || {};
      
      setUser(userData);
      setIsLoggedIn(true);
      setUserName(userData.username || '');
      
      // Pré-seleciona empresa padrão, se existir
      const defaultId = userData.empresa_padrao?.id?.toString();
      if (defaultId && !localStorage.getItem('selectedCompanyId')) {
        localStorage.setItem('selectedCompanyId', defaultId);
      }
      
      console.log('✅ Dados do usuário carregados com sucesso');
    } catch (err) {
      console.error('❌ Falha ao buscar usuário (/api/me/):', err);
      
      // Se o erro for 401, o interceptor já cuidará do refresh
      if (err.response?.status !== 401) {
        // Para outros erros, limpa dados locais
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('selectedCompanyId');
        setToken(null);
        setIsLoggedIn(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para fazer login
  const login = useCallback((newToken, newUserName, refreshToken = null) => {
    console.log('🔐 Fazendo login...');
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', newUserName);
    
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    
    setToken(newToken);
    setUserName(newUserName);
    setIsLoggedIn(true);
    
    // Busca dados do usuário
    fetchUserData(newToken);
  }, [fetchUserData]);

  // Função para atualizar dados do usuário
  const refreshUserData = useCallback(() => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      fetchUserData(currentToken);
    }
  }, [fetchUserData]);

  // Effect para carregar dados iniciais
  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      fetchUserData(currentToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchUserData]);

  // Effect para escutar logout forçado do interceptor
  useEffect(() => {
    const handleForceLogout = () => {
      console.log('🚪 Logout forçado pelo interceptor');
      logout();
    };

    window.addEventListener('forceLogout', handleForceLogout);
    
    return () => {
      window.removeEventListener('forceLogout', handleForceLogout);
    };
  }, [logout]);

  // Effect para verificar token periodicamente
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkTokenValidity = async () => {
      try {
        await api.get('/api/me/');
      } catch (err) {
        if (err.response?.status === 401) {
          console.log('🔄 Token expirado, tentando refresh...');
          // O interceptor cuidará do refresh automático
        }
      }
    };

    // Verifica a cada 5 minutos
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const value = {
    isLoggedIn,
    token,
    userName,
    user,
    isLoading,
    login,
    logout,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
>>>>>>> e62255e (Atualizações no projeto)

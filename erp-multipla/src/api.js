// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://financeiro.multipla.tec.br',
});

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor de REQUEST
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const companyId = localStorage.getItem('selectedCompanyId');
  
  console.log('>>> HEADERS INJETADOS:', { token: token ? 'Present' : 'Missing', companyId });

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (companyId) {
    config.headers['X-Company-Id'] = companyId;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor de RESPONSE - Crucial para gerenciar tokens expirados
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa de refresh já em andamento
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já estiver refreshing, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        // Não há refresh token, força logout
        processQueue(error, null);
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${api.defaults.baseURL}/api/token/refresh/`, {
          refresh: refreshToken
        });

        const { access, refresh } = response.data;
        
        // Atualiza os tokens
        localStorage.setItem('token', access);
        if (refresh) {
          localStorage.setItem('refresh_token', refresh);
        }

        // Atualiza header da requisição original
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        
        processQueue(null, access);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Função para fazer logout limpo
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('userName');
  localStorage.removeItem('selectedCompanyId');
  
  // Dispatch evento customizado para notificar o AuthContext
  window.dispatchEvent(new CustomEvent('forceLogout'));
};

export default api;
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            // Redirecionar para a página de login
            window.location.href = '/login?message=Sua sessão expirou. Por favor, faça login novamente.';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

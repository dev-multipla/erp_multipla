import axios from 'axios';

const axiosInstance = axios.create({
<<<<<<< HEAD
    baseURL: 'http://127.0.0.1:8000/api',
=======
    baseURL: 'https://financeiro.multipla.tec.br/api',
>>>>>>> e62255e (Atualizações no projeto)
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            // Redirecionar para a página de login
<<<<<<< HEAD
            window.location.href = '/login?message=Sua sessão expirou. Por favor, faça login novamente.';
=======
            window.location.href = '/';
>>>>>>> e62255e (Atualizações no projeto)
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

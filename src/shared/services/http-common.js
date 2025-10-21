import axios from "axios";
import store from "../../store/index.js";
import router from "../../router/index.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para añadir el token de autenticación
http.interceptors.request.use(
    (config) => {
        const token = store.getters["user/userToken"];

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta para manejo global de errores
http.interceptors.response.use(
    (response) => response,
    (error) => {
        // Error de red (sin respuesta del servidor)
        if (!error.response) {
            console.error('Network error:', error);
            const networkError = new Error('Error de red. Verifica tu conexión a internet.');
            networkError.isNetworkError = true;
            return Promise.reject(networkError);
        }

        const { status, data } = error.response;
        let errorMessage = data?.message || 'Error desconocido';

        switch (status) {
            case 400:
                console.error('Bad Request (400):', data);
                errorMessage = data?.message || 'Datos inválidos. Verifica la información enviada.';
                break;

            case 401:
                console.error('Unauthorized (401):', data);
                errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';

                // Limpiar sesión y redirigir al login
                store.dispatch('user/signOut');

                // Solo redirigir si no estamos ya en login
                if (router.currentRoute.value.name !== 'login') {
                    router.push('/login');
                }
                break;

            case 403:
                console.error('Forbidden (403):', data);
                errorMessage = 'No tienes permisos para realizar esta acción.';
                break;

            case 404:
                console.error('Not Found (404):', data);
                errorMessage = data?.message || 'Recurso no encontrado.';
                break;

            case 409:
                console.error('Conflict (409):', data);
                errorMessage = data?.message || 'Conflicto: El recurso ya existe.';
                break;

            case 500:
                console.error('Server Error (500):', data);
                errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
                break;

            default:
                console.error(`HTTP Error (${status}):`, data);
                errorMessage = data?.message || `Error ${status}: ${error.message}`;
        }

        // Agregar mensaje de error user-friendly al objeto error
        error.userMessage = errorMessage;

        return Promise.reject(error);
    }
);

export default http;

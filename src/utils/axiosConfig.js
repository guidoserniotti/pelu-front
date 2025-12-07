import axios from "axios";
import authService from "./config";

// Configurar interceptor de solicitudes para agregar el token automáticamente
axios.interceptors.request.use(
    (config) => {
        const headers = authService.getAuthHeader();
        if (headers.Authorization) {
            config.headers.Authorization = headers.Authorization;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Configurar interceptor de respuestas para manejar errores de autenticación
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si recibimos un 401 (No autorizado), el token probablemente expiró
        if (error.response?.status === 401) {
            console.warn("Error 401: Token no válido o expirado");

            // Limpiar sesión (reutilizando la lógica centralizada)
            window.localStorage.removeItem("loggedUser");

            // Redirigir al login solo si no estamos ya en login
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axios;

import axios from "axios";
import authService from "./config";

// Crear una instancia única de axios con la URL base
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_URL_BACK || "http://localhost:3000",
});

// Configurar interceptor de solicitudes para agregar el token automáticamente
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
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

export default axiosInstance;

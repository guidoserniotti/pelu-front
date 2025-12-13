import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import authService from "../utils/config";
import { AuthContext } from "./AuthContext";
import { showInstantMessage } from "../utils/toastify/toastConfig";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Limpia la sesión del usuario
    const clearSession = () => {
        setUser(null);
        setToken(null);
        window.localStorage.removeItem("loggedUser");
    };

    // Maneja el logout del usuario
    const logout = (isExpired = false) => {
        clearSession();
        navigate("/login", { replace: true });

        // Mostrar el toast después de navegar
        setTimeout(() => {
            showInstantMessage(
                isExpired ? "SESION_EXPIRADA" : "SESION_CERRADA"
            );
        }, 100);
    };

    // Verificar el token y hacer logout si expiró
    const checkTokenExpiration = () => {
        const storedToken = window.localStorage.getItem("loggedUser");
        if (storedToken && token) {
            try {
                const userData = JSON.parse(storedToken);
                if (authService.isTokenExpired(userData.token)) {
                    console.warn(
                        "Token expirado detectado. Cerrando sesión..."
                    );
                    logout(true);
                    return true;
                }
            } catch (error) {
                console.error("Error al verificar token:", error);
                logout(true);
                return true;
            }
        }
        return false;
    };

    // Decodifica el token JWT para obtener información del usuario
    const decodeToken = (storedToken) => {
        const userData = JSON.parse(storedToken);

        // Verificar si el token ha expirado usando la función centralizada
        if (authService.isTokenExpired(userData.token)) {
            throw new Error("Token expirado");
        }

        // Decodificar el payload del JWT para obtener el id y rol
        const jwtPayload = jwtDecode(userData.token);

        return {
            id: jwtPayload.id,
            email: userData.email,
            rol: jwtPayload.rol,
            token: userData.token,
        };
    };

    // Restaurar sesión desde localStorage
    useEffect(() => {
        const storedToken = window.localStorage.getItem("loggedUser");
        if (storedToken) {
            try {
                const userData = decodeToken(storedToken);
                setToken(userData.token);
                setUser(userData);
            } catch (error) {
                console.error("Token almacenado inválido o expirado:", error);
                // Si el token expiró, limpiar pero no mostrar toast (aún está cargando)
                clearSession();
            }
        }
        setLoading(false);
    }, []);

    // Verificar el token periódicamente (cada 1 minuto)
    useEffect(() => {
        if (!token) return;

        // Verificar inmediatamente al montar
        checkTokenExpiration();

        // Configurar intervalo para verificar cada minuto
        const interval = setInterval(() => {
            checkTokenExpiration();
        }, 60000); // 60000ms = 1 minuto

        return () => clearInterval(interval);
    }, [token]);

    // Maneja el login del usuario
    const login = (tokenData) => {
        const userData = decodeToken(tokenData);
        setToken(userData.token);
        setUser(userData);
        window.localStorage.setItem("loggedUser", tokenData);
        navigate("/clients");
    };

    // Chequea si el usuario está autenticado
    const isAuthenticated = () => {
        return !!token;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

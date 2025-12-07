import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import authService from "../utils/config";

/**
 * Hook personalizado para validar el token automáticamente
 * Se puede usar en cualquier componente que necesite asegurar que el token sea válido
 */
export const useTokenValidation = () => {
    const { logout } = useAuth();

    useEffect(() => {
        const validateToken = () => {
            // getUserId ya verifica expiración y limpia localStorage si expiró
            const userId = authService.getUserId();

            if (!userId && window.localStorage.getItem("loggedUser")) {
                console.warn("Token expirado detectado en componente");
                logout(true);
            }
        };

        // Validar inmediatamente
        validateToken();

        // Validar cada minuto
        const interval = setInterval(validateToken, 60000);

        return () => clearInterval(interval);
    }, [logout]);
};

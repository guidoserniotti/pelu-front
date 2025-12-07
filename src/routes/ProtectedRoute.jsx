import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const { user, loading, logout } = useAuth();

    // Verificar si el token ha expirado al acceder a una ruta protegida
    useEffect(() => {
        if (user) {
            const userId = window.localStorage.getItem("loggedUser");
            // getUserId ya verifica expiración internamente
            if (userId && !window.localStorage.getItem("loggedUser")) {
                console.warn("Token expirado al acceder a ruta protegida");
                logout(true);
            }
        }
    }, [user, logout]);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const { user, loading, logout } = useAuth();

    useEffect(() => {
        if (user) {
            const userId = window.localStorage.getItem("loggedUser");
            if (userId && !window.localStorage.getItem("loggedUser")) {
                console.warn("Token expirado al acceder a ruta protegida");
                logout(true);
            }
        }
    }, [user, logout]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-3 border-t-accent" />
                    <span className="text-sm text-text-muted">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

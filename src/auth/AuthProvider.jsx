import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [toastPayload, setToastPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Restaurar sesión desde localStorage
    useEffect(() => {
        const storedToken = window.localStorage.getItem("loggedUser");
        if (storedToken) {
            try {
                const userData = decodeToken(storedToken);
                setToken(userData.token);
                setUser(userData);
            } catch (error) {
                console.error("Token almacenado inválido:", error);
                window.localStorage.removeItem("loggedUser");
            }
        }
        setLoading(false);
    }, []);
    // Decodifica el token JWT para obtener información del usuario
    const decodeToken = (token) => {
        try {
            const userData = JSON.parse(token);
            return {
                id: userData.id,
                email: userData.email,
                role: userData.role,
                token: userData.token,
            };
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            throw new Error("Token inválido");
        }
    };
    // Maneja el login del usuario
    const login = (tokenData) => {
        const userData = decodeToken(tokenData);
        setToken(userData.token);
        setUser(userData);
        window.localStorage.setItem("loggedUser", tokenData);
        navigate("/clients");
    };

    // Maneja el logout del usuario
    const logout = () => {
        setUser(null);
        setToken(null);
        // Guardamos el payload en el context para que la pantalla de login lo lea
        const payload = {
            icon: "success",
            title: "Sesión cerrada correctamente",
        };
        setToastPayload(payload);
        navigate("/login", { replace: true });
        window.localStorage.removeItem("loggedUser");
    };

    const clearToast = () => setToastPayload(null);

    // Chequea si el usuario está autenticado
    const isAuthenticated = () => {
        return !!token;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                toastPayload,
                clearToast,
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

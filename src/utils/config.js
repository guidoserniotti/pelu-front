import { jwtDecode } from "jwt-decode";

// Obtiene y parsea el token del localStorage de forma segura
const getStoredTokenData = () => {
    try {
        const loggedUserJSON = window.localStorage.getItem("loggedUser");
        if (loggedUserJSON) {
            return JSON.parse(loggedUserJSON);
        }
    } catch (error) {
        console.error("Error al parsear token del localStorage:", error);
    }
    return null;
};

// Verifica si el token ha expirado
const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        if (!decoded.exp) return false;

        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Error al verificar expiración del token:", error);
        return true;
    }
};

// Función helper para obtener el token del localStorage
const getAuthHeader = () => {
    const userData = getStoredTokenData();

    if (userData?.token) {
        // Verificar si el token ha expirado
        if (isTokenExpired(userData.token)) {
            console.warn("Token expirado detectado en getAuthHeader");
            // NO eliminamos aquí, dejar que el interceptor 401 lo maneje
            return {};
        }

        return {
            Authorization: `Bearer ${userData.token}`,
        };
    }
    return {};
};

// Función para obtener el id del usuario logueado
const getUserId = () => {
    const userData = getStoredTokenData();

    if (userData?.token) {
        // Verificar si el token ha expirado
        if (isTokenExpired(userData.token)) {
            console.warn("Token expirado detectado en getUserId");
            // NO eliminamos aquí, dejar que AuthProvider lo maneje
            return null;
        }

        const payload = jwtDecode(userData.token);
        return payload?.id || null;
    }
    return null;
};

// Función para obtener el payload completo del token
const getTokenPayload = () => {
    const userData = getStoredTokenData();

    if (userData?.token) {
        // Verificar si el token ha expirado
        if (isTokenExpired(userData.token)) {
            console.warn("Token expirado detectado en getTokenPayload");
            // NO eliminamos aquí, dejar que AuthProvider lo maneje
            return null;
        }

        return jwtDecode(userData.token);
    }
    return null;
};

export default {
    getAuthHeader,
    getUserId,
    getTokenPayload,
    isTokenExpired,
};

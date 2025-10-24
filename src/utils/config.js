let token = null;
const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};
// Función helper para obtener el token del localStorage
const getAuthHeader = () => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
        return {
            Authorization: token,
        };
    }
    return {};
};

export default {
    setToken,
    getAuthHeader,
};

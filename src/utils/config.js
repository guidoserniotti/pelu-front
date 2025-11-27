// Función helper para obtener el token del localStorage
const getAuthHeader = () => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
        const userData = JSON.parse(loggedUserJSON);
        return {
            Authorization: `Bearer ${userData.token}`,
        };
    }
    return {};
};

export default {
    getAuthHeader,
};

import axios from "../utils/axiosConfig";

const baseUrl = "/api/recordatorio/mensaje";

const getMessage = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const updateMessage = async (mensaje) => {
    const response = await axios.put(baseUrl, { mensaje });
    return response.data;
};

const getAntelacion = async () => {
    const response = await axios.get("/api/recordatorio/antelacion");
    return response.data;
};

const updateAntelacion = async (antelacion) => {
    const response = await axios.put("/api/recordatorio/antelacion", {
        horas_antelacion: antelacion,
    });
    return response.data;
};

export default {
    getMessage,
    updateMessage,
    getAntelacion,
    updateAntelacion,
};

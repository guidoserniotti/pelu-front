import axios from "../utils/axiosConfig";

const baseUrl = "/api/cliente";

const getClients = async () => {
    const response = await axios.get(`${baseUrl}?pagina=1&limite=100`);
    return response.data;
};

const createClient = async (clientData) => {
    const response = await axios.post(`${baseUrl}/registrar`, clientData);
    return response.data;
};

const updateClient = async (clientId, clientData) => {
    console.log(clientId);
    console.log("Datos del cliente a actualizar:", clientData);
    const response = await axios.patch(
        `${baseUrl}/editar/${clientId}`,
        clientData
    );
    console.log("Respuesta de updateClient:", response.data);
    return response.data;
};

const deleteClient = async (clientId) => {
    const response = await axios.delete(`${baseUrl}/eliminar/${clientId}`);
    return response.data;
};

export default {
    getClients,
    createClient,
    updateClient,
    deleteClient,
};

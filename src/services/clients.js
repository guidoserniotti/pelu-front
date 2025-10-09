import axios from "axios";
const baseUrl = "/api/clients";

const getClients = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const createClient = async (clientData) => {
    const response = await axios.post(baseUrl, clientData);
    return response.data;
};

const updateClient = async (clientId, clientData) => {
    const response = await axios.put(`${baseUrl}/${clientId}`, clientData);
    return response.data;
};

const deleteClient = async (clientId) => {
    const response = await axios.delete(`${baseUrl}/${clientId}`);
    return response.data;
};

export default {
    getClients,
    createClient,
    updateClient,
    deleteClient,
};

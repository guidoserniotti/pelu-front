import { useEffect, useState } from "react";
import clientsService from "../services/clients";
import ButtonClientsList from "./ButtonClientsList";
import ClientList from "./ClientList";
import GenericClientForm from "./GenericClientForm";

const Clients = ({ handleLogOut }) => {
    // Estado para controlar qué formulario está abierto: null, "add" o "edit"
    const [activeForm, setActiveForm] = useState(null);

    // Estado para manejar la lista de clientes
    const [client, setClient] = useState([]);

    const [clientName, setClientName] = useState("");
    const [clientPhoneNumber, setClientPhoneNumber] = useState("");
    const [clientToEdit, setClientToEdit] = useState(null);
    const [filter, setFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsData = await clientsService.getClients();
                const formattedClients = clientsData.listado_clientes.map(
                    (client) => {
                        return {
                            id: client.id,
                            title: client.nombre_completo,
                            phoneNumber: client.telefono,
                            editable: true,
                            esta_eliminado: client.esta_eliminado,
                        };
                    }
                );
                setClient(formattedClients);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };
        fetchClients();
    }, []); // ← Solo se ejecuta al montar el componente

    const handleAddClient = (e) => {
        e.preventDefault();
        const newClient = {
            title: clientName,
            phoneNumber: clientPhoneNumber,
        };
        clientsService.createClient(newClient);
        setClient([...client, newClient]);
        setClientName("");
        setClientPhoneNumber("");
        setActiveForm(null); // Cerrar el formulario después de agregar
    };

    const handleEditClientForm = (clientData) => {
        // Si el formulario de editar ya está abierto con el mismo cliente, lo cierra
        if (
            activeForm === "edit" &&
            clientToEdit?.phoneNumber === clientData.phoneNumber
        ) {
            setActiveForm(null);
            setClientName("");
            setClientPhoneNumber("");
            setClientToEdit(null);
        } else {
            // Abre o alterna al formulario de editar
            setActiveForm("edit");
            setClientName(clientData.title);
            setClientPhoneNumber(clientData.phoneNumber);
            setClientToEdit(clientData);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            const updatedClient = await clientsService.updateClient(
                clientToEdit.id,
                {
                    nombre_completo: clientName,
                    telefono: clientPhoneNumber,
                }
            );

            // Actualizar el estado usando el ID
            const updatedClients = client.map((c) =>
                c.id === clientToEdit.id
                    ? {
                          ...c,
                          title: updatedClient.data.nombre_completo,
                          phoneNumber: updatedClient.data.telefono,
                      }
                    : c
            );

            setClient(updatedClients);
            setClientName("");
            setClientPhoneNumber("");
            setClientToEdit(null);
            setActiveForm(null);
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeleteClient = async (clientData) => {
        const confirmDelete = window.confirm(
            `¿Estás seguro de que deseas eliminar al cliente ${clientData.title}?`
        );
        if (!confirmDelete) return;
        const response = await clientsService.deleteClient(clientData.id);
        console.log(response);

        const updatedClients = client.filter((c) => c.id !== clientData.id);
        setClient(updatedClients);
    };

    const toggleAddForm = () => {
        if (activeForm === "add") {
            // Si ya está abierto, lo cierra
            setActiveForm(null);
            setClientName("");
            setClientPhoneNumber("");
        } else {
            // Abre el formulario de agregar (y cierra el de editar si estaba abierto)
            setActiveForm("add");
            setClientName("");
            setClientPhoneNumber("");
            setClientToEdit(null);
        }
    };

    // Filtrar clientes según el término de búsqueda
    const filteredClients = client
        .filter(
            (c) =>
                c.title.toLowerCase().includes(filter.toLowerCase()) &&
                c.esta_eliminado === false
        )
        .slice() // crear copia antes de ordenar
        .sort((a, b) => {
            // Ordenamiento sensible a acentos y mayúsculas
            const cmp = a.title.localeCompare(b.title, "es", {
                sensitivity: "base",
                ignorePunctuation: true,
            });
            return sortOrder === "asc" ? cmp : -cmp;
        });

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };
    const handleSearch = (e) => {
        setFilter(e.target.value);
    };

    return (
        <div className="client-container">
            <ButtonClientsList
                text={"Agregar Cliente"}
                imgSource={"../../assets/img/addClient.png"}
                functionOnClick={toggleAddForm}
            />
            <ButtonClientsList
                text={"LogOut"}
                imgSource={"../../assets/img/logout.png"}
                functionOnClick={handleLogOut}
            />
            {activeForm === "add" && (
                <div className="client-overlay">
                    <GenericClientForm
                        handleSubmitClient={handleAddClient}
                        clientName={clientName}
                        clientPhoneNumber={clientPhoneNumber}
                        setClientName={setClientName}
                        setClientPhoneNumber={setClientPhoneNumber}
                        formTitle="Agregar Cliente"
                    />
                </div>
            )}
            {activeForm === "edit" && (
                <div className="client-overlay">
                    <GenericClientForm
                        handleSubmitClient={handleSubmitEdit}
                        clientName={clientName}
                        clientPhoneNumber={clientPhoneNumber}
                        setClientName={setClientName}
                        setClientPhoneNumber={setClientPhoneNumber}
                        formTitle="Editar Cliente"
                    />
                </div>
            )}
            <h2>Clientes</h2>
            <div className="client-search">
                <input
                    type="text"
                    value={filter}
                    placeholder="Buscar cliente..."
                    onChange={handleSearch}
                />
                <button
                    type="button"
                    onClick={toggleSortOrder}
                    style={{ marginLeft: "8px" }}
                >
                    {sortOrder === "asc" ? "A → Z" : "Z → A"}
                </button>
            </div>
            <ClientList
                client={filteredClients}
                handleEditClientForm={handleEditClientForm}
                handleDeleteClient={handleDeleteClient}
            />
        </div>
    );
};

export default Clients;

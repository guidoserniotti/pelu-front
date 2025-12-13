import { useEffect, useState } from "react";
import "../styles/clients.css";
import clientsService from "../services/clients";
import ButtonClientsList from "../components/ButtonClientsList";
import ClientList from "../components/ClientList";
import Calendar from "../components/FullCalendar";
import DeleteZone from "../components/DeleteZone";
import { createDynamicMessage } from "../utils/toastify/toastMessages";
import { promiseToast, showToast } from "../utils/toastify/toastConfig";
import { useAuth } from "../auth/AuthContext";
// Reemplazamos formularios flotantes por SweetAlert2 temado
import {
    promptAddClient,
    promptEditClient,
} from "../utils/NotificationWindows/ClientFormPrompt";
import windowDelete from "../utils/NotificationWindows/ConfirmDelete";
import windowLogOut from "../utils/NotificationWindows/ConfirmLogOut";
import addClientImg from "../../assets/img/addClient.png";
import logoutImg from "../../assets/img/logout.png";
const Clients = () => {
    const { logout, user } = useAuth();
    // Estado para manejar la lista de clientes
    const [client, setClient] = useState([]);
    const [filter, setFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
    const [isDraggingEvent, setIsDraggingEvent] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [dataLoaded, setDataLoaded] = useState({
        clients: false,
        shifts: false,
    });

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoadingData(true);
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
                setIsLoadingData(false);
                setDataLoaded((prev) => ({ ...prev, clients: true }));
            } catch (error) {
                console.error("Error fetching clients:", error);
                setIsLoadingData(false);
            }
        };
        fetchClients();
    }, []); // ← Solo se ejecuta al montar el componente

    // useEffect para mostrar bienvenida cuando todos los datos estén cargados
    useEffect(() => {
        if (dataLoaded.clients && dataLoaded.shifts) {
            const timer = setTimeout(() => {
                showToast(
                    "success",
                    `¡Bienvenido usuario! Datos cargados correctamente`,
                    {
                        autoClose: 3000,
                        toastId: "welcome-message",
                    }
                );
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [dataLoaded, user]);

    const handleAddClient = async () => {
        const values = await promptAddClient();
        if (!values) return; // cancelado
        try {
            const created = await promiseToast(
                clientsService.createClient(values),
                createDynamicMessage.clientAdd(values.nombre_completo)
            );
            setClient((prev) => [
                ...prev,
                {
                    id: created.data.id,
                    title: created.data.nombre_completo,
                    phoneNumber: created.data.telefono,
                    editable: true,
                    esta_eliminado: created.data.esta_eliminado,
                },
            ]);
        } catch (error) {
            console.error("Error al crear cliente:", error);
        }
    };

    const handleEditClientForm = async (clientData) => {
        const values = await promptEditClient(clientData);
        if (!values) return; // cancelado o sin cambios
        try {
            const updated = await promiseToast(
                clientsService.updateClient(clientData.id, values),
                createDynamicMessage.clientEdit(clientData.title)
            );
            const updatedClients = client.map((c) =>
                c.id === clientData.id
                    ? {
                          ...c,
                          title: updated.data.nombre_completo,
                          phoneNumber: updated.data.telefono,
                      }
                    : c
            );
            setClient(updatedClients);
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
        }
    };

    // Eliminado: handleSubmitEdit ya no es necesario con SweetAlert

    const handleDeleteClient = async (clientData) => {
        const confirmDelete = await windowDelete(clientData.title);
        if (!confirmDelete) return;

        try {
            await promiseToast(
                clientsService.deleteClient(clientData.id),
                createDynamicMessage.clientDeleted(clientData.title)
            );
            const updatedClients = client.filter((c) => c.id !== clientData.id);
            setClient(updatedClients);
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
        }
    };

    const handleLogOut = async () => {
        const confirmLogout = await windowLogOut({
            title: "¿Estás seguro de que deseas cerrar sesión?",
        });
        if (!confirmLogout) return;
        // AuthProvider.logout already navigates to /login and passes the toast state
        logout();
    };

    const toggleAddForm = () => {
        // Ahora abre el prompt de creación
        handleAddClient();
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
        <div className="main-calendar-container">
            <div className="client-container">
                {isDraggingEvent ? (
                    <DeleteZone isVisible={isDraggingEvent} />
                ) : (
                    <>
                        <div className="client-header">
                            <div className="client-header-actions">
                                <ButtonClientsList
                                    text={"Agregar Cliente"}
                                    imgSource={addClientImg}
                                    functionOnClick={toggleAddForm}
                                    className="btn-add"
                                />
                                <ButtonClientsList
                                    text={"LogOut"}
                                    imgSource={logoutImg}
                                    functionOnClick={handleLogOut}
                                    className="btn-logout"
                                />
                            </div>
                            <h2>Clientes</h2>
                            <div className="client-search">
                                <input
                                    type="text"
                                    value={filter}
                                    placeholder="Buscar cliente..."
                                    onChange={handleSearch}
                                />
                                <button type="button" onClick={toggleSortOrder}>
                                    {sortOrder === "asc" ? "↑" : "↓"}
                                </button>
                            </div>
                            <ClientList
                                client={filteredClients}
                                handleEditClientForm={handleEditClientForm}
                                handleDeleteClient={handleDeleteClient}
                            />
                        </div>
                    </>
                )}
            </div>
            <div>
                <Calendar
                    clientList={client}
                    setIsDraggingEvent={setIsDraggingEvent}
                    onShiftsLoaded={() =>
                        setDataLoaded((prev) => ({ ...prev, shifts: true }))
                    }
                />
            </div>
        </div>
    );
};

export default Clients;

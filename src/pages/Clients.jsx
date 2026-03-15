import { useEffect, useState } from "react";
import clientsService from "../services/clients";
import ButtonClientsList from "../components/ButtonClientsList";
import ClientList from "../components/ClientList";
import Calendar from "../components/FullCalendar";
import DeleteZone from "../components/DeleteZone";
import { createDynamicMessage } from "../utils/toastify/toastMessages";
import { promiseToast, showToast } from "../utils/toastify/toastConfig";
import { useAuth } from "../auth/AuthContext";
import {
    promptAddClient,
    promptEditClient,
} from "../utils/NotificationWindows/ClientFormPrompt";
import { promptEditReminderMessage } from "../utils/NotificationWindows/ReminderMessagePrompt";
import { promptEditAntelacion } from "../utils/NotificationWindows/ReminderAntelacionPrompt";
import windowDelete from "../utils/NotificationWindows/ConfirmDelete";
import windowLogOut from "../utils/NotificationWindows/ConfirmLogOut";
import remindersService from "../services/reminders";
import addClientImg from "../../assets/img/addClient.png";
import logoutImg from "../../assets/img/logout.png";

const LoadingSkeleton = () => (
    <div className="flex animate-pulse flex-col gap-3 py-2">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-1">
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-surface-3" />
                    <div className="h-3 w-1/2 rounded bg-surface-3" />
                </div>
                <div className="flex gap-1">
                    <div className="h-8 w-8 rounded-full bg-surface-3" />
                    <div className="h-8 w-8 rounded-full bg-surface-3" />
                </div>
            </div>
        ))}
    </div>
);

const Clients = () => {
    const { logout, user } = useAuth();
    const [client, setClient] = useState([]);
    const [filter, setFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
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
                    (c) => ({
                        id: c.id,
                        title: c.nombre_completo,
                        phoneNumber: c.telefono,
                        editable: true,
                        esta_eliminado: c.esta_eliminado,
                    })
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
    }, []);

    useEffect(() => {
        if (dataLoaded.clients && dataLoaded.shifts) {
            const timer = setTimeout(() => {
                const userName = user?.email?.split("@")[0] || "usuario";
                showToast(
                    "success",
                    `Bienvenido, ${userName}! Datos cargados correctamente`,
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
        if (!values) return;
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
        if (!values) return;
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

    const handleReminderMessage = async () => {
        try {
            const response = await remindersService.getMessage();
            const currentMessage = response.data?.mensaje ?? response.mensaje ?? "";
            const newMessage = await promptEditReminderMessage(currentMessage);
            if (!newMessage) return;
            await promiseToast(
                remindersService.updateMessage(newMessage),
                {
                    pending: "Actualizando mensaje de recordatorio...",
                    success: "Mensaje de recordatorio actualizado",
                    error: "Error al actualizar el mensaje",
                }
            );
        } catch (error) {
            console.error("Error con mensaje de recordatorio:", error);
            showToast("error", "Error al obtener el mensaje de recordatorio");
        }
    };

    const handleReminderAntelacion = async () => {
        try {
            const response = await remindersService.getAntelacion();
            const currentHours = response.data?.horas_antelacion ?? response.horas_antelacion ?? 1;
            const newHours = await promptEditAntelacion(currentHours);
            if (!newHours) return;
            await promiseToast(
                remindersService.updateAntelacion(newHours),
                {
                    pending: "Actualizando antelación...",
                    success: "Antelación actualizada",
                    error: "Error al actualizar la antelación",
                }
            );
        } catch (error) {
            console.error("Error con antelación de recordatorio:", error);
            showToast("error", "Error al obtener la antelación");
        }
    };

    const handleLogOut = async () => {
        const confirmLogout = await windowLogOut({
            title: "¿Estas seguro de que deseas cerrar sesion?",
        });
        if (!confirmLogout) return;
        logout();
    };

    const activeClients = client.filter((c) => c.esta_eliminado === false);

    const filteredClients = activeClients
        .filter((c) =>
            c.title.toLowerCase().includes(filter.toLowerCase())
        )
        .slice()
        .sort((a, b) => {
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
        <div className="grid h-screen grid-cols-[300px_1fr] gap-4 p-3 max-xl:grid-cols-[260px_1fr] max-xl:gap-3 max-xl:p-2.5 max-lg:grid-cols-[220px_1fr] max-lg:gap-2.5 max-lg:p-2 max-md:grid-cols-[200px_1fr] max-md:gap-2 max-md:p-1.5 max-sm:grid-cols-[160px_1fr] max-sm:gap-1.5 max-sm:p-1">
            {/* Panel lateral de clientes */}
            <div className="relative flex min-h-0 flex-col rounded-lg border border-border-dark bg-surface-2 p-3 text-text-inverse shadow-strong max-md:p-2 max-sm:p-1.5">
                {isDraggingEvent ? (
                    <DeleteZone isVisible={isDraggingEvent} />
                ) : (
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                        {/* Header: Add + Logout */}
                        <div className="sticky top-0 z-2 flex items-center justify-between gap-2 border-b border-border-dark bg-surface-2 pb-2">
                            <div className="flex items-center gap-1">
                                <ButtonClientsList
                                    text={"Agregar Cliente"}
                                    imgSource={addClientImg}
                                    functionOnClick={handleAddClient}
                                    className="btn-add"
                                />
                                <button
                                    onClick={handleReminderMessage}
                                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent transition-all duration-200 hover:bg-accent/20 active:scale-95 max-lg:h-10 max-lg:w-10 max-md:h-9 max-md:w-9 max-sm:h-8 max-sm:w-8"
                                    aria-label="Mensaje de Recordatorio"
                                    title="Mensaje de Recordatorio"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6 text-text-inverse opacity-90 transition-opacity hover:opacity-100 max-md:h-5 max-md:w-5 max-sm:h-[18px] max-sm:w-[18px]"
                                    >
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleReminderAntelacion}
                                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent transition-all duration-200 hover:bg-accent/20 active:scale-95 max-lg:h-10 max-lg:w-10 max-md:h-9 max-md:w-9 max-sm:h-8 max-sm:w-8"
                                    aria-label="Antelación de Recordatorio"
                                    title="Antelación de Recordatorio"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6 text-text-inverse opacity-90 transition-opacity hover:opacity-100 max-md:h-5 max-md:w-5 max-sm:h-[18px] max-sm:w-[18px]"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12,6 12,12 16,14" />
                                    </svg>
                                </button>
                            </div>
                            <ButtonClientsList
                                text={"Cerrar Sesion"}
                                imgSource={logoutImg}
                                functionOnClick={handleLogOut}
                                className="btn-logout"
                            />
                        </div>

                        {/* Titulo + contador */}
                        <div className="my-2 flex items-center justify-center gap-2">
                            <h2 className="text-center font-title font-bold text-text-inverse max-lg:text-lg max-md:text-base max-sm:text-sm">
                                Clientes
                            </h2>
                            {!isLoadingData && (
                                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
                                    {activeClients.length}
                                </span>
                            )}
                        </div>

                        {/* Busqueda + Sort */}
                        <div className="mb-3 flex w-full min-w-0 gap-2 max-sm:mb-2 max-sm:gap-1">
                            <input
                                type="text"
                                value={filter}
                                placeholder="Buscar cliente..."
                                onChange={handleSearch}
                                className="min-w-0 flex-1 rounded-md border border-border-dark bg-surface-3 px-2.5 py-2 text-sm text-text-inverse placeholder-text-inverse/60 transition-colors focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/18 max-lg:px-2 max-lg:py-1.5 max-lg:text-[13px] max-md:text-xs max-sm:p-1 max-sm:text-[11px]"
                            />
                            <button
                                type="button"
                                onClick={toggleSortOrder}
                                className="flex min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-dark bg-surface-3 px-2 py-2 text-base text-text-inverse transition-colors hover:border-accent/30 hover:bg-accent/10 max-lg:min-w-8 max-lg:text-sm max-sm:min-w-6 max-sm:p-1 max-sm:text-[13px]"
                                title={sortOrder === "asc" ? "A-Z (ascendente)" : "Z-A (descendente)"}
                            >
                                {sortOrder === "asc" ? "↑" : "↓"}
                            </button>
                        </div>

                        {/* Lista de clientes o skeleton */}
                        {isLoadingData ? (
                            <LoadingSkeleton />
                        ) : (
                            <ClientList
                                client={filteredClients}
                                handleEditClientForm={handleEditClientForm}
                                handleDeleteClient={handleDeleteClient}
                                onAddClient={handleAddClient}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Calendario */}
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

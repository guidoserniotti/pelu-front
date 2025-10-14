import { useState } from "react";
import ButtonClientsList from "./ButtonClientsList";
import ClientList from "./ClientList";
import GenericClientForm from "./GenericClientForm";

function Clients({ client, setClient }) {
    // Estado para controlar qué formulario está abierto: null, "add" o "edit"
    const [activeForm, setActiveForm] = useState(null);

    const [clientName, setClientName] = useState("");
    const [clientPhoneNumber, setClientPhoneNumber] = useState("");
    const [clientToEdit, setClientToEdit] = useState(null);
    const [filter, setFilter] = useState("");

    const handleAddClient = (e) => {
        e.preventDefault();
        const newClient = {
            title: clientName,
            phoneNumber: clientPhoneNumber,
        };
        setClient([...client, newClient]);
        setClientName("");
        setClientPhoneNumber("");
        setActiveForm(null); // Cerrar el formulario después de agregar
    };

    const handleEditClient = (clientData) => {
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

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        const updatedClients = client.map((c) =>
            c.phoneNumber === clientToEdit.phoneNumber
                ? { ...c, title: clientName, phoneNumber: clientPhoneNumber }
                : c
        );
        setClient(updatedClients);
        setClientName("");
        setClientPhoneNumber("");
        setClientToEdit(null);
        setActiveForm(null); // Cerrar el formulario después de editar
    };

    const handleDeleteClient = (clientData) => {
        const confirmDelete = window.confirm(
            `¿Estás seguro de que deseas eliminar al cliente ${clientData.title}?`
        );
        if (!confirmDelete) return;
        const updatedClients = client.filter(
            (c) => c.phoneNumber !== clientData.phoneNumber
        );
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
                functionOnClick={() => console.log("Cerrar sesión")}
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
            <ClientList
                client={filteredClients}
                handleEditClient={handleEditClient}
                handleDeleteClient={handleDeleteClient}
            />
        </div>
    );
}

export default Clients;

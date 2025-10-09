import { useState } from "react";
import ButtonClientsList from "./ButtonClientsList";
import ClientList from "./ClientList";
import GenericClientForm from "./GenericClientForm";

function Clients({ client, setClient }) {
    const [viewClientForm, setViewClientForm] = useState(false);

    const [clientName, setClientName] = useState("");
    const [clientPhoneNumber, setClientPhoneNumber] = useState("");

    const handleAddClient = (e) => {
        /* TO-DO:
         1. Cerrar el formulario de editar cliente si está abierto.
         */
        e.preventDefault();
        const newClient = {
            title: clientName,
            phoneNumber: clientPhoneNumber,
        };
        setClient([...client, newClient]);
        setClientName("");
        setClientPhoneNumber("");
    };

    const handleEditClient = (e) => {
        /* TO-DO:
        0. Cerrar el formulario de agregar cliente si está abierto.
        1. Obtener el cliente a editar utilizando el ID o algún identificador único.
        2. Actualizar el estado del cliente con los nuevos valores.
        3. Cerrar el formulario de edición.
        */
    };

    return (
        <div className="client-container">
            <ButtonClientsList
                text={"Agregar Cliente"}
                imgSource={"../../assets/img/addClient.png"}
                functionOnClick={
                    viewClientForm
                        ? () => setViewClientForm(false)
                        : () => setViewClientForm(true)
                }
            />
            <ButtonClientsList
                text={"LogOut"}
                imgSource={"../../assets/img/logout.png"}
                functionOnClick={() => console.log("Cerrar sesión")}
            />
            {viewClientForm && (
                <div className="client-overlay">
                    <GenericClientForm
                        handleSubmitClient={handleAddClient}
                        clientName={clientName}
                        clientPhoneNumber={clientPhoneNumber}
                        setClientName={setClientName}
                        setClientPhoneNumber={setClientPhoneNumber}
                    />
                </div>
            )}
            <h2>Clientes</h2>
            <ClientList client={client} setClient={setClient} />
        </div>
    );
}

export default Clients;

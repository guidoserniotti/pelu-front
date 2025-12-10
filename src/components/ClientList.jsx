import { Draggable } from "@fullcalendar/interaction";
import { useEffect, useRef } from "react";
import ButtonClientsList from "./ButtonClientsList";
import editClientImg from "../../assets/img/editClient.png";
import deleteClientImg from "../../assets/img/deleteClient.png";

function ClientList({ client, handleEditClientForm, handleDeleteClient }) {
    const draggableInstanceRef = useRef(null);

    useEffect(() => {
        const draggableEl = document.querySelector("#client-list");

        if (draggableEl && !draggableInstanceRef.current) {
            draggableInstanceRef.current = new Draggable(draggableEl, {
                itemSelector: ".fc-draggable",
                eventData: (eventEl) => {
                    // Extraer el título y el ID del cliente desde el elemento
                    const title = eventEl.getAttribute("data-title");
                    const clientId = eventEl.getAttribute("data-client-id");
                    return {
                        title: title,
                        id: clientId,
                        duration: "00:30", // 30 minutos de duración
                        editable: true,
                    };
                },
            });
        }

        return () => {
            if (draggableInstanceRef.current) {
                draggableInstanceRef.current.destroy();
                draggableInstanceRef.current = null;
            }
        };
    }, [client]);

    if (!client || client.length === 0) {
        return <div className="client-list">No hay clientes disponibles</div>;
    }

    return (
        <div id="client-list">
            {client.map((c) => (
                <div className="client-item" key={c.phoneNumber}>
                    <div
                        className="client-info fc-draggable"
                        data-title={c.title}
                        data-client-id={c.id}
                    >
                        <h3 className="client-title">{c.title}</h3>
                        <p className="client-phone">{c.phoneNumber}</p>
                    </div>
                    <div className="client-item-actions">
                        <ButtonClientsList
                            text={"Editar Cliente"}
                            functionOnClick={() => handleEditClientForm(c)}
                            imgSource={editClientImg}
                            className="btn-edit"
                        />
                        <ButtonClientsList
                            text={"Eliminar Cliente"}
                            functionOnClick={() => handleDeleteClient(c)}
                            imgSource={deleteClientImg}
                            className="btn-delete"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ClientList;

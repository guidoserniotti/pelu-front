import { Draggable } from "@fullcalendar/interaction";
import { useEffect, useRef } from "react";
import ButtonClientsList from "./ButtonClientsList";

function ClientList({ client, setClient }) {
    const draggableInstanceRef = useRef(null);

    useEffect(() => {
        const draggableEl = document.querySelector("#client-list");

        if (draggableEl && !draggableInstanceRef.current) {
            draggableInstanceRef.current = new Draggable(draggableEl, {
                itemSelector: ".fc-draggable",
                eventData: (eventEl) => {
                    // Extraer el título del cliente desde el elemento
                    const title = eventEl.getAttribute("data-title");
                    return {
                        title: title,
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
                <>
                    <div
                        key={c.phoneNumber}
                        className="fc-draggable"
                        data-title={c.title}
                    >
                        <h3 className="client-title">{c.title}</h3>
                        <p className="client-phone">{c.phoneNumber}</p>
                    </div>
                    <div>
                        <ButtonClientsList
                            text={"Editar Cliente"}
                            functionOnClick={() => {}}
                            imgSource={"../../../../assets/img/editClient.png"}
                        />
                    </div>
                </>
            ))}
        </div>
    );
}

export default ClientList;

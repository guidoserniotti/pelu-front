import { Draggable } from "@fullcalendar/interaction";

import { useEffect, useRef } from "react";

function ClientList({ client, setClient }) {
    const draggableInstanceRef = useRef(null);

    useEffect(() => {
        const draggableEl = document.querySelector("#client-list");

        if (draggableEl && !draggableInstanceRef.current) {
            draggableInstanceRef.current = new Draggable(draggableEl, {
                itemSelector: ".fc-draggable",
                eventData: (eventEl) => {
                    return {
                        title: eventEl.innerText,
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
        // }, []);
    }, [client]);

    if (!client || client.length === 0) {
        return <div className="client-list">No hay clientes disponibles</div>;
    }
    return (
        <div id="client-list">
            {client.map((c, index) => (
                <div
                    key={c.title}
                    className="fc-draggable"
                    data-title={c.title}
                >
                    <h3 className="client-title">{c.title}</h3>
                </div>
            ))}
        </div>
    );
}

export default ClientList;

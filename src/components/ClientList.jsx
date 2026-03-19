import { Draggable } from "@fullcalendar/interaction";
import { useEffect, useRef } from "react";
import ButtonClientsList from "./ButtonClientsList";
import editClientImg from "../../assets/img/editClient.png";
import deleteClientImg from "../../assets/img/deleteClient.png";

function ClientList({ client, handleEditClientForm, handleDeleteClient, onAddClient }) {
    const draggableInstanceRef = useRef(null);

    useEffect(() => {
        const draggableEl = document.querySelector("#client-list");

        if (draggableEl && !draggableInstanceRef.current) {
            draggableInstanceRef.current = new Draggable(draggableEl, {
                itemSelector: ".fc-draggable",
                eventData: (eventEl) => {
                    const title = eventEl.getAttribute("data-title");
                    const clientId = eventEl.getAttribute("data-client-id");
                    return {
                        title: title,
                        id: clientId,
                        duration: "00:30",
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
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
                <div className="text-3xl opacity-40">👤</div>
                <p className="text-sm text-content-secondary">
                    No hay clientes disponibles
                </p>
                {onAddClient && (
                    <button
                        onClick={onAddClient}
                        className="mt-1 cursor-pointer rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
                    >
                        + Agregar cliente
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            id="client-list"
            className="flex-1 overflow-y-auto pr-1 scrollbar-none"
        >
            {client.map((c) => (
                <div
                    className="group flex items-center justify-between rounded-md border-b border-divider px-1 py-2.5 transition-colors last:border-b-0 hover:bg-white/[0.04]"
                    key={c.phoneNumber}
                >
                    <div
                        className="fc-draggable min-w-0 flex-1 cursor-grab active:cursor-grabbing"
                        data-title={c.title}
                        data-client-id={c.id}
                    >
                        <h3 className="m-0 mb-1 truncate text-[15px] font-semibold text-content-primary max-md:text-[13px] max-sm:text-xs">
                            {c.title}
                        </h3>
                        <p className="m-0 text-[13px] text-content-secondary max-md:text-[11px] max-sm:text-[10px]">
                            {c.phoneNumber}
                        </p>
                    </div>
                    <div className="flex gap-1.5 opacity-60 transition-opacity group-hover:opacity-100 max-sm:gap-1">
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

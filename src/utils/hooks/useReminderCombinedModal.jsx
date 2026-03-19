import ThemedSwal from "../swalTheme";
import { ReminderCombinedPrompt } from "../NotificationWindows/ReminderCombinedPrompt.jsx";
import { createRoot } from "react-dom/client";
import { createRef } from "react";

/**
 * Hook para mostrar modal combinado de edición de mensaje y antelación
 * @returns {function} - Función que abre el modal: async (currentMessage, currentHours) => ({ message, hours } | null)
 */
export function useReminderCombinedModal() {
    return async (currentMessage, currentHours) => {
        return new Promise((resolve) => {
            const componentRef = createRef();
            let root = null;

            ThemedSwal.fire({
                title: "Editar Recordatorio",
                html: '<div id="reminder-combined-container"></div>',
                confirmButtonText: "Guardar",
                cancelButtonText: "Cancelar",
                showCancelButton: true,
                reverseButtons: true,
                focusConfirm: false,
                width: 600,
                didOpen: async () => {
                    const container = document.getElementById("reminder-combined-container");
                    
                    const handleCancel = () => {
                        ThemedSwal.close();
                    };

                    // Renderizar componente React en el contenedor
                    root = createRoot(container);
                    root.render(
                        <ReminderCombinedPrompt
                            ref={componentRef}
                            currentMessage={currentMessage}
                            currentHours={currentHours}
                            onCancel={handleCancel}
                        />
                    );
                },
                preConfirm: () => {
                    if (!componentRef.current) {
                        return false;
                    }
                    const result = componentRef.current.validate();
                    if (!result) {
                        return false;
                    }
                    return result;
                },
                willClose: () => {
                    if (root) {
                        root.unmount();
                    }
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    resolve(result.value);
                } else {
                    resolve(null);
                }
            });
        });
    };
}

export default useReminderCombinedModal;

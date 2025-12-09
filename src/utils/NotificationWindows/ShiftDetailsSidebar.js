import shiftsService from "../../services/shifts";
import ThemedSwal from "../swalTheme";
import confirmDelete from "./ConfirmDelete";
import Toast from "./Toast";

/**
 * Muestra un sidebar lateral izquierdo con los detalles del turno
 * @param {Object} turnoInfo - Información del turno
 * @param {string} turnoInfo.title - Nombre del cliente
 * @param {string} turnoInfo.start - Fecha/hora de inicio
 * @param {string} turnoInfo.end - Fecha/hora de fin
 * @param {Object} turnoInfo.extendedProps - Propiedades extendidas del turno
 * @param {Function} onDelete - Callback opcional para ejecutar después de eliminar
 * @returns {Promise<boolean>} - Retorna true si se eliminó el turno
 */
export const showShiftDetails = async (turnoInfo, onDelete = null) => {
    const { title, start, end, extendedProps } = turnoInfo;

    // Formatear fechas para mostrar
    const formatDateTime = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    };

    const startFormatted = formatDateTime(start);
    const endFormatted = formatDateTime(end);

    await ThemedSwal.fire({
        title: "Detalles del Turno",
        html: `
            <div class="shift-details-container">
                <div class="shift-detail-item">
                    <label class="shift-detail-label">Cliente:</label>
                    <p class="shift-detail-value">${title}</p>
                </div>

                ${
                    extendedProps?.telefono
                        ? `
                    <div class="shift-detail-item">
                        <label class="shift-detail-label">Teléfono:</label>
                        <p class="shift-detail-value">${extendedProps.telefono}</p>
                    </div>
                `
                        : ""
                }

                <div class="shift-detail-item">
                    <label class="shift-detail-label">Nro. Turno:</label>
                    <p class="shift-detail-value">#${
                        extendedProps?.nro_turno || "N/A"
                    }</p>
                </div>

                <div class="shift-detail-item">
                    <label class="shift-detail-label">Inicio:</label>
                    <p class="shift-detail-value">${startFormatted}</p>
                </div>

                <div class="shift-detail-item">
                    <label class="shift-detail-label">Fin:</label>
                    <p class="shift-detail-value">${endFormatted}</p>
                </div>

                ${
                    extendedProps?.observaciones
                        ? `
                    <div class="shift-detail-item">
                        <label class="shift-detail-label">Observaciones:</label>
                        <p class="shift-detail-value shift-detail-observations">${extendedProps.observaciones}</p>
                    </div>
                `
                        : ""
                }

                ${
                    extendedProps?.es_sobreturno
                        ? `
                    <div class="shift-detail-item">
                        <span class="shift-detail-badge">Sobreturno</span>
                    </div>
                `
                        : ""
                }

                ${
                    extendedProps?.tomadoPor
                        ? `
                    <div class="shift-detail-item">
                        <label class="shift-detail-label">Registrado por:</label>
                        <p class="shift-detail-value-small">${extendedProps.tomadoPor.toUpperCase()}</p>
                    </div>
                `
                        : ""
                }
            </div>
        `,
        position: "top-start",
        footer: `
            <div class="shift-details-actions">
                <button id="btn-delete-shift" class="shift-btn-delete">
                    <svg class="shift-btn-icon" viewBox="0 0 24 24">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                    Eliminar Turno
                </button>
            </div>
        `,
        showClass: {
            popup: `
                animate__animated
                animate__fadeInLeft
                animate__faster
            `,
        },
        hideClass: {
            popup: `
                animate__animated
                animate__fadeOutLeft
                animate__faster
            `,
        },
        grow: "column",
        width: 350,
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
            popup: "shift-details-sidebar",
        },
        didOpen: () => {
            const deleteBtn = document.getElementById("btn-delete-shift");
            if (deleteBtn && extendedProps?.turnoId) {
                deleteBtn.addEventListener("click", async () => {
                    // Cerrar el sidebar actual
                    ThemedSwal.close();

                    // Mostrar confirmación de eliminación
                    const shouldDelete = await confirmDelete(
                        `el turno de ${title}`,
                        false
                    );

                    if (shouldDelete) {
                        try {
                            await shiftsService.eliminarTurno(
                                extendedProps.turnoId
                            );
                            Toast(
                                "success",
                                `Turno de ${title} eliminado exitosamente`
                            );

                            // Ejecutar callback si existe (para refrescar el calendario)
                            if (onDelete) {
                                onDelete(extendedProps.turnoId);
                            }
                        } catch (error) {
                            console.error("Error eliminando turno:", error);
                            Toast(
                                "error",
                                `Error al eliminar turno: ${
                                    error.response?.data?.message ||
                                    error.message
                                }`
                            );
                        }
                    }
                });
            }
        },
    });

    return false;
};

export default showShiftDetails;

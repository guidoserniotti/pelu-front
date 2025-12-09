import ThemedSwal from "../swalTheme";

/**
 * Muestra un sidebar lateral izquierdo con los detalles del turno
 * @param {Object} turnoInfo - Información del turno
 * @param {string} turnoInfo.title - Nombre del cliente
 * @param {string} turnoInfo.start - Fecha/hora de inicio
 * @param {string} turnoInfo.end - Fecha/hora de fin
 * @param {Object} turnoInfo.extendedProps - Propiedades extendidas del turno
 * @returns {Promise<void>}
 */
export const showShiftDetails = async (turnoInfo) => {
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
                        <span class="shift-detail-badge">⚠️ Sobreturno</span>
                    </div>
                `
                        : ""
                }

                ${
                    extendedProps?.tomadoPor
                        ? `
                    <div class="shift-detail-item shift-detail-footer">
                        <label class="shift-detail-label">Registrado por:</label>
                        <p class="shift-detail-value-small">${extendedProps.tomadoPor.toUpperCase()}</p>
                    </div>
                `
                        : ""
                }
            </div>
        `,
        position: "top-start",
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
    });
};

export default showShiftDetails;

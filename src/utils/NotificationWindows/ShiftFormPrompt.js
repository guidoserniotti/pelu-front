import ThemedSwal from "../swalTheme";

/**
 * Muestra un formulario para crear un turno
 * @param {Array} clientes - Lista de clientes disponibles
 * @param {Date} startDate - Fecha/hora de inicio del turno
 * @param {Date} endDate - Fecha/hora de fin del turno
 * @param {string} clienteIdPreseleccionado - ID del cliente preseleccionado (opcional)
 * @returns {Promise<Object|null>} - Datos del turno o null si se cancela
 */
export const promptCreateShift = async (
    clientes,
    startDate,
    endDate,
    clienteIdPreseleccionado = null
) => {
    // Formatear fechas para inputs datetime-local
    const formatDateTimeLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const result = await ThemedSwal.fire({
        title: "Crear Turno",
        html: `
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    Cliente:
                </label>
                <select id="swal-cliente" class="swal2-input" style="width: 100%; max-width: 100%;">
                    <option value="">Seleccione un cliente</option>
                    ${clientes
                        .map(
                            (cliente) =>
                                `<option value="${cliente.id}" ${
                                    cliente.id === clienteIdPreseleccionado
                                        ? "selected"
                                        : ""
                                }>${cliente.title}</option>`
                        )
                        .join("")}
                </select>

                <label style="display: block; margin-top: 16px; margin-bottom: 8px; font-weight: bold;">
                    Fecha/Hora Inicio:
                </label>
                <input 
                    id="swal-fecha-inicio" 
                    type="datetime-local" 
                    class="swal2-input" 
                    style="width: 100%; max-width: 100%;"
                    value="${formatDateTimeLocal(startDate)}"
                />

                <label style="display: block; margin-top: 16px; margin-bottom: 8px; font-weight: bold;">
                    Fecha/Hora Fin:
                </label>
                <input 
                    id="swal-fecha-fin" 
                    type="datetime-local" 
                    class="swal2-input" 
                    style="width: 100%; max-width: 100%;"
                    value="${formatDateTimeLocal(endDate)}"
                />

                <label style="display: block; margin-top: 16px; margin-bottom: 8px; font-weight: bold;">
                    Observaciones (opcional):
                </label>
                <textarea 
                    id="swal-observaciones" 
                    class="swal2-textarea" 
                    placeholder="Notas adicionales del turno..."
                    style="width: 100%; max-width: 100%;"
                ></textarea>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Crear Turno",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            const clienteId = document.getElementById("swal-cliente").value;
            const fechaInicio =
                document.getElementById("swal-fecha-inicio").value;
            const fechaFin = document.getElementById("swal-fecha-fin").value;
            const observaciones =
                document.getElementById("swal-observaciones").value;

            if (!clienteId) {
                ThemedSwal.showValidationMessage("Debe seleccionar un cliente");
                return false;
            }

            if (!fechaInicio) {
                ThemedSwal.showValidationMessage(
                    "Debe ingresar la fecha/hora de inicio"
                );
                return false;
            }

            if (!fechaFin) {
                ThemedSwal.showValidationMessage(
                    "Debe ingresar la fecha/hora de fin"
                );
                return false;
            }

            // Convertir a formato ISO para el backend
            const fechaInicioISO = new Date(fechaInicio).toISOString();
            const fechaFinISO = new Date(fechaFin).toISOString();

            if (new Date(fechaInicio) >= new Date(fechaFin)) {
                ThemedSwal.showValidationMessage(
                    "La fecha de fin debe ser posterior a la fecha de inicio"
                );
                return false;
            }

            return {
                cliente_id: clienteId,
                fecha_hora_inicio: fechaInicioISO,
                fecha_hora_fin: fechaFinISO,
                observaciones: observaciones.trim() || null,
            };
        },
    });

    if (result.isConfirmed) {
        return result.value;
    }

    return null;
};

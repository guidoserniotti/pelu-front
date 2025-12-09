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
            <div class="shift-form-container">
                <label class="shift-form-label">
                    Cliente:
                </label>
                <select id="swal-cliente" class="swal2-input shift-form-select">
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

                <label class="shift-form-label">
                    Fecha/Hora Inicio:
                </label>
                <input 
                    id="swal-fecha-inicio" 
                    type="datetime-local" 
                    class="swal2-input shift-form-datetime"
                    value="${formatDateTimeLocal(startDate)}"
                />

                <label class="shift-form-label">
                    Fecha/Hora Fin:
                </label>
                <input 
                    id="swal-fecha-fin" 
                    type="datetime-local" 
                    class="swal2-input shift-form-datetime"
                    value="${formatDateTimeLocal(endDate)}"
                />

                <label class="shift-form-label">
                    Observaciones (opcional):
                </label>
                <textarea 
                    id="swal-observaciones" 
                    class="swal2-textarea shift-form-textarea" 
                    placeholder="Notas adicionales del turno..."
                ></textarea>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Crear Turno",
        cancelButtonText: "Cancelar",
        didOpen: () => {
            const confirmButton = ThemedSwal.getConfirmButton();
            const fechaInicioInput =
                document.getElementById("swal-fecha-inicio");
            const fechaFinInput = document.getElementById("swal-fecha-fin");

            // Función para validar fechas en tiempo real
            const validateDates = () => {
                const now = new Date();

                // Parsear las fechas desde los inputs datetime-local
                const fechaInicioStr = fechaInicioInput.value;
                const fechaFinStr = fechaFinInput.value;

                if (!fechaInicioStr || !fechaFinStr) {
                    // Si falta alguna fecha, habilitar botón
                    confirmButton.disabled = false;
                    confirmButton.style.opacity = "1";
                    confirmButton.style.cursor = "pointer";
                    return;
                }

                // Convertir strings a Date
                const fechaInicio = new Date(fechaInicioStr);
                const fechaFin = new Date(fechaFinStr);

                // Deshabilitar botón si cualquier fecha es anterior a ahora
                if (fechaInicio < now || fechaFin < now) {
                    confirmButton.disabled = true;
                    confirmButton.style.opacity = "0.5";
                    confirmButton.style.cursor = "not-allowed";
                } else {
                    confirmButton.disabled = false;
                    confirmButton.style.opacity = "1";
                    confirmButton.style.cursor = "pointer";
                }
            };

            // Agregar listeners a los inputs de fecha
            fechaInicioInput.addEventListener("change", validateDates);
            fechaInicioInput.addEventListener("input", validateDates);
            fechaFinInput.addEventListener("change", validateDates);
            fechaFinInput.addEventListener("input", validateDates);

            // Validar al abrir
            validateDates();
        },
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

            // Validar que las fechas no sean pasadas
            const now = new Date();
            if (new Date(fechaInicio) < now) {
                ThemedSwal.showValidationMessage(
                    "La fecha de inicio no puede ser anterior a la fecha actual"
                );
                return false;
            }

            if (new Date(fechaFin) < now) {
                ThemedSwal.showValidationMessage(
                    "La fecha de fin no puede ser anterior a la fecha actual"
                );
                return false;
            }

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

import ThemedSwal from "../swalTheme";

/**
 * Muestra un formulario para modificar un turno existente
 * @param {Object} turnoData - Datos del turno actual
 * @param {string} turnoData.turnoId - ID del turno
 * @param {string} turnoData.clienteNombre - Nombre del cliente
 * @param {Date} turnoData.startDate - Fecha/hora de inicio actual
 * @param {Date} turnoData.endDate - Fecha/hora de fin actual
 * @param {string} turnoData.observaciones - Observaciones actuales
 * @returns {Promise<Object|null>} - Datos actualizados del turno o null si se cancela
 */
export const promptModifyShift = async (turnoData) => {
    const { turnoId, clienteNombre, startDate, endDate, observaciones } =
        turnoData;

    // Formatear fechas para inputs datetime-local
    const formatDateTimeLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Guardar valores originales para comparación
    const originalStartStr = formatDateTimeLocal(startDate);
    const originalEndStr = formatDateTimeLocal(endDate);
    const originalObservaciones = observaciones || "";

    const result = await ThemedSwal.fire({
        title: "Modificar Turno",
        html: `
            <div class="shift-form-container">
                <label class="shift-form-label">
                    Cliente:
                </label>
                <input 
                    id="swal-cliente-nombre" 
                    type="text" 
                    class="swal2-input shift-form-select"
                    value="${clienteNombre}"
                    disabled
                    style="background-color: var(--surface-3); cursor: not-allowed;"
                />

                <label class="shift-form-label">
                    Fecha/Hora Inicio:
                </label>
                <input 
                    id="swal-fecha-inicio" 
                    type="datetime-local" 
                    class="swal2-input shift-form-datetime"
                    value="${originalStartStr}"
                />

                <label class="shift-form-label">
                    Fecha/Hora Fin:
                </label>
                <input 
                    id="swal-fecha-fin" 
                    type="datetime-local" 
                    class="swal2-input shift-form-datetime"
                    value="${originalEndStr}"
                />

                <label class="shift-form-label">
                    Observaciones (opcional):
                </label>
                <textarea 
                    id="swal-observaciones" 
                    class="swal2-textarea shift-form-textarea" 
                    placeholder="Notas adicionales del turno..."
                >${originalObservaciones}</textarea>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Modificar Turno",
        cancelButtonText: "Cancelar",
        didOpen: () => {
            const confirmButton = ThemedSwal.getConfirmButton();
            const fechaInicioInput =
                document.getElementById("swal-fecha-inicio");
            const fechaFinInput = document.getElementById("swal-fecha-fin");
            const observacionesInput =
                document.getElementById("swal-observaciones");

            // Función para validar fechas y detectar cambios en tiempo real
            const validateDates = () => {
                const now = new Date();

                // Parsear las fechas desde los inputs datetime-local
                const fechaInicioStr = fechaInicioInput.value;
                const fechaFinStr = fechaFinInput.value;
                const observacionesActuales = observacionesInput.value.trim();

                if (!fechaInicioStr || !fechaFinStr) {
                    // Si falta alguna fecha, deshabilitar botón
                    confirmButton.disabled = true;
                    confirmButton.style.opacity = "0.5";
                    confirmButton.style.cursor = "not-allowed";
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
                    return;
                }

                // Deshabilitar botón si la fecha de inicio es mayor o igual a la de fin
                if (fechaInicio >= fechaFin) {
                    confirmButton.disabled = true;
                    confirmButton.style.opacity = "0.5";
                    confirmButton.style.cursor = "not-allowed";
                    return;
                }

                // Deshabilitar botón si NO hay cambios respecto a los valores originales
                const noHayCambios =
                    fechaInicioStr === originalStartStr &&
                    fechaFinStr === originalEndStr &&
                    observacionesActuales === originalObservaciones;

                if (noHayCambios) {
                    confirmButton.disabled = true;
                    confirmButton.style.opacity = "0.5";
                    confirmButton.style.cursor = "not-allowed";
                } else {
                    confirmButton.disabled = false;
                    confirmButton.style.opacity = "1";
                    confirmButton.style.cursor = "pointer";
                }
            };

            // Agregar listeners a los inputs de fecha y observaciones
            fechaInicioInput.addEventListener("change", validateDates);
            fechaInicioInput.addEventListener("input", validateDates);
            fechaFinInput.addEventListener("change", validateDates);
            fechaFinInput.addEventListener("input", validateDates);
            observacionesInput.addEventListener("input", validateDates);
            observacionesInput.addEventListener("change", validateDates);

            // Validar al abrir (debería estar deshabilitado inicialmente)
            validateDates();
        },
        preConfirm: () => {
            const fechaInicio =
                document.getElementById("swal-fecha-inicio").value;
            const fechaFin = document.getElementById("swal-fecha-fin").value;
            const observaciones =
                document.getElementById("swal-observaciones").value;

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
                turno_id: turnoId,
                fecha_hora_inicio_turno: fechaInicioISO,
                fecha_hora_fin_turno: fechaFinISO,
                observaciones: observaciones.trim() || null,
            };
        },
    });

    if (result.isConfirmed) {
        return result.value;
    }

    return null;
};

import ThemedSwal from "../swalTheme";
import {
    SERVICE_OPTIONS,
    getServiceByColor,
    getServiceByValue,
} from "./serviceOptions";
const MIN_DURATION = 15;
const MAX_DURATION = 240;
const STEP = 15;

const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
};

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
    const {
        turnoId,
        clienteNombre,
        startDate,
        endDate,
        observaciones,
        service_color,
    } = turnoData;

    const formatDateTimeLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const originalStartStr = formatDateTimeLocal(startDate);
    const originalObservaciones = observaciones || "";
    const originalServiceColor = service_color || "#378006";
    const originalService = getServiceByColor(originalServiceColor);
    const originalServiceValue = originalService?.value;
    const serviceOptionsHtml =
        !originalService
            ? `<option value="__current_service__" selected>Servicio actual</option>`
            : "";

    // Calcular duración inicial en minutos, redondeada al step más cercano
    const rawDuration = Math.round(
        (endDate.getTime() - startDate.getTime()) / 60000
    );
    const initialDuration = Math.min(
        MAX_DURATION,
        Math.max(MIN_DURATION, Math.round(rawDuration / STEP) * STEP)
    );

    const result = await ThemedSwal.fire({
        title: "Modificar Turno",
        html: `
            <div class="shift-form-container">
                <label class="shift-form-label">Cliente:</label>
                <input
                    id="swal-cliente-nombre"
                    type="text"
                    class="swal2-input shift-form-select"
                    value="${clienteNombre}"
                    disabled
                    style="background-color: var(--color-base); cursor: not-allowed; opacity: 0.7;"
                />

                <label class="shift-form-label">Fecha/Hora Inicio:</label>
                <input
                    id="swal-fecha-inicio"
                    type="datetime-local"
                    class="swal2-input shift-form-datetime"
                    value="${originalStartStr}"
                />

                <label class="shift-form-label">Duración:</label>
                <div class="shift-form-duration">
                    <button type="button" id="swal-dur-minus" class="shift-form-duration-btn" aria-label="Reducir duración">−</button>
                    <span id="swal-dur-display" class="shift-form-duration-display">${formatDuration(initialDuration)}</span>
                    <button type="button" id="swal-dur-plus" class="shift-form-duration-btn" aria-label="Aumentar duración">+</button>
                </div>
                <input type="hidden" id="swal-duracion" value="${initialDuration}" />
                
                <label class="shift-form-label">Servicio:</label>
                <select id="swal-servicio" class="swal2-input shift-form-select">
                    ${serviceOptionsHtml}${SERVICE_OPTIONS.map(
                        (servicio) =>
                            `<option value='${servicio.value}' ${
                                servicio.value === originalServiceValue
                                    ? "selected"
                                    : ""
                            }>${servicio.label}</option>`
                    ).join("")}
                </select>

                <label class="shift-form-label">Observaciones (opcional):</label>
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
        reverseButtons: true,
        didOpen: () => {
            const confirmButton = ThemedSwal.getConfirmButton();
            const fechaInicioInput = document.getElementById("swal-fecha-inicio");
            const durInput = document.getElementById("swal-duracion");
            const durDisplay = document.getElementById("swal-dur-display");
            const btnMinus = document.getElementById("swal-dur-minus");
            const btnPlus = document.getElementById("swal-dur-plus");
            const observacionesInput = document.getElementById("swal-observaciones");
            const servicioInput = document.getElementById("swal-servicio");

            // --- Duración con +/- ---
            const updateDuration = (delta) => {
                let current = parseInt(durInput.value, 10);
                current = Math.min(MAX_DURATION, Math.max(MIN_DURATION, current + delta));
                durInput.value = current;
                durDisplay.textContent = formatDuration(current);
                btnMinus.disabled = current <= MIN_DURATION;
                btnPlus.disabled = current >= MAX_DURATION;
                validate();
            };

            btnMinus.addEventListener("click", () => updateDuration(-STEP));
            btnPlus.addEventListener("click", () => updateDuration(STEP));

            btnMinus.disabled = initialDuration <= MIN_DURATION;
            btnPlus.disabled = initialDuration >= MAX_DURATION;

            // --- Validación: fecha válida + detectar cambios ---
            const setButton = (enabled) => {
                confirmButton.disabled = !enabled;
                confirmButton.style.opacity = enabled ? "1" : "0.5";
                confirmButton.style.cursor = enabled ? "pointer" : "not-allowed";
            };

            const validate = () => {
                const now = new Date();
                const fechaInicioStr = fechaInicioInput.value;
                const currentDuration = parseInt(durInput.value, 10);
                const observacionesActuales = observacionesInput.value.trim();
                const currentServiceColor =
                    servicioInput.value === "__current_service__"
                        ? originalServiceColor
                        : getServiceByValue(servicioInput.value)?.color ||
                          originalServiceColor;

                if (!fechaInicioStr) {
                    setButton(false);
                    return;
                }

                const fechaInicio = new Date(fechaInicioStr);

               /*  if (fechaInicio < now) {
                    setButton(false);
                    return;
                } */

                // Detectar si hubo cambios
                const noHayCambios =
                    fechaInicioStr === originalStartStr &&
                    currentDuration === initialDuration &&
                    observacionesActuales === originalObservaciones &&
                    currentServiceColor === originalServiceColor;

                setButton(!noHayCambios);
            };

            fechaInicioInput.addEventListener("change", validate);
            fechaInicioInput.addEventListener("input", validate);
            observacionesInput.addEventListener("input", validate);
            observacionesInput.addEventListener("change", validate);
            servicioInput.addEventListener("change", validate);

            validate();
        },
        preConfirm: () => {
            const fechaInicio = document.getElementById("swal-fecha-inicio").value;
            const duracion = parseInt(document.getElementById("swal-duracion").value, 10);
            const observaciones = document.getElementById("swal-observaciones").value;
            const servicioValue = document.getElementById("swal-servicio").value;

            const servicio =
                servicioValue === "__current_service__"
                    ? originalServiceColor
                    : getServiceByValue(servicioValue)?.color;

            if (!fechaInicio) {
                ThemedSwal.showValidationMessage("Debe ingresar la fecha/hora de inicio");
                return false;
            }

            if (!servicio) {
                ThemedSwal.showValidationMessage("Debe seleccionar un servicio válido");
                return false;
            }

            const fechaInicioDate = new Date(fechaInicio);
            const now = new Date();

       /*      if (fechaInicioDate < now) {
                ThemedSwal.showValidationMessage(
                    "La fecha de inicio no puede ser anterior a la fecha actual"
                );
                return false;
            } */

            const fechaFinDate = new Date(fechaInicioDate.getTime() + duracion * 60000);

            return {
                turno_id: turnoId,
                fecha_hora_inicio_turno: fechaInicioDate.toISOString(),
                fecha_hora_fin_turno: fechaFinDate.toISOString(),
                service_color: servicio,
                observaciones: observaciones.trim() || null,
            };
        },
    });

    if (result.isConfirmed) {
        return result.value;
    }

    return null;
};

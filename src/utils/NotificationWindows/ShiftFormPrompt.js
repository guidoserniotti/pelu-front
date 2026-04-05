import ThemedSwal from "../swalTheme";
import {SERVICE_OPTIONS, getServiceByValue} from "./serviceOptions";
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
    const formatDateTimeLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Calcular duración inicial en minutos, redondeada al step más cercano
    const rawDuration = Math.round(
        (endDate.getTime() - startDate.getTime()) / 60000
    );
    const initialDuration = Math.min(
        MAX_DURATION,
        Math.max(MIN_DURATION, Math.round(rawDuration / STEP) * STEP)
    );

    // Preseleccionar nombre si viene cliente
    const preselectedClient = clienteIdPreseleccionado
        ? clientes.find((c) => c.id === clienteIdPreseleccionado)
        : null;

    const clienteOptions = clientes
        .map(
            (c) =>
                `<option value="${c.id}" ${
                    c.id === clienteIdPreseleccionado ? "selected" : ""
                }>${c.title}</option>`
        )
        .join("");

    const result = await ThemedSwal.fire({
        title: "Crear Turno",
        html: `
            <div class="shift-form-container">
                <label class="shift-form-label">Cliente:</label>
                <div class="shift-form-combobox-wrapper">
                    <input
                        id="swal-cliente-filter"
                        type="text"
                        class="swal2-input shift-form-select shift-form-combobox-input"
                        placeholder="Buscar cliente..."
                        autocomplete="off"
                        value="${preselectedClient ? preselectedClient.title : ""}"
                    />
                    <select id="swal-cliente" class="swal2-input shift-form-select shift-form-combobox-select" size="1">
                        <option value="">Seleccione un cliente</option>
                        ${clienteOptions}
                    </select>
                </div>

                <label class="shift-form-label">Fecha/Hora Inicio:</label>
                <input
                    id="swal-fecha-inicio"
                    type="datetime-local"
                    class="swal2-input shift-form-datetime"
                    value="${formatDateTimeLocal(startDate)}"
                />

                <label class="shift-form-label">Servicio:</label>
                <select id='swal-servicio' class= 'swal2-input shift-form-select'>
                    ${SERVICE_OPTIONS.map(
                        (servicio)=>`<option value='${servicio.value}'>${servicio.label}</option>`
                    ).join('')}
                </select>

                <label class="shift-form-label">Duración:</label>
                <div class="shift-form-duration">
                    <button type="button" id="swal-dur-minus" class="shift-form-duration-btn" aria-label="Reducir duración">−</button>
                    <span id="swal-dur-display" class="shift-form-duration-display">${formatDuration(initialDuration)}</span>
                    <button type="button" id="swal-dur-plus" class="shift-form-duration-btn" aria-label="Aumentar duración">+</button>
                </div>
                <input type="hidden" id="swal-duracion" value="${initialDuration}" />

                <label class="shift-form-label">Observaciones (opcional):</label>
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
        reverseButtons: true,
        didOpen: () => {
            const confirmButton = ThemedSwal.getConfirmButton();
            const fechaInicioInput = document.getElementById("swal-fecha-inicio");
            const filterInput = document.getElementById("swal-cliente-filter");
            const selectEl = document.getElementById("swal-cliente");
            const durInput = document.getElementById("swal-duracion");
            const durDisplay = document.getElementById("swal-dur-display");
            const btnMinus = document.getElementById("swal-dur-minus");
            const btnPlus = document.getElementById("swal-dur-plus");
            const servicioInput=document.getElementById('swal-servicio')

            // --- Combobox: filtro sobre el select ---
            const allOptions = Array.from(selectEl.options).slice(1); // sin el placeholder

            const applyFilter = (text) => {
                const query = text.toLowerCase();
                // Limpiar opciones actuales
                selectEl.innerHTML = "";

                const filtered = allOptions.filter((opt) =>
                    opt.textContent.toLowerCase().includes(query)
                );

                if (filtered.length === 0) {
                    const empty = document.createElement("option");
                    empty.value = "";
                    empty.textContent = "Sin resultados";
                    empty.disabled = true;
                    selectEl.appendChild(empty);
                } else {
                    filtered.forEach((opt) => selectEl.appendChild(opt.cloneNode(true)));
                }

                // Abrir el select expandido
                selectEl.size = Math.min(filtered.length || 1, 5);
                selectEl.classList.add("shift-form-combobox-open");
            };

            const collapseSelect = () => {
                selectEl.size = 1;
                selectEl.classList.remove("shift-form-combobox-open");
            };

            filterInput.addEventListener("input", () => {
                selectEl.value = "";
                applyFilter(filterInput.value);
            });

            filterInput.addEventListener("focus", () => {
                applyFilter(filterInput.value);
            });

            selectEl.addEventListener("change", () => {
                const selected = selectEl.options[selectEl.selectedIndex];
                if (selected && selected.value) {
                    filterInput.value = selected.textContent;
                    collapseSelect();
                }
            });

            selectEl.addEventListener("blur", () => {
                setTimeout(collapseSelect, 120);
            });

            // Si hay preseleccionado, colapsar
            if (clienteIdPreseleccionado) {
                collapseSelect();
            }

            // --- Duración con +/- ---
            const updateDuration = (delta) => {
                let current = parseInt(durInput.value, 10);
                current = Math.min(MAX_DURATION, Math.max(MIN_DURATION, current + delta));
                durInput.value = current;
                durDisplay.textContent = formatDuration(current);
                btnMinus.disabled = current <= MIN_DURATION;
                btnPlus.disabled = current >= MAX_DURATION;
            };

            btnMinus.addEventListener("click", () => updateDuration(-STEP));
            btnPlus.addEventListener("click", () => updateDuration(STEP));

            // Estado inicial de los botones
            btnMinus.disabled = initialDuration <= MIN_DURATION;
            btnPlus.disabled = initialDuration >= MAX_DURATION;

            // --- Validación de fecha ---
            const validate = () => {
                const now = new Date();
                const fechaInicioStr = fechaInicioInput.value;
                if (!fechaInicioStr) {
                    confirmButton.disabled = false;
                    confirmButton.style.opacity = "1";
                    confirmButton.style.cursor = "pointer";
                    return;
                }
                if (new Date(fechaInicioStr) < now) {
                    confirmButton.disabled = true;
                    confirmButton.style.opacity = "0.5";
                    confirmButton.style.cursor = "not-allowed";
                } else {
                    confirmButton.disabled = false;
                    confirmButton.style.opacity = "1";
                    confirmButton.style.cursor = "pointer";
                }
            };

            fechaInicioInput.addEventListener("change", validate);
            fechaInicioInput.addEventListener("input", validate);
            servicioInput.addEventListener('change',validate);
            servicioInput.addEventListener('input', validate);
            validate();
        },
        preConfirm: () => {
            const clienteId = document.getElementById("swal-cliente").value;
            const fechaInicio = document.getElementById("swal-fecha-inicio").value;
            const duracion = parseInt(document.getElementById("swal-duracion").value, 10);
            const observaciones = document.getElementById("swal-observaciones").value;
            const servicioKey=document.getElementById('swal-servicio').value;
            if (!clienteId) {
                ThemedSwal.showValidationMessage("Debe seleccionar un cliente");
                return false;
            }
            if(!servicioKey){
                ThemedSwal.showValidationMessage('Debe seleccionar un servicio');
                return false;
            }

            const servicio = getServiceByValue(servicioKey);

            if(!servicio){
                ThemedSwal.showValidationMessage(
                    'Debe seleccionar un servicio válido'
                )
                return false;
            }

            if (!fechaInicio) {
                ThemedSwal.showValidationMessage("Debe ingresar la fecha/hora de inicio");
                return false;
            }

            const fechaInicioDate = new Date(fechaInicio);
            const now = new Date();

            if (fechaInicioDate < now) {
                ThemedSwal.showValidationMessage(
                    "La fecha de inicio no puede ser anterior a la fecha actual"
                );
                return false;
            }

            const fechaFinDate = new Date(fechaInicioDate.getTime() + duracion * 60000);

            const clienteSearch = document.getElementById("swal-cliente-filter").value;

            return {
                cliente_id: clienteId,
                cliente_nombre: clienteSearch,
                servicio: {
                    key: servicioKey,
                    label: servicio.label,
                    color: servicio.color
                },
                service_color: servicio.color,
                fecha_hora_inicio: fechaInicioDate.toISOString(),
                fecha_hora_fin: fechaFinDate.toISOString(),
                observaciones: observaciones.trim() || null,
                
            };
        },
    });

    if (result.isConfirmed) {
        return result.value;
    }

    return null;
};

import ThemedSwal from "../swalTheme";

/**
 * Muestra un formulario para ver y editar la antelación de envío del recordatorio
 * @param {number} currentHours - Horas de antelación actuales
 * @returns {Promise<number|null>} - Nueva antelación o null si se cancela/no hay cambios
 */
export async function promptEditAntelacion(currentHours) {
    let value = currentHours;

    const updateDisplay = () => {
        const popup = ThemedSwal.getPopup();
        if (!popup) return;
        const display = popup.querySelector("#antelacion-display");
        const btnMinus = popup.querySelector("#antelacion-minus");
        const btnPlus = popup.querySelector("#antelacion-plus");
        if (display) {
            display.textContent = `${value} ${value === 1 ? "hora" : "horas"}`;
        }
        if (btnMinus) btnMinus.disabled = value <= 1;
        if (btnPlus) btnPlus.disabled = value >= 24;
    };

    const result = await ThemedSwal.fire({
        title: "Antelación de Recordatorio",
        html: `
            <div class="reminder-form-container">
                <div class="reminder-form-icon antelacion-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                    </svg>
                </div>
                <p class="reminder-form-hint">Horas de anticipación con las que se enviará el recordatorio antes del turno.</p>
                <div class="antelacion-control">
                    <button type="button" id="antelacion-minus" class="antelacion-btn antelacion-btn-minus" ${value <= 1 ? "disabled" : ""}>−</button>
                    <span id="antelacion-display" class="antelacion-display">${value} ${value === 1 ? "hora" : "horas"}</span>
                    <button type="button" id="antelacion-plus" class="antelacion-btn antelacion-btn-plus" ${value >= 24 ? "disabled" : ""}>+</button>
                </div>
            </div>
        `,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        reverseButtons: true,
        focusConfirm: false,
        width: 400,
        didOpen: () => {
            const popup = ThemedSwal.getPopup();
            const btnMinus = popup.querySelector("#antelacion-minus");
            const btnPlus = popup.querySelector("#antelacion-plus");

            btnMinus.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (value > 1) {
                    value--;
                    updateDisplay();
                }
            });

            btnPlus.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (value < 24) {
                    value++;
                    updateDisplay();
                }
            });
        },
        preConfirm: () => {
            if (value === currentHours) {
                ThemedSwal.showValidationMessage(
                    "No hay cambios para guardar"
                );
                return false;
            }
            return value;
        },
    });
    if (result.isConfirmed) return result.value;
    return null;
}

export default { promptEditAntelacion };

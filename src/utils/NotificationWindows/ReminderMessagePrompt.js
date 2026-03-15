import ThemedSwal from "../swalTheme";

/**
 * Muestra un formulario para ver y editar el mensaje de recordatorio
 * @param {string} currentMessage - Mensaje actual del recordatorio
 * @returns {Promise<string|null>} - Nuevo mensaje o null si se cancela/no hay cambios
 */
export async function promptEditReminderMessage(currentMessage) {
    let textareaInput;
    const escapedMessage = currentMessage
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const result = await ThemedSwal.fire({
        title: "Mensaje de Recordatorio",
        html: `
            <div class="reminder-form-container">
                <div class="reminder-form-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                </div>
                <p class="reminder-form-hint">Este mensaje se enviará como recordatorio a los clientes con turnos programados.</p>
                <textarea
                    id="reminder-message"
                    class="swal2-input reminder-form-textarea"
                    placeholder="Escribí el mensaje de recordatorio..."
                    rows="5"
                    maxlength="200"
                >${escapedMessage}</textarea>
                <div class="reminder-form-counter">
                    <span id="reminder-char-count">${currentMessage.length}</span>/200 caracteres
                </div>
            </div>
        `,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        reverseButtons: true,
        focusConfirm: false,
        width: 480,
        didOpen: () => {
            const popup = ThemedSwal.getPopup();
            textareaInput = popup.querySelector("#reminder-message");
            const counter = popup.querySelector("#reminder-char-count");

            textareaInput.focus();
            textareaInput.addEventListener("input", () => {
                counter.textContent = textareaInput.value.length;
            });
        },
        preConfirm: () => {
            const mensaje = textareaInput.value.trim();

            if (mensaje.length < 2) {
                ThemedSwal.showValidationMessage(
                    "El mensaje debe tener al menos 2 caracteres"
                );
                return false;
            }

            if (mensaje.length > 200) {
                ThemedSwal.showValidationMessage(
                    "El mensaje no debe exceder los 200 caracteres"
                );
                return false;
            }

            if (mensaje === currentMessage) {
                ThemedSwal.showValidationMessage(
                    "No hay cambios para guardar"
                );
                return false;
            }

            return mensaje;
        },
    });
    if (result.isConfirmed) return result.value;
    return null;
}

export default { promptEditReminderMessage };

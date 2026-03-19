import { useState } from 'react';

/**
 * Componente React para editar el mensaje de recordatorio
 * @param {string} currentMessage - Mensaje actual del recordatorio
 * @param {function} onSave - Callback al cambiar el mensaje: (newMessage) => void
 */
export function ReminderMessagePrompt({ currentMessage, onSave }) {
    const [message, setMessage] = useState(currentMessage);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setMessage(newValue);
        onSave(newValue);
    };

    // Función para generar previsualización reemplazando placeholders
    const generatePreview = (text) => {
        return text
            .replace(/\{\{HORA_TURNO\}\}/g, '10:30 HS')
            .replace(/\{\{FECHA_TURNO\}\}/g, '15/03/2026');
    };

    const previewText = generatePreview(message);

    return (
        <div className="reminder-form-container">
            <div className="reminder-form-icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
            </div>
            <p className="reminder-form-hint">
                Este mensaje se enviará como recordatorio a los clientes con turnos programados.
            </p>
            
            {/* Referencias de placeholders disponibles */}
            <div className="reminder-placeholders-reference">
                <p className="placeholder-title">Placeholders disponibles:</p>
                <ul className="placeholder-list">
                    <li><code>{'{{HORA_TURNO}}'}</code> - Hora del turno (ej: 10:30 HS)</li>
                    <li><code>{'{{FECHA_TURNO}}'}</code> - Fecha del turno (ej: 15/03/2026)</li>
                </ul>
            </div>

            <textarea
                className="swal2-input reminder-form-textarea"
                placeholder="Escribí el mensaje de recordatorio... Podés usar {{HORA_TURNO}} para incluir la hora"
                rows="5"
                maxLength="500"
                value={message}
                onChange={handleChange}
            />
            <div className="reminder-form-counter">
                <span>{message.length}</span>/500 caracteres
            </div>

            {/* Vista previa con placeholders reemplazados */}
            <div className="reminder-preview">
                <p className="preview-label">Vista previa (con ejemplo de turno a las 10:30):</p>
                <p className="preview-text">{previewText || "(vacío)"}</p>
            </div>
        </div>
    );
}

export default ReminderMessagePrompt;

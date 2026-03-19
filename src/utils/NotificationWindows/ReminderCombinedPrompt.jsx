import { useState, useImperativeHandle, forwardRef } from 'react';
import { ReminderMessagePrompt } from './ReminderMessagePrompt.jsx';
import { ReminderAntelacionPrompt } from './ReminderAntelacionPrompt.jsx';

/**
 * Componente combinado para editar mensaje y antelación de recordatorio
 * @param {string} currentMessage - Mensaje actual del recordatorio
 * @param {number} currentHours - Horas de antelación actuales
 * @param {function} onCancel - Callback al cancelar: () => void
 */
export const ReminderCombinedPrompt = forwardRef(function ReminderCombinedPrompt(
    { currentMessage, currentHours, onCancel },
    ref
) {
    const [message, setMessage] = useState(currentMessage);
    const [hours, setHours] = useState(currentHours);
    const [errors, setErrors] = useState([]);

    // Exponer función de validación al hook padre
    useImperativeHandle(ref, () => ({
        validate: () => {
            const newErrors = [];

            // Validar mensaje
            const trimmedMessage = message.trim();
            if (trimmedMessage.length < 10) {
                newErrors.push("El mensaje debe tener al menos 10 caracteres");
            }
            if (trimmedMessage.length > 500) {
                newErrors.push("El mensaje no debe exceder los 500 caracteres");
            }

            // Validar que haya cambios
            const messageChanged = trimmedMessage !== currentMessage;
            const hoursChanged = hours !== currentHours;

            if (!messageChanged && !hoursChanged) {
                newErrors.push("No hay cambios para guardar");
            }

            if (newErrors.length > 0) {
                setErrors(newErrors);
                return null;
            }

            setErrors([]);
            return {
                message: trimmedMessage,
                hours: hours
            };
        }
    }));

    return (
        <div className="reminder-combined-container">
            <div className="reminder-section">
                <h3 className="reminder-section-title">Mensaje de Recordatorio</h3>
                <ReminderMessagePrompt 
                    currentMessage={currentMessage}
                    onSave={setMessage}
                />
            </div>

            <hr className="reminder-divider" />

            <div className="reminder-section">
                <h3 className="reminder-section-title">Antelación de Recordatorio</h3>
                <ReminderAntelacionPrompt 
                    currentHours={currentHours}
                    onSave={setHours}
                />
            </div>

            {errors.length > 0 && (
                <div className="reminder-errors">
                    {errors.map((error, index) => (
                        <div key={index} className="error-message">
                            ⚠️ {error}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default ReminderCombinedPrompt;

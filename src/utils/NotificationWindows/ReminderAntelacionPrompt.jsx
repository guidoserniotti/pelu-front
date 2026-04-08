import { useState } from 'react';

/**
 * Componente React para editar la antelación de envío del recordatorio
 * @param {number} currentHours - Horas de antelación actuales
 * @param {function} onSave - Callback al cambiar horas: (newHours) => void
 */
export function ReminderAntelacionPrompt({ currentHours, onSave }) {
    const [hours, setHours] = useState(currentHours);

    const handleMinus = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (hours > 1) {
            const newHours = hours - 1;
            setHours(newHours);
            onSave(newHours);
        }
    };

    const handlePlus = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (hours < 72) {
            const newHours = hours + 1;
            setHours(newHours);
            onSave(newHours);
        }
    };

    return (
        <div className="reminder-form-container">
            <div className="reminder-form-icon antelacion-icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                </svg>
            </div>
            <p className="reminder-form-hint">
                Horas de anticipación con las que se enviará el recordatorio antes del turno.
            </p>
            <div className="antelacion-control">
                <button
                    type="button"
                    className="antelacion-btn antelacion-btn-minus"
                    onClick={handleMinus}
                    disabled={hours <= 1}
                >
                    −
                </button>
                <span className="antelacion-display">
                    {hours} {hours === 1 ? "hora" : "horas"}
                </span>
                <button
                    type="button"
                    className="antelacion-btn antelacion-btn-plus"
                    onClick={handlePlus}
                    disabled={hours >= 72}
                >
                    +
                </button>
            </div>
        </div>
    );
}

export default ReminderAntelacionPrompt;
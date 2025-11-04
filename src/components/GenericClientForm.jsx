const GenericClientForm = ({
    handleSubmitClient,
    clientName,
    setClientName,
    clientPhoneNumber,
    setClientPhoneNumber,
    formTitle,
    onCancel,
}) => {
    const buttonText = formTitle.includes("Agregar") ? "Agregar" : "Guardar";
    const prevClientName = clientName;
    const prevClientPhoneNumber = clientPhoneNumber;
    let disabledButton = true;

    if (formTitle === "Editar Cliente") {
        // Si los datos del cliente no cambiaron, deshabilitar el botón de guardar
        if (
            clientName !== prevClientName ||
            clientPhoneNumber !== prevClientPhoneNumber
        ) {
            disabledButton = false;
        }
    }

    return (
        <div
            className="client-overlay"
            onMouseDown={(e) => {
                // Si el usuario hace click en la sombra, se considera cancelar
                if (e.target === e.currentTarget) {
                    onCancel && onCancel();
                }
            }}
        >
            <div
                className="client-form"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <form className="client-form-box" onSubmit={handleSubmitClient}>
                    <h2>{formTitle}</h2>
                    <label>Nombre</label>
                    <input
                        type="text"
                        placeholder="Pablo Perez"
                        value={clientName}
                        onChange={(e) => {
                            setClientName(e.target.value);
                        }}
                    />

                    <label>Teléfono</label>
                    <input
                        type="text"
                        placeholder="353-1234567"
                        value={clientPhoneNumber}
                        onChange={(e) => {
                            setClientPhoneNumber(e.target.value);
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginTop: "1rem",
                        }}
                    >
                        <button
                            type="submit"
                            disabled={
                                !clientName ||
                                !clientPhoneNumber ||
                                disabledButton
                            }
                        >
                            {buttonText}
                        </button>
                        <button
                            type="button"
                            onClick={() => onCancel && onCancel()}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenericClientForm;

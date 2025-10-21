const GenericClientForm = ({
  handleSubmitClient,
  clientName,
  setClientName,
  clientPhoneNumber,
  setClientPhoneNumber,
  formTitle,
}) => {
  const buttonText = formTitle.includes("Agregar") ? "Agregar" : "Guardar";

  return (
    <div className="client-form">
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

        <button type="submit" disabled={!clientName || !clientPhoneNumber}>
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default GenericClientForm;

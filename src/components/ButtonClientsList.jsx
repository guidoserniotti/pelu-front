const ButtonClientsList = ({ text, functionOnClick, imgSource, className }) => {
    // Renderiza un botón redondo consistente para la lista de clientes.
    // Se aplica la clase base `.client-action-button` y se añade `className`
    // para comportamientos específicos (e.g. btn-delete, btn-edit, btn-add).
    return (
        <button
            onClick={functionOnClick}
            className={`client-action-button ${className ? className : ""}`}
            aria-label={text}
            title={text}
            data-tooltip={text}
        >
            <img src={imgSource} alt={text} />
        </button>
    );
};

export default ButtonClientsList;

const ButtonClientsList = ({ text, functionOnClick, imgSource }) => {
    // TO-DO: Hacer que el botón sea una imágen clickeable

    return (
        <div>
            <button onClick={functionOnClick}>
                <img src={imgSource} width={50} height={50} alt={text} />
            </button>
        </div>
    );
};

export default ButtonClientsList;

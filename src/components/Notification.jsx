const Notification = ({ messageSuccess, messageError }) => {
    if (messageSuccess === "" && messageError === "") {
        return null;
    }

    return messageError === "" ? (
        <div className="success">{messageSuccess}</div>
    ) : (
        <div className="error">{messageError}</div>
    );
};

export default Notification;

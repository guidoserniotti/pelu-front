import "../styles/notifications.css";

const Notification = ({ message, className }) => {
    // Render nothing when there's no message
    if (!message || (Array.isArray(message) && message.length === 0))
        return null;

    if (Array.isArray(message)) {
        return (
            <div className={`error ${className}`}>
                <ul className={`error-list ${className}`}>
                    {message.map((m, idx) => (
                        <li className={`error-item ${className}`} key={idx}>
                            {m}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return <div className={`error-item ${className}`}>{message}</div>;
};

export default Notification;

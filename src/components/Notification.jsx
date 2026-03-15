const Notification = ({ message }) => {
    if (!message || (Array.isArray(message) && message.length === 0))
        return null;

    const itemClasses =
        "animate-[notif-enter_260ms_ease-out_both] rounded-md border border-error-dark bg-error px-3 py-2.5 text-sm leading-snug text-error-text shadow-[0_8px_20px_rgba(229,57,53,0.5)]";

    if (Array.isArray(message)) {
        return (
            <div className="my-1.5">
                <ul className="list-none p-0">
                    {message.map((m, idx) => (
                        <li className={`${itemClasses} ${idx > 0 ? "mt-2" : ""}`} key={idx}>
                            {m}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return <div className={itemClasses}>{message}</div>;
};

export default Notification;

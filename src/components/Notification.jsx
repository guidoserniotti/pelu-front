const Notification = ({ message }) => {
  // Render nothing when there's no message
  if (!message || (Array.isArray(message) && message.length === 0)) return null;

  if (Array.isArray(message)) {
    return (
      <div className="error">
        <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
          {message.map((m, idx) => (
            <li key={idx}>{m}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <div className="error">{message}</div>;
};

export default Notification;

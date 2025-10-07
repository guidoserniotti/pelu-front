const Notification = ({ message }) => {
  // Render nothing when there's no message
  if (!message) return null;

  return <div className="error">{message}</div>;
};

export default Notification;

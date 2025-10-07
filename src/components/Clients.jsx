import ClientList from "./ClientList";
function Clients({ client, setClient }) {
    return (
        <div className="client-container">
            <h2>Clientes</h2>
            <ClientList client={client} setClient={setClient} />
        </div>
    );
}

export default Clients;

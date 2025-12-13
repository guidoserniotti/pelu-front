import "./styles/App.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer, Slide } from "react-toastify";
/* TO-DO:
- Estilo y UX:
  * Mejorar diseño
  * Feedback al usuario (notificaciones, loaders, etc.)
  * Responsividad
  * IMPLEMENTAR PAGINACIÓN
    ~ Estado para página actual
    ~ Petición de backend para calculo de páginas.
    ~ La última página pregunta a la siguiente si tiene datos.
    ~ Scroll de máximos clientes
*/

const App = () => {
    return (
        <div className="app-container">
            <AppRoutes />
            <ToastContainer
                position="top-center"
                autoClose={2500}
                limit={3}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Slide}
            />
        </div>
    );
};

export default App;

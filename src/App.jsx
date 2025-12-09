import "./styles/App.css";
import AppRoutes from "./routes/AppRoutes";
/* TO-DO:
- LOGOUT:
  * Limpiar token con timeout
  * Set isLogin to false
- Manejo de turnos con eventos en el calendario:
  * CRUD turnos con eventos en el calendario
  * Crear evento al arrastrar cliente al calendario
- Estilo y UX:
  * Mejorar diseño
  * Feedback al usuario (notificaciones, loaders, etc.)
  * Responsividad
  * IMPLEMENTAR PAGINACIÓN
    ~ Estado para página actual
    ~ Petición de backend para calculo de páginas.
    ~ La última página pregunta a la siguiente si tiene datos.
    ~ Scroll de máximos clientes
- Validaciones:
  * Manejo de errores (login fallido, errores de red, etc.)
*/

const App = () => {
    return (
        <div className="app-container">
            <AppRoutes />
        </div>
    );
};

export default App;

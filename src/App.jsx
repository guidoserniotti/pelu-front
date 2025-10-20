import { useEffect, useState } from "react";
import authService from "../utils/config";
import Clients from "./components/Clients";
import Calendar from "./components/FullCalendar";
import LoginForm from "./components/LoginForm";
import loginService from "./services/login";
import "./styles/App.css";

/* TO-DO:
- Persistencia de sesión (localStorage)
- LOGOUT:
  * Limpiar token
  * Set isLogin to false
- Manejo de clientes:
  * Editar cliente (FALTA CONEXIÓN CON BACK)
  * Eliminar cliente (FALTA CONEXIÓN CON BACK)
- Conexión con backend:
  * Autenticación
  * CRUD clientes
    ~ Formatear clientData para utilizar "nombre_completo" del backend
- Manejo de eventos:
  * CRUD eventos
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await loginService.login({
                email,
                contrasena: password,
            });
            // Guardar con estructura consistente
            window.localStorage.setItem(
                "loggedUser",
                JSON.stringify({
                    email: email,
                    token: user.data, // user.data es el token
                })
            );
            authService.setToken(user.data);
            setIsLogin(true);
            setEmail("");
            setPassword("");
        } catch (exception) {
            console.log(exception);
            setErrorMessage(exception.response.data.message);
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
        }
    };

    const handleInvalidInput = (e) => {
        if (e.target.validity.valueMissing) {
            e.target.setCustomValidity("Este campo es obligatorio");
        } else if (e.target.validity.typeMismatch) {
            e.target.setCustomValidity("Por favor, ingrese un email válido");
        }
    };

    const handleLogOut = () => {
        const confirmLogOut = window.confirm(
            `¿Estás seguro de que deseas cerrar sesión?`
        );
        if (!confirmLogOut) return;
        window.localStorage.removeItem("loggedUser");
        window.location.reload();
    };

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            authService.setToken(user.token);
            setIsLogin(true);
        }
    }, []);

    if (!isLogin) {
        return (
            <>
                <div className="main-calendar-container">
                    <LoginForm
                        handleInvalidInput={handleInvalidInput}
                        handleSubmit={handleSubmit}
                        errorMessage={errorMessage}
                        email={email}
                        password={password}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        mailError={emailError}
                        passwordError={passwordError}
                        setEmailError={setEmailError}
                        setPasswordError={setPasswordError}
                    />
                </div>
            </>
        );
    }
    return (
        <>
            <div className="main-calendar-container">
                <Clients handleLogOut={handleLogOut} />
                <Calendar />
            </div>
        </>
    );
};

export default App;

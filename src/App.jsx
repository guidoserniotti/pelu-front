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
  const [isLogin, setIsLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    errors: {
      email: [],
      password: [],
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        email: loginData.email,
        contrasena: loginData.password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      // limpiar errores al loguear correctamente
      setLoginData((prev) => ({
        ...prev,
        errors: { email: [], password: [] },
      }));
      setIsLogin(true);
    } catch (exception) {
      // Mapear mensajes de validación del backend a los inputs correspondientes
      const backendMessages = exception?.response?.data?.message;
      const messagesArray = Array.isArray(backendMessages)
        ? backendMessages
        : backendMessages
        ? [backendMessages]
        : [];

      const emailErrors = [];
      const passwordErrors = [];
      if (messagesArray.length === 0) {
        emailErrors.push("Error desconocido. Por favor, intente nuevamente.");
      }
      const singleMsgLower =
        messagesArray.length === 1 ? String(messagesArray[0]) : "";
      if (
        messagesArray.length === 1 &&
        singleMsgLower.includes("Email o contrasena invalidos.")
      ) {
        emailErrors.push(messagesArray[0]);
      } else {
        messagesArray.forEach((msg) => {
          const lower = String(msg).toLowerCase();

          if (lower.includes("email")) emailErrors.push(msg);
          if (lower.includes("contrase") || lower.includes("password"))
            passwordErrors.push(msg);
        });
      }
      setLoginData((prev) => ({
        ...prev,
        errors: {
          email: emailErrors,
          password: passwordErrors,
        },
      }));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "email" && loginData.errors.email?.length) {
      setLoginData((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          email: [],
        },
      }));
    }
    if (name === "password" && loginData.errors.password?.length) {
      setLoginData((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          password: [],
        },
      }));
    }
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
            handleSubmit={handleSubmit}
            loginData={loginData}
            handleChange={handleChange}
          />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="main-calendar-container">
        <div className="main-calendar-container">
          <Clients handleLogOut={handleLogOut} />
          <Calendar />
        </div>
      </div>
    </>
  );
};

export default App;

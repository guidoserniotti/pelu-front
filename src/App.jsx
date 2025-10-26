import { useEffect, useState } from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import authService from "./utils/config";
import Clients from "./pages/Clients";
import LoginForm from "./pages/LoginForm";
import ProtectedRoute from "./pages/ProtectedRoute";
import loginService from "./services/login";
import "./styles/App.css";
import windowLogOut from "./utils/NotificationWindows/ConfirmLogOut";
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
  const navigate = useNavigate();
  const location = useLocation();
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

      // Guardar con estructura consistente
      window.localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          email: loginData.email,
          token: user.data, // user.data es el token
        })
      );
      authService.setToken(user.data);
      setLoginData((prev) => ({
        ...prev,
        errors: { email: [], password: [] },
      }));
      setIsLogin(true);
      const redirectTo = location.state?.from?.pathname || "/clients";
      navigate(redirectTo, { replace: true });
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

  const handleLogOut = async () => {
    const LogOut = await windowLogOut(
      `¿Estás seguro de que deseas cerrar sesión?`
    );
    if (!LogOut) return;
    window.localStorage.removeItem("loggedUser");
    setIsLogin(false);
    navigate("/login", { replace: true });
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
      navigate("/clients");
    }
  }, []);

  return (
    <div className="main-calendar-container">
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <LoginForm
              handleSubmit={handleSubmit}
              loginData={loginData}
              handleChange={handleChange}
            />
          }
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute isAllowed={isLogin} />}>
          <Route
            path="/clients"
            element={<Clients handleLogOut={handleLogOut} />}
          />
        </Route>

        {/* Root redirect depending on auth */}
        <Route
          path="/"
          element={<Navigate to={isLogin ? "/clients" : "/login"} replace />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;

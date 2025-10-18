import { useState } from "react";
import Clients from "./components/Clients";
import Calendar from "./components/FullCalendar";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";

import "./styles/App.css";

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
  const [client, setClient] = useState([
    {
      title: "Cliente 1",
      start: "2023-10-05T10:00:00",
      end: "2023-10-05T12:00:00",
      editable: true,
    },
    {
      title: "Cliente 2",
      start: "2023-10-06T10:00:00",
      end: "2023-10-06T12:00:00",
      editable: true,
    },
  ]);

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
        <Clients client={client} setClient={setClient} />
        <Calendar />
      </div>
    </>
  );
};

export default App;

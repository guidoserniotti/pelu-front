import { useState } from "react";
import Clients from "./components/Clients";
import Calendar from "./components/FullCalendar";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";

import "./styles/App.css";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
        email,
        contrasena: password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      setUser(user);
      setIsLogin(true);
      console.log(user);
      console.log("Login exitoso");
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
        <Clients client={client} setClient={setClient} />
        <Calendar />
      </div>
    </>
  );
};

export default App;

import React, { useState } from "react";
import "./styles/App.css";
import logo from "../assets/img/logo.jpg";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Acá agregar la lógica para el login
        try {
            const user = await loginService.login({
                email,
                contrasena: password,
            });
            window.localStorage.setItem("loggedUser", JSON.stringify(user));
            setUser(user);
            setEmail("");
            setPassword("");
        } catch (exeption) {
            setErrorMessage("Usuario o contraseña invalidas");
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
                {/* NAVBAR COMENTADA, NO TIENE USO TODAVÍA */}
                {/* <nav className="navbar"><div className="nav-links"><a href="#turnos">Turnos</a><a href="#calendario">Calendario</a></div></nav>*/}
                <div className="main-container">
                    <div className="logo">
                        <img src={logo} alt="Logo" />
                    </div>
                    <form className="login-box" onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <Notification messageError={errorMessage} />
                        <input
                            id="email"
                            type="email"
                            onInvalid={handleInvalidInput}
                            placeholder="ejemplo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onInput={(e) => e.target.setCustomValidity("")}
                            required
                        />

                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={!email || !password}>
                            Ingresar
                        </button>

                        <a href="#forgot-password" className="forgot-password">
                            ¿Olvidaste la contraseña?
                        </a>
                    </form>
                </div>
            </>
        );
    }

    return (
        <div>
            <h1>Bienvenido {user.name}</h1>
        </div>
    );
};

export default App;

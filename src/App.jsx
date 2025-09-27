import React, { useState } from "react";
import "./styles/App.css";
import logo from "./assets/logo.jpg";
import loginService from "./services/login";
const App = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Acá agregar la lógica para el login
        try {
            const user = await loginService.login({
                email,
                password,
            });
            window.localStorage.setItem("loggedUser", JSON.stringify(user));
            setUser(user);
            setEmail("");
            setPassword("");
        } catch (exeption) {
            setErrorMessage("Usuario o contraseña invalidas");
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    return (
        <>
            {/* NAVBAR COMENTADA, NO TIENE USO TODAVÍA */}
            {/* <nav className="navbar"><div className="nav-links"><a href="#turnos">Turnos</a><a href="#calendario">Calendario</a></div></nav>*/}
            {user && <p>Bienvenido {user.name}</p>}
            <div className="login-container">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <form className="login-box" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="ejemplo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
};

export default App;

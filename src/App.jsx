import React, { useState } from "react";
import "./styles/App.css";
import logo from "./assets/logo.jpg";

const App = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Acá agregar la lógica para el login
        alert(`Login con Email: ${email} y Contraseña: ${password}`);
    };

    return (
        <>
            {/* NAVBAR COMENTADA, NO TIENE USO TODAVÍA */}
            {/* <nav className="navbar"><div className="nav-links"><a href="#turnos">Turnos</a><a href="#calendario">Calendario</a></div></nav>*/}
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

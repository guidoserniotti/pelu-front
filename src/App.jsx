import { useState } from "react";
import Clients from "./components/Clients";
import Calendar from "./components/FullCalendar";
import loginService from "./services/login";
import "./styles/App.css";

const App = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
                <div className="main-calendar-container">
                    <Clients />
                    <Calendar />
                </div>
            </>
        );
    }
};

export default App;

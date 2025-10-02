import logo from "../../assets/img/logo.jpg";
import Notification from "../components/Notification";

const LoginForm = ({
    handleInvalidInput,
    handleSubmit,
    errorMessage,
    email,
    password,
    setEmail,
    setPassword,
}) => {
    return (
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
    );
};
export default LoginForm;

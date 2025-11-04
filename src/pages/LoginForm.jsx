import logo from "../../assets/img/logo.jpg";
import Notification from "../components/Notification";
import "../styles/login.css";

const LoginForm = ({
    handleSubmit,
    loginData: { email, password, errors },
    handleChange,
}) => {
    return (
        <div className="login-page-container">
            <div className="login-left">
                <img className="login-logo" src={logo} alt="Logo" />
            </div>
            <div className="login-right">
                <form className="login-box" onSubmit={handleSubmit}>
                    <h2 className="login-title">Iniciar Sesión</h2>
                    <div className="login-data">
                        <label className="login-data-label">Email</label>
                        <Notification
                            message={errors.email}
                            className="login-data-notification"
                        />
                        <input
                            className="login-data-input"
                            type="text"
                            placeholder="ejemplo@ejemplo.com"
                            value={email}
                            name="email"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="login-data">
                        <label className="login-data-label">Contraseña</label>
                        <Notification
                            message={errors.password}
                            className="login-data-notification"
                        />
                        <input
                            className="login-data-input"
                            type="password"
                            value={password}
                            name="password"
                            onChange={handleChange}
                            placeholder="********"
                        />
                    </div>

                    <button
                        className="login-data-btn"
                        type="submit"
                        disabled={!email || !password}
                    >
                        Ingresar
                    </button>

                    <a href="#forgot-password" className="forgot-password">
                        ¿Olvidaste la contraseña?
                    </a>
                </form>
            </div>
        </div>
    );
};
export default LoginForm;

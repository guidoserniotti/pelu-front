import logo from "../../assets/img/logo.jpg";
import Notification from "../components/Notification";

const LoginForm = ({
    handleSubmit,
    loginData: { email, password, errors },
    handleChange,
}) => {
    return (
        <div className="main-container">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <form className="login-box" onSubmit={handleSubmit}>
                <label>Email</label>
                <Notification
                    message={errors.email}
                    className="error-notification"
                />
                <input
                    type="text"
                    placeholder="ejemplo@ejemplo.com"
                    value={email}
                    name="email"
                    onChange={handleChange}
                />

                <label>Contraseña</label>
                <Notification
                    message={errors.password}
                    className="error-notification"
                />
                <input
                    type="password"
                    value={password}
                    name="password"
                    onChange={handleChange}
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

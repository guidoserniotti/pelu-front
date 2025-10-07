import logo from "../../assets/img/logo.jpg";
import Notification from "../components/Notification";

const LoginForm = ({
  handleInvalidInput,
  handleSubmit,
  // now accept per-field errors and setters
  emailError,
  passwordError,
  setEmailError,
  setPasswordError,
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
        <Notification message={emailError} />
        <input
          id="email"
          type="text"
          onInvalid={handleInvalidInput}
          placeholder="ejemplo@ejemplo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // clear field-specific error when user types
            if (setEmailError) setEmailError("");
          }}
          onInput={(e) => {
            e.target.setCustomValidity("");
            if (setEmailError) setEmailError("");
          }}
        />

        <label htmlFor="password">Contraseña</label>
        <Notification message={passwordError} />
        <input
          id="password"
          type="password"
          placeholder=""
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (setPasswordError) setPasswordError("");
          }}
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

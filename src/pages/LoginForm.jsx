import logo from "../../assets/img/logo.jpg";
import Notification from "../components/Notification";
import Toast from "../utils/NotificationWindows/Toast";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import loginService from "../services/login";
import { useAuth } from "../auth/AuthContext";
import "../styles/login.css";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema de validación con Zod
const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "El email no puede estar vacío" })
        .email({ message: "Formato de email no válido" })
        .max(32, { message: "El email no debe exceder los 32 caracteres" })
        .transform((val) => val.trim().toLowerCase()), // Sanitización
    password: z
        .string()
        .min(1, { message: "La contraseña no puede estar vacía" })
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .max(32, {
            message: "La contraseña no debe exceder los 32 caracteres",
        }),
});

const LoginForm = () => {
    const { login } = useAuth();
    const location = useLocation();
    const [serverError, setServerError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onBlur", // Valida cuando el usuario sale del campo
    });

    const onSubmit = async (data) => {
        setServerError(null); // Limpiar errores previos
        try {
            const user = await loginService.login({
                email: data.email,
                contrasena: data.password,
            });
            login(
                JSON.stringify({
                    id: user.id,
                    token: user.data,
                    email: data.email,
                    role: user.role,
                })
            );
        } catch (exception) {
            console.error("Error de login:", exception);
            const errorMessage =
                exception.response?.data?.message || "Error al iniciar sesión";
            setServerError(errorMessage);
            setTimeout(() => {
                setServerError(null);
            }, 3800);
        }
    };

    // Mostrar toast (si viene del logout) apenas se monta/entra
    const { toastPayload: ctxToast, clearToast } = useAuth();
    useEffect(() => {
        const locToast = location?.state?.toast;
        console.log(
            "LoginForm: location.state=",
            location?.state,
            " | ctxToast=",
            ctxToast
        );

        // Priorizar el toast del contexto (AuthProvider), si existe
        if (ctxToast?.icon && ctxToast?.title) {
            Toast(ctxToast.icon, ctxToast.title);
            // Limpiar para que no se vuelva a mostrar
            clearToast();
            return;
        }

        // Fallback: si viene por location.state
        if (locToast?.icon && locToast?.title) {
            Toast(locToast.icon, locToast.title);
        }
    }, [location, ctxToast, clearToast]);
    return (
        <div className="login-page-container">
            <div className="login-left">
                <img className="login-logo" src={logo} alt="Logo" />
            </div>
            <div className="login-right">
                <form className="login-box" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="login-title">Iniciar Sesión</h2>
                    <Notification
                        message={serverError}
                        className="login-data-notification server-error"
                    />
                    <div className="login-data">
                        <label className="login-data-label">Email</label>
                        <Notification
                            message={errors.email?.message}
                            className="login-data-notification"
                        />
                        <input
                            className="login-data-input"
                            type="email"
                            placeholder="ejemplo@ejemplo.com"
                            {...register("email")}
                            autoComplete="email"
                        />
                    </div>

                    <div className="login-data">
                        <label className="login-data-label">Contraseña</label>
                        <Notification
                            message={errors.password?.message}
                            className="login-data-notification"
                        />
                        <input
                            className="login-data-input"
                            type="password"
                            placeholder="********"
                            {...register("password")}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        className="login-data-btn"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Ingresando..." : "Ingresar"}
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

import logo from "../../assets/img/logo.jpg";
import Notification from "../components/Notification";
import loginService from "../services/login";
import { useAuth } from "../auth/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { promiseToast } from "../utils/toastify/toastConfig";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "El email no puede estar vacio" })
        .email({ message: "Formato de email no valido" })
        .max(32, { message: "El email no debe exceder los 32 caracteres" })
        .transform((val) => val.trim().toLowerCase()),
    password: z
        .string()
        .min(1, { message: "La contrasena no puede estar vacia" })
        .min(8, { message: "La contrasena debe tener al menos 8 caracteres" })
        .max(32, {
            message: "La contrasena no debe exceder los 32 caracteres",
        }),
});

const inputClasses =
    "w-full rounded-md border border-divider bg-base p-3 font-sans text-base text-content-primary placeholder-content-secondary transition-colors focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15";

const labelClasses =
    "text-[0.85rem] font-semibold uppercase tracking-wider text-content-secondary";

const LoginForm = () => {
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data) => {
        try {
            const user = await promiseToast(
                loginService.login({
                    email: data.email,
                    contrasena: data.password,
                }),
                "AUTH_LOGIN"
            );
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
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center px-4 text-content-primary">
            <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
            {/* Logo */}
            <div className="flex shrink-0 items-center justify-center">
                <img
                    className="w-40 rounded-full shadow-card md:w-56"
                    src={logo}
                    alt="Logo"
                />
            </div>

            {/* Formulario */}
            <div className="flex w-full max-w-[400px] items-center justify-center">
                <form
                    className="flex w-full flex-col gap-5 rounded-lg border border-divider bg-surface p-8 shadow-card md:p-10"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h2 className="mb-1 font-title text-xl font-bold uppercase tracking-widest text-content-primary md:text-[1.4rem]">
                        Iniciar Sesion
                    </h2>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>Email</label>
                        <input
                            className={inputClasses}
                            type="email"
                            placeholder="ejemplo@ejemplo.com"
                            {...register("email")}
                            autoComplete="email"
                        />
                        <Notification message={errors.email?.message} />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>Contrasena</label>
                        <input
                            className={inputClasses}
                            type="password"
                            placeholder="********"
                            {...register("password")}
                            autoComplete="current-password"
                        />
                        <Notification message={errors.password?.message} />
                    </div>

                    {/* Submit */}
                    <button
                        className="w-full cursor-pointer rounded-md bg-accent p-3 font-title text-lg font-bold text-base transition-all hover:brightness-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </div>
            </div>
        </div>
    );
};
export default LoginForm;

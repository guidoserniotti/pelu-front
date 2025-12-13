import { toast, Slide } from "react-toastify";
import {
    PROMISE_MESSAGES,
    VALIDATION_MESSAGES,
    INSTANT_MESSAGES,
} from "./toastMessages";

/**
 * Toast personalizado usando react-toastify
 * @param {string} type - Tipo: "success", "error", "info", "warning"
 * @param {string} message - Mensaje a mostrar
 * @param {object} options - Opciones adicionales
 */
export const showToast = (type, message, options = {}) => {
    const defaultOptions = {
        position: "top-center",
        autoClose: 2500,
        limit: 3,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: false,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "dark",
        transition: Slide,
        ...options,
    };

    switch (type) {
        case "success":
            toast.success(message, defaultOptions);
            break;
        case "error":
            toast.error(message, defaultOptions);
            break;
        case "info":
            toast.info(message, defaultOptions);
            break;
        case "warning":
            toast.warning(message, defaultOptions);
            break;
        default:
            toast(message, defaultOptions);
            break;
    }
};

/**
 * Toast para promesas con mensajes predefinidos
 * @param {Promise} promise - La promesa a ejecutar
 * @param {string|Object} messageKey - Clave del mensaje en PROMISE_MESSAGES o objeto custom
 * @param {string} [toastId] - ID opcional para prevenir duplicados
 * @returns {Promise} - La promesa original
 *
 * @example
 * await promiseToast(
 *   shiftsService.editarTurno(id, data),
 *   'TURNO_UPDATE'
 * );
 *
 * @example
 * await promiseToast(
 *   shiftsService.eliminarTurno(id),
 *   {
 *     pending: 'Eliminando...',
 *     success: 'Eliminado',
 *     error: 'Error al eliminar'
 *   }
 * );
 */
export const promiseToast = (promise, messageKey, toastId = null) => {
    // Obtener mensajes predefinidos o usar custom
    const messages =
        typeof messageKey === "string"
            ? PROMISE_MESSAGES[messageKey]
            : messageKey;

    if (!messages) {
        console.error(`[promiseToast] Mensaje no encontrado: ${messageKey}`);
        return promise;
    }

    const promiseOptions = {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        draggable: true,
        pauseOnHover: true,
        theme: "dark",
        transition: Slide,
    };

    // Agregar toastId si se proporciona
    if (toastId) {
        promiseOptions.toastId = toastId;
    }

    // Configurar los mensajes con manejo de errores del backend
    const toastConfig = {
        pending: messages.pending,
        success: messages.success,
        error: {
            render({ data }) {
                // Extraer mensaje de error del backend si existe
                const errorMessage =
                    data?.response?.data?.message ||
                    data?.message ||
                    messages.error;
                return errorMessage;
            },
        },
    };

    return toast.promise(promise, toastConfig, promiseOptions);
};

/**
 * Muestra un mensaje de validación desde el diccionario
 * @param {string} validationKey - Clave del mensaje en VALIDATION_MESSAGES
 *
 * @example
 * showValidation('FECHA_PASADA');
 * showValidation('NO_CLIENTES');
 */
export const showValidation = (validationKey) => {
    const message = VALIDATION_MESSAGES[validationKey];
    if (!message) {
        console.error(
            `[showValidation] Mensaje no encontrado: ${validationKey}`
        );
        return;
    }
    showToast("error", message, { toastId: validationKey });
};

/**
 * Muestra un mensaje instantáneo desde el diccionario
 * @param {string} messageKey - Clave del mensaje en INSTANT_MESSAGES
 * @param {any} param - Parámetro opcional para mensajes dinámicos
 *
 * @example
 * showInstantMessage('CLIENTES_CARGADOS');
 * showInstantMessage('CLIENTE_CREADO', 'Juan Pérez');
 */
export const showInstantMessage = (messageKey, param = null) => {
    const message = INSTANT_MESSAGES[messageKey];
    if (!message) {
        console.error(
            `[showInstantMessage] Mensaje no encontrado: ${messageKey}`
        );
        return;
    }

    // Si el mensaje es una función, llamarla con el parámetro
    const finalMessage =
        typeof message === "function" ? message(param) : message;

    // Determinar el tipo de toast según la clave
    let type = "info";
    if (
        messageKey.includes("CREADO") ||
        messageKey.includes("ACTUALIZADO") ||
        messageKey.includes("MODIFICADO") ||
        messageKey.includes("CERRADA")
    ) {
        type = "success";
    } else if (messageKey.includes("ELIMINADO")) {
        type = "success";
    } else if (messageKey.includes("EXPIRADA")) {
        type = "warning";
    } else if (messageKey.includes("ERROR")) {
        type = "error";
    }

    showToast(type, finalMessage);
};

export default showToast;

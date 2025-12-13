/**
 * Mensajes centralizados para toast.promise
 * Cada mensaje tiene: pending, success, error
 */

export const PROMISE_MESSAGES = {
    // TURNOS
    TURNO_UPDATE: {
        pending: "Actualizando turno...",
        success: "Turno actualizado exitosamente",
        error: "Error al actualizar turno",
    },
    TURNO_CREATE: {
        pending: "Creando turno...",
        success: "Turno creado exitosamente",
        error: "Error al crear turno",
    },
    TURNO_DELETE: {
        pending: "Eliminando turno...",
        success: "Turno eliminado",
        error: "Error al eliminar turno",
    },
    TURNO_LOAD: {
        pending: "Cargando turnos...",
        success: "Turnos cargados",
        error: "Error al cargar turnos",
    },

    // CLIENTES
    CLIENT_CREATE: {
        pending: "Creando cliente...",
        success: "Cliente creado exitosamente",
        error: "Error al crear cliente",
    },
    CLIENT_UPDATE: {
        pending: "Actualizando cliente...",
        success: "Cliente actualizado exitosamente",
        error: "Error al actualizar cliente",
    },
    CLIENT_DELETE: {
        pending: "Eliminando cliente...",
        success: "Cliente eliminado",
        error: "Error al eliminar cliente",
    },
    CLIENT_LOAD: {
        pending: "Cargando clientes...",
        success: "Clientes cargados",
        error: "Error al cargar clientes",
    },

    // AUTENTICACIÓN
    AUTH_LOGIN: {
        pending: "Iniciando sesión...",
        success: "Sesión iniciada correctamente",
        error: "Error al iniciar sesión",
    },
    AUTH_LOGOUT: {
        pending: "Cerrando sesión...",
        success: "Sesión cerrada correctamente",
        error: "Error al cerrar sesión",
    },
};

/**
 * Mensajes para validaciones y notificaciones instantáneas
 */
export const VALIDATION_MESSAGES = {
    FECHA_PASADA: "No se pueden crear turnos en fechas u horas pasadas",
    TURNO_MOVER_PASADO: "No se pueden mover turnos a fechas u horas pasadas",
    TURNO_REDIMENSIONAR_PASADO:
        "No se pueden redimensionar turnos a fechas u horas pasadas",
    NO_CLIENTES:
        "No hay clientes disponibles. Por favor, agregue clientes primero.",
    CLIENTE_NO_IDENTIFICADO:
        "No se pudo identificar el cliente. Por favor, recargue la página.",
};

/**
 * Mensajes instantáneos para otras acciones
 */
export const INSTANT_MESSAGES = {
    // AUTENTICACIÓN
    SESION_EXPIRADA: "Sesión expirada",
    SESION_CERRADA: "Sesión cerrada correctamente",
};

/**
 * Mensajes dinámicos con nombres personalizados
 */
export const createDynamicMessage = {
    // TURNOS
    turnoDeleted: (clientName) => ({
        pending: `Eliminando turno de ${clientName}...`,
        success: `Turno de ${clientName} eliminado`,
        error: `Error al eliminar turno de ${clientName}`,
    }),
    shiftCreate: (clientName) => ({
        pending: `Creando turno para ${clientName}...`,
        success: `Turno para ${clientName} creado exitosamente`,
        error: `Error al crear turno para ${clientName}`,
    }),
    shiftUpdate: (clientName) => ({
        pending: `Actualizando turno de ${clientName}...`,
        success: `Turno de ${clientName} actualizado exitosamente`,
        error: `Error al actualizar turno de ${clientName}`,
    }),

    // CLIENTES
    clientDeleted: (clientName) => ({
        pending: `Eliminando cliente ${clientName}...`,
        success: `Cliente ${clientName} eliminado`,
        error: `Error al eliminar cliente ${clientName}`,
    }),
    clientEdit: (clientName) => ({
        pending: `Actualizando cliente ${clientName}...`,
        success: `Cliente ${clientName} actualizado exitosamente`,
        error: `Error al actualizar cliente ${clientName}`,
    }),
    clientAdd: (clientName) => ({
        pending: `Creando cliente ${clientName}...`,
        success: `Cliente ${clientName} creado exitosamente`,
        error: `Error al crear cliente ${clientName}`,
    }),
};

import axios from "../utils/axiosConfig";
import authService from "../utils/config";

const baseUrl = "/api/turno";

const registrarTurno = async (
    inicio,
    final,
    observaciones,
    id_cliente,
    esSobreturno = false
) => {
    const usuario_id = authService.getUserId();

    if (!usuario_id) {
        throw new Error(
            "No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente."
        );
    }

    const payload = {
        fecha_hora_inicio_turno: inicio,
        fecha_hora_fin_turno: final,
        cliente_id: id_cliente,
        usuario_id: usuario_id,
        es_sobreturno: esSobreturno,
    };

    // Solo incluir observaciones si no está vacío y tiene al menos 4 caracteres
    if (observaciones && observaciones.trim().length >= 4) {
        payload.observaciones = observaciones.trim();
    }

    const response = await axios.post(`${baseUrl}/registrar`, payload);
    return response.data;
};

const listarTurnos = async (fecha_inicio, fecha_fin) => {
    const response = await axios.get(`${baseUrl}/listar`, {
        params: {
            fecha_inicio,
            fecha_fin,
        },
    });
    return response.data;
};

export default {
    registrarTurno,
    listarTurnos,
};

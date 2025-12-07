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

    const response = await axios.post(`${baseUrl}/registrar`, {
        fecha_hora_turno_inicio: inicio,
        fecha_hora_turno_final: final,
        observaciones: observaciones,
        cliente_id: id_cliente,
        usuario_id: usuario_id,
        es_sobreturno: esSobreturno,
    });
    return response.data;
};

export default {
    registrarTurno,
};

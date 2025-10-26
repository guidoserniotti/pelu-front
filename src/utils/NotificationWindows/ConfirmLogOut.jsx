import Swal from "sweetalert2";

const confirmLogOut = async (message) => {
  const result = await Swal.fire({
    title: message.title || "¿Estás seguro?",
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });
  return result.isConfirmed;
};
export default confirmLogOut;

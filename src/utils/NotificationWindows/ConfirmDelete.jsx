import Swal from "sweetalert2";

const confirmDelete = async (title) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: `¿Deseas eliminar a ${title}?`,
    icon: "warning",
    showCancelButton: true,
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });
  if (result.isConfirmed) {
    Swal.fire({
      title: "¡Eliminado!",
      text: `${title} ha sido eliminado.`,
      icon: "success",
    });
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    Swal.fire({
      title: "Cancelado",
      text: `${title} está a salvo :)`,
      icon: "error",
    });
  }
  console.log(result);
  return result.isConfirmed;
};

export default confirmDelete;

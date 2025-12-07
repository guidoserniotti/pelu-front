import ThemedSwal from "../swalTheme";

const confirmDelete = async (title) => {
    const result = await ThemedSwal.fire({
        title: "¿Estás seguro?",
        text: `¿Deseas eliminar a ${title}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
    });
    if (result.isConfirmed) {
        ThemedSwal.fire({
            title: "¡Eliminado!",
            text: `${title} ha sido eliminado.`,
            icon: "success",
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        ThemedSwal.fire({
            title: "Cancelado",
            text: `${title} está a salvo :)`,
            icon: "error",
        });
    }
    return result.isConfirmed;
};

export default confirmDelete;

import ThemedSwal from "../swalTheme";

const confirmDelete = async (title, isClient = true) => {
    const result = await ThemedSwal.fire({
        title: "¿Estás seguro?",
        text: `${
            isClient
                ? "Eliminar un cliente también eliminará todos sus turnos asociados. "
                : `¿Deseas eliminar ${title}?`
        }`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
    });
    return result.isConfirmed;
};

export default confirmDelete;

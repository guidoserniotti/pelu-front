import ThemedSwal from "../swalTheme";

const confirmModify = async (title) => {
    const result = await ThemedSwal.fire({
        title: "¿Estás seguro?",
        text: `¿Deseás modificar el turno de ${title}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, modificar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
    });

    return result.isConfirmed;
};
export default confirmModify;

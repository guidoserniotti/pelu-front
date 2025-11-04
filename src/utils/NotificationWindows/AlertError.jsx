import ThemedSwal from "../swalTheme";

const AlertError = async (message, errorList = []) => {
    ThemedSwal.fire({
        icon: "error",
        title: "Error",
        text: message,
        footer: errorList.length
            ? `<ul>${errorList.map((err) => `<li>${err}</li>`).join("")}</ul>`
            : "",
    });
};
export default AlertError;

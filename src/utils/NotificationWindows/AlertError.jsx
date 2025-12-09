import ThemedSwal from "../swalTheme";

// Escapa caracteres especiales para evitar inyección al usar html/footer
const escapeHtml = (str) =>
    String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const AlertError = async (message, errorList = []) => {
    const safeMsg = escapeHtml(message ?? "");
    const safeList = Array.isArray(errorList)
        ? errorList.map((e) => escapeHtml(e))
        : [];

    const footerHtml = safeList.length
        ? `<ul class="swal-footer-error-list">${safeList
              .map((err) => `<li>${err}</li>`)
              .join("")}</ul>`
        : "";

    await ThemedSwal.fire({
        icon: "error",
        title: "Error",
        html: `<p class="swal-error-msg">${safeMsg}</p><p class="swal-error-help">🛠️ <strong>Contactá soporte</strong></p>`,
        footer: footerHtml,
        confirmButtonText: "Cerrar",
    });
};
export default AlertError;

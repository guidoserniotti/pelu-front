import Swal from "sweetalert2";
import "../styles/swal.css";

// Reusable themed Swal instance using our palette and custom classes
const ThemedSwal = Swal.mixin({
    customClass: {
        popup: "swal-theme-popup",
        title: "swal-theme-title",
        htmlContainer: "swal-theme-text",
        confirmButton: "swal-theme-confirm",
        cancelButton: "swal-theme-cancel",
        actions: "swal-theme-actions",
        validationMessage: "swal-theme-validation",
    },
    buttonsStyling: false,
    showClass: { popup: "swal-theme-show" },
    hideClass: { popup: "swal-theme-hide" },
});

export default ThemedSwal;

import Swal from "sweetalert2";
import "../styles/swal.css";
const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: "white",
    customClass: {
        popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
});
export default Toast;

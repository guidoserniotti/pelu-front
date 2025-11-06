import ThemeToast from "../swalThemeToast";

const Toast = async (icon, title, timer = 3000) => {
    await ThemeToast.fire({
        icon,
        title,
        timer,
    });
};

export default Toast;

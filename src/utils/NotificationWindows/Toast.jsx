import ThemeToast from "../swalThemeToast";

// Flexible Toast: accepts (icon, title, timer) or (icon, title, options)
const Toast = async (icon, title, thirdArg) => {
    const options =
        typeof thirdArg === "number"
            ? { timer: thirdArg }
            : typeof thirdArg === "object" && thirdArg !== null
            ? thirdArg
            : { timer: 2000 };

    await ThemeToast.fire({
        icon,
        title,
        ...options,
    });
};

export default Toast;

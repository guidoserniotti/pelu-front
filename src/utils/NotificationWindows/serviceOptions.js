export const SERVICE_OPTIONS = [
    {
        value: "corte_masculino",
        label: "Corte masculino",
        color: "#1e88e5",
    },
    {
        value: "corte_femenino",
        label: "Corte femenino",
        color: "#ec407a",
    },
    {
        value: "color",
        label: "Color",
        color: "#26a69a",
    },
    {
        value: "unas",
        label: "Uñas",
        color: "#43a047",
    },
    {
        value: "protesis",
        label: "Prótesis",
        color: "#fb8c00",
    },
    {
        value: "salidas_de_caja",
        label: "Salidas de caja",
        color: "#fdd835",
    },
    {
        value: "extras",
        label: "Extras",
        color: "#757575",
    },
    {
        value: "cierre_de_caja",
        label: "Cierre de caja",
        color: "#7e57c2",
    },
    {
        value: "deudores",
        label: "Deuda",
        color: "#e53935",
    },
];

export const getServiceByValue = (value) =>
    SERVICE_OPTIONS.find((service) => service.value === value) || null;

export const getServiceByColor = (color) =>
    SERVICE_OPTIONS.find((service) => service.color === color) || null;
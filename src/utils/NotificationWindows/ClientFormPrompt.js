import ThemedSwal from "../swalTheme";
import { z } from "zod";

// Validación de teléfono argentino
const isValidArgentinePhone = (phone) => {
    // Remover el + si existe para validar
    const cleanPhone = phone.replace(/^\+/, "");

    // Formatos válidos para Argentina:
    // +54 9 11 1234-5678 (móvil CABA)
    // +54 9 351 123-4567 (móvil Córdoba)
    // +54 11 1234-5678 (fijo CABA)
    // +54 351 123-4567 (fijo Córdoba)

    // Debe empezar con 54 (código de Argentina)
    if (!cleanPhone.startsWith("54")) {
        return false;
    }

    // Después del 54, debe tener entre 8 y 13 dígitos más
    // (código de área + número)
    const remainingDigits = cleanPhone.slice(2);
    const digitCount = remainingDigits.length;

    // Validar que tenga la longitud correcta (mín 8, máx 13)
    return digitCount >= 8 && digitCount <= 13;
};

// Schema de validación con Zod (basado en el DTO del backend)
const clientSchema = z.object({
    nombre_completo: z
        .string()
        .min(1, { message: "El nombre del cliente no puede estar vacío" })
        .min(2, {
            message:
                "El nombre del cliente debe contener al menos 2 caracteres",
        })
        .max(32, {
            message: "El nombre del cliente no debe exceder los 32 caracteres",
        })
        .transform((val) => val.trim()),
    telefono: z
        .string()
        .min(1, { message: "El teléfono del cliente no puede estar vacío" })
        .min(2, {
            message:
                "El teléfono del cliente debe contener al menos 2 caracteres",
        })
        .max(16, {
            message:
                "El teléfono del cliente no debe exceder los 16 caracteres",
        })
        .regex(/^\+?\d+$/, {
            message: "El teléfono solo puede contener números",
        })
        .transform((val) => {
            // Asegurar que siempre empiece con +
            const cleaned = val.replace(/\+/g, "");
            return `+${cleaned}`;
        })
        .refine(isValidArgentinePhone, {
            message: "El número ingresado no es válido para Argentina",
        }),
});

const buildHtml = (name = "", phone = "") => {
    // Remover el + del phone si existe para mostrarlo solo en el prefijo
    const phoneNumber = phone.startsWith("+") ? phone.slice(1) : phone;
    return `
  <input 
    type="text" 
    id="client-name" 
    class="swal2-input" 
    placeholder="Nombre y apellido" 
    value="${name.replace(/"/g, "&quot;")}">
  <div style="position: relative; display: inline-block; width: 100%;">
    <input 
      type="tel" 
      id="client-phone" 
      class="swal2-input" 
      placeholder="+54 11 1234 5678" 
      value="${phoneNumber.replace(/"/g, "&quot;")}" 
      style="
        padding-left: 30px !important;
      ">
  </div>
`;
};

const handlePhoneInput = (phoneInput) => {
    // Evitar que se borre el + y solo permitir números
    phoneInput.addEventListener("input", (e) => {
        let value = e.target.value;
        // Remover cualquier carácter que no sea número
        value = value.replace(/[^\d]/g, "");
        e.target.value = value;
    });

    // Prevenir que se pegue contenido inválido
    phoneInput.addEventListener("paste", (e) => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData(
            "text"
        );
        const cleaned = pastedText.replace(/[^\d]/g, "");
        phoneInput.value = cleaned;
    });
};

export async function promptAddClient() {
    let nameInput, phoneInput;
    const result = await ThemedSwal.fire({
        title: "Agregar Cliente",
        html: buildHtml(),
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        focusConfirm: false,
        didOpen: () => {
            const popup = ThemedSwal.getPopup();
            nameInput = popup.querySelector("#client-name");
            phoneInput = popup.querySelector("#client-phone");

            handlePhoneInput(phoneInput);

            nameInput.onkeyup = (e) =>
                e.key === "Enter" && ThemedSwal.clickConfirm();
            phoneInput.onkeyup = (e) =>
                e.key === "Enter" && ThemedSwal.clickConfirm();
        },
        preConfirm: () => {
            const nombre_completo = nameInput.value.trim();
            const telefono = phoneInput.value.trim();

            // Validar con Zod
            const validation = clientSchema.safeParse({
                nombre_completo,
                telefono,
            });

            if (!validation.success) {
                const errors = validation.error.flatten().fieldErrors;
                const firstError =
                    errors.nombre_completo?.[0] ||
                    errors.telefono?.[0] ||
                    "Error de validación";
                ThemedSwal.showValidationMessage(firstError);
                return false;
            }

            return validation.data;
        },
    });
    if (result.isConfirmed) return result.value;
    return null;
}

export async function promptEditClient(initial) {
    let nameInput, phoneInput;
    const initialPhone = initial?.phoneNumber || "";
    const result = await ThemedSwal.fire({
        title: "Editar Cliente",
        html: buildHtml(initial?.title || "", initialPhone),
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        focusConfirm: true,
        didOpen: () => {
            const popup = ThemedSwal.getPopup();
            nameInput = popup.querySelector("#client-name");
            phoneInput = popup.querySelector("#client-phone");

            handlePhoneInput(phoneInput);

            nameInput.onkeyup = (e) =>
                e.key === "Enter" && ThemedSwal.clickConfirm();
            phoneInput.onkeyup = (e) =>
                e.key === "Enter" && ThemedSwal.clickConfirm();
        },
        preConfirm: () => {
            const nombre_completo = nameInput.value.trim();
            const telefono = phoneInput.value.trim();

            // Validar con Zod
            const validation = clientSchema.safeParse({
                nombre_completo,
                telefono,
            });

            if (!validation.success) {
                const errors = validation.error.flatten().fieldErrors;
                const firstError =
                    errors.nombre_completo?.[0] ||
                    errors.telefono?.[0] ||
                    "Error de validación";
                ThemedSwal.showValidationMessage(firstError);
                return false;
            }

            // Evitar guardar si no cambió nada
            const normalizedInitialPhone = initialPhone.startsWith("+")
                ? initialPhone
                : `+${initialPhone}`;
            if (
                validation.data.nombre_completo === (initial?.title || "") &&
                validation.data.telefono === normalizedInitialPhone
            ) {
                ThemedSwal.showValidationMessage("No hay cambios para guardar");
                return false;
            }

            return validation.data;
        },
    });
    if (result.isConfirmed) return result.value;
    return null;
}

export default { promptAddClient, promptEditClient };

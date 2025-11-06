import ThemedSwal from "../swalTheme";

const buildHtml = (name = "", phone = "") => `
  <input type="text" id="client-name" class="swal2-input" placeholder="Nombre y apellido" value="${name.replace(
      /"/g,
      "&quot;"
  )}">
  <input type="tel" id="client-phone" class="swal2-input" placeholder="Teléfono" value="${phone.replace(
      /"/g,
      "&quot;"
  )}"><br>
`;

const isValidPhone = (value) => {
    // Permite números, espacios, guiones, paréntesis y + al inicio. Mínimo 6 dígitos reales
    const digits = (value.match(/\d/g) || []).length;
    return digits >= 6;
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
            nameInput.onkeyup = (e) =>
                e.key === "Enter" && ThemedSwal.clickConfirm();
            phoneInput.onkeyup = (e) =>
                e.key === "Enter" && ThemedSwal.clickConfirm();
        },
        preConfirm: () => {
            const nombre_completo = nameInput.value.trim();
            const telefono = phoneInput.value.trim();
            if (!nombre_completo || !telefono) {
                ThemedSwal.showValidationMessage("Completá nombre y teléfono");
                return false;
            }
            if (!isValidPhone(telefono)) {
                ThemedSwal.showValidationMessage("Ingresá un teléfono válido");
                return false;
            }
            return { nombre_completo, telefono };
        },
    });
    if (result.isConfirmed) return result.value;
    return null;
}

export async function promptEditClient(initial) {
    let nameInput, phoneInput;
    const result = await ThemedSwal.fire({
        title: "Editar Cliente",
        html: buildHtml(initial?.title || "", initial?.phoneNumber || ""),
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        focusConfirm: true,
        didOpen: () => {
            const popup = ThemedSwal.getPopup();
            nameInput = popup.querySelector("#client-name");
            phoneInput = popup.querySelector("#client-phone");
            nameInput.onkeyup = (e) =>
                e.key === "Enter" && ThemedSwal.clickConfirm();
            phoneInput.onkeyup = (e) =>
                e.key === "Enter" && ThemedSwal.clickConfirm();
        },
        preConfirm: () => {
            const nombre_completo = nameInput.value.trim();
            const telefono = phoneInput.value.trim();
            if (!nombre_completo || !telefono) {
                ThemedSwal.showValidationMessage("Completá nombre y teléfono");
                return false;
            }
            if (!isValidPhone(telefono)) {
                ThemedSwal.showValidationMessage("Ingresá un teléfono válido");
                return false;
            }
            // Evitar guardar si no cambió nada
            if (
                nombre_completo === (initial?.title || "") &&
                telefono === (initial?.phoneNumber || "")
            ) {
                ThemedSwal.showValidationMessage("No hay cambios para guardar");
                return false;
            }
            return { nombre_completo, telefono };
        },
    });
    if (result.isConfirmed) return result.value;
    return null;
}

export default { promptAddClient, promptEditClient };

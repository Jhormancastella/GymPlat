/** Almacenamiento de imagenes local mediante data URLs. */
function readFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Selecciona una imagen valida"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve({
      url: reader.result,
      publicId: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      width: null,
      height: null,
      bytes: file.size,
      format: file.type.split("/")[1] || "image",
    });
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });
}

export function uploadFile(file) { return readFile(file); }

export function uploadWithWidget() {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", () => {
      if (!input.files?.[0]) return reject(new Error("No se selecciono ninguna imagen"));
      readFile(input.files[0]).then(resolve, reject);
    }, { once: true });
    input.click();
  });
}

export async function uploadMultiple(files) { return Promise.all(Array.from(files || []).map(readFile)); }
export async function deleteImage() { return true; }
export function getImageUrl(publicId) { return publicId || ""; }
export const imageFolders = {};

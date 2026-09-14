/**
 * Servicio CRUD para localStorage
 * Provee operaciones genéricas y queries específicas por colección
 * Reemplaza Firebase Firestore
 */
import { COLLECTIONS } from "../utils/config.js";
import { collection as col } from "../db/storage.js";

/**
 * Obtener documento por ruta (ej: "gyms/abc123")
 */
function getDoc(path) {
  const parts = path.split("/");
  if (parts.length !== 2) throw new Error("Ruta de documento inválida");
  return col.getById(parts[0], parts[1]);
}

/**
 * Obtener documento por ID de colección
 */
function getById(collectionName, id) {
  return col.getById(collectionName, id);
}

/**
 * Crear documento en colección
 */
function createDoc(collectionName, data) {
  return col.add(collectionName, data);
}

/**
 * Crear documento con ID personalizado
 */
function createDocWithId(collectionName, id, data) {
  return col.set(collectionName, id, data);
}

/**
 * Actualizar documento parcialmente
 */
function updateDoc(path, data) {
  const parts = path.split("/");
  if (parts.length !== 2) throw new Error("Ruta de documento inválida");
  return col.update(parts[0], parts[1], data);
}

/**
 * Actualizar documento por ID de colección
 */
function updateById(collectionName, id, data) {
  return col.update(collectionName, id, data);
}

/**
 * Eliminar documento
 */
function deleteDoc(path) {
  const parts = path.split("/");
  if (parts.length !== 2) throw new Error("Ruta de documento inválida");
  return col.delete(parts[0], parts[1]);
}

/**
 * Eliminar documento por ID de colección
 */
function deleteById(collectionName, id) {
  return col.delete(collectionName, id);
}

/**
 * Obtener documento o crear con ID
 */
function getOrCreateDoc(path, defaultData) {
  const existing = getDoc(path);
  if (existing) return existing;
  const parts = path.split("/");
  return createDocWithId(parts[0], parts[1], defaultData);
}

/**
 * Obtener todos los documentos de una colección con query opcional
 */
function getAll(collectionName, queryFn) {
  const items = col.get(collectionName);
  return queryFn ? queryFn(items) : [...items];
}

/**
 * Query: filtrar por campo igual
 */
function whereEquals(field, value) {
  return (items) => items.filter(item => item[field] === value);
}

/**
 * Query: filtrar por array contiene valor
 */
function whereArrayContains(field, value) {
  return (items) => items.filter(item => Array.isArray(item[field]) && item[field].includes(value));
}

/**
 * Query: ordenar por campo
 */
function orderByField(field, direction = "asc") {
  return (items) => [...items].sort((a, b) => {
    const av = a[field] || "";
    const bv = b[field] || "";
    if (av < bv) return direction === "asc" ? -1 : 1;
    if (av > bv) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Query: limitar resultados
 */
function limitResults(count) {
  return (items) => items.slice(0, count);
}

/**
 * Query: paginar resultados
 */
function paginate(lastDoc, count) {
  return (items) => {
    const idx = items.findIndex(i => i.id === (lastDoc && lastDoc.id));
    return items.slice(idx + 1, idx + 1 + count);
  };
}

// === Servicios específicos por colección ===

/**
 * Gimnasios
 */
export const gymService = {
  getAll: () => getAll(COLLECTIONS.GYMS),
  getById: (id) => getById(COLLECTIONS.GYMS, id),
  getByCity: (city) => getAll(COLLECTIONS.GYMS, whereEquals("ciudad", city)),
  getBySpecialty: (spec) => getAll(COLLECTIONS.GYMS, whereArrayContains("especialidades", spec)),
  getByState: (state) => getAll(COLLECTIONS.GYMS, whereEquals("estado", state)),
  searchByName: (term) => {
    const all = getAll(COLLECTIONS.GYMS);
    const lowerTerm = term.toLowerCase();
    return all.filter(
      (g) => (g.nombre || "").toLowerCase().includes(lowerTerm) || (g.descripcion || "").toLowerCase().includes(lowerTerm)
    );
  },
  create: (data) => createDoc(COLLECTIONS.GYMS, data),
  update: (id, data) => updateDoc(`${COLLECTIONS.GYMS}/${id}`, data),
  delete: (id) => deleteDoc(`${COLLECTIONS.GYMS}/${id}`),
};

/**
 * Entrenadores
 */
export const trainerService = {
  getAll: () => getAll(COLLECTIONS.TRAINERS),
  getById: (id) => getById(COLLECTIONS.TRAINERS, id),
  getByGym: (gymId) => getAll(COLLECTIONS.TRAINERS, whereEquals("gymId", gymId)),
  getByGymAndState: (gymId, state) => {
    return getAll(COLLECTIONS.TRAINERS, (items) =>
      items.filter(t => t.gymId === gymId && t.estado === state)
    );
  },
  getBySpecialty: (spec) => getAll(COLLECTIONS.TRAINERS, whereEquals("especialidad", spec)),
  create: (data) => createDoc(COLLECTIONS.TRAINERS, data),
  update: (id, data) => updateDoc(`${COLLECTIONS.TRAINERS}/${id}`, data),
  delete: (id) => deleteDoc(`${COLLECTIONS.TRAINERS}/${id}`),
};

/**
 * Clientes
 */
export const clientService = {
  getAll: () => getAll(COLLECTIONS.CLIENTS),
  getById: (id) => getById(COLLECTIONS.CLIENTS, id),
  getByTrainer: (trainerId) => getAll(COLLECTIONS.CLIENTS, whereEquals("trainerId", trainerId)),
  getByTrainerAndGym: (trainerId, gymId) => {
    return getAll(COLLECTIONS.CLIENTS, (items) =>
      items.filter(c => c.trainerId === trainerId && c.gymId === gymId)
    );
  },
  create: (data) => createDoc(COLLECTIONS.CLIENTS, data),
  update: (id, data) => updateDoc(`${COLLECTIONS.CLIENTS}/${id}`, data),
  delete: (id) => deleteDoc(`${COLLECTIONS.CLIENTS}/${id}`),
};

/**
 * Sesiones
 */
export const sessionService = {
  getAll: () => getAll(COLLECTIONS.SESSIONS),
  getById: (id) => getById(COLLECTIONS.SESSIONS, id),
  getByClient: (clientId) => getAll(COLLECTIONS.SESSIONS, whereEquals("clientId", clientId)),
  getByTrainer: (trainerId) => getAll(COLLECTIONS.SESSIONS, whereEquals("trainerId", trainerId)),
  getByGym: (gymId) => getAll(COLLECTIONS.SESSIONS, whereEquals("gymId", gymId)),
  create: (data) => createDoc(COLLECTIONS.SESSIONS, data),
  update: (id, data) => updateDoc(`${COLLECTIONS.SESSIONS}/${id}`, data),
  delete: (id) => deleteDoc(`${COLLECTIONS.SESSIONS}/${id}`),
};

/**
 * Fotos de progreso
 */
export const photoService = {
  getAll: () => getAll(COLLECTIONS.PHOTOS),
  getById: (id) => getById(COLLECTIONS.PHOTOS, id),
  getByClient: (clientId) => getAll(COLLECTIONS.PHOTOS, whereEquals("clientId", clientId)),
  getByTrainer: (trainerId) => getAll(COLLECTIONS.PHOTOS, whereEquals("trainerId", trainerId)),
  create: (data) => createDoc(COLLECTIONS.PHOTOS, data),
  update: (id, data) => updateDoc(`${COLLECTIONS.PHOTOS}/${id}`, data),
  delete: (id) => deleteDoc(`${COLLECTIONS.PHOTOS}/${id}`),
};

/**
 * Pagos
 */
export const paymentService = {
  getAll: () => getAll(COLLECTIONS.PAYMENTS),
  getById: (id) => getById(COLLECTIONS.PAYMENTS, id),
  getByClient: (clientId) => getAll(COLLECTIONS.PAYMENTS, whereEquals("clientId", clientId)),
  getByTrainer: (trainerId) => getAll(COLLECTIONS.PAYMENTS, whereEquals("trainerId", trainerId)),
  getByGym: (gymId) => getAll(COLLECTIONS.PAYMENTS, whereEquals("gymId", gymId)),
  create: (data) => createDoc(COLLECTIONS.PAYMENTS, data),
  update: (id, data) => updateDoc(`${COLLECTIONS.PAYMENTS}/${id}`, data),
  delete: (id) => deleteDoc(`${COLLECTIONS.PAYMENTS}/${id}`),
};

/**
 * Reseñas de gimnasios
 */
export const reviewService = {
  getAll: () => getAll(COLLECTIONS.GYM_REVIEWS),
  getById: (id) => getById(COLLECTIONS.GYM_REVIEWS, id),
  getByGym: (gymId) => getAll(COLLECTIONS.GYM_REVIEWS, whereEquals("gymId", gymId)),
  getPending: () =>
    getAll(COLLECTIONS.GYM_REVIEWS, (items) => items.filter(r => r.approved === false)),
  create: (data) => createDoc(COLLECTIONS.GYM_REVIEWS, data),
  update: (id, data) => updateDoc(`${COLLECTIONS.GYM_REVIEWS}/${id}`, data),
  delete: (id) => deleteDoc(`${COLLECTIONS.GYM_REVIEWS}/${id}`),
};

// Función setDoc usada por auth.js (compatibilidad)
export async function setDoc(path, data, merge = false) {
  const parts = path.split("/");
  if (parts.length !== 2) throw new Error("Ruta de documento inválida");
  if (merge) {
    const existing = getById(parts[0], parts[1]);
    if (existing) {
      return updateDoc(path, data);
    }
  }
  return createDocWithId(parts[0], parts[1], data);
}

// Exportar funciones genéricas para uso directo
export { getDoc, getById, createDoc, createDocWithId, updateDoc, deleteDoc, getAll, getOrCreateDoc };

// Exportar query helpers
export { whereEquals, whereArrayContains, orderByField, limitResults, paginate };

/**
 * Servicio de funciones específicas para gimnasios
 * Búsqueda, filtrado y comparación
 */
import { gymService, trainerService, reviewService, paymentService } from "./firestore.js";
import { LIMITS } from "../utils/config.js";

/**
 * Buscar gimnasios con múltiples criterios
 * @param {Object} filters - { ciudad, especialidad, precioMax, precioMin, ratingMin, disponible }
 * @returns {Promise<Array>}
 */
export async function searchGyms(filters = {}) {
  let results = [];

  // Si buscamos por ciudad, usar query directa
  if (filters.ciudad) {
    results = gymService.getByCity(filters.ciudad);
  }
  // Si buscamos por especialidad
  else if (filters.especialidad) {
    results = gymService.getBySpecialty(filters.especialidad);
  }
  // Si buscamos por texto libre
  else if (filters.termino) {
    results = gymService.searchByName(filters.termino);
  }
  // Si no hay filtros, obtener todos los activos
  else {
    results = gymService.getAll();
    results = results.filter((g) => g.estado === "activo");
  }

  // Aplicar filtros adicionales en cliente
  if (filters.precioMax !== undefined) {
    results = results.filter((g) => (g.precioMensual || 0) <= filters.precioMax);
  }
  if (filters.precioMin !== undefined) {
    results = results.filter((g) => (g.precioMensual || 0) >= filters.precioMin);
  }
  if (filters.ratingMin) {
    results = results.filter((g) => (g.rating || 0) >= filters.ratingMin);
  }

  // Ordenar
  if (filters.orden === "precio-asc") {
    results.sort((a, b) => (a.precioMensual || 0) - (b.precioMensual || 0));
  } else if (filters.orden === "precio-desc") {
    results.sort((a, b) => (b.precioMensual || 0) - (a.precioMensual || 0));
  } else if (filters.orden === "rating") {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // Por defecto: más recientes
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return results;
}

/**
 * Obtener gimnasios destacados (más valorados)
 * @param {number} limit
 */
export async function getFeaturedGyms(limit = LIMITS.RESULTS_PER_PAGE) {
  const gyms = gymService.getAll();
  return gyms
    .filter((g) => g.estado === "activo")
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

/**
 * Obtener entrenadores de un gimnasio
 * @param {string} gymId
 * @param {string} state - "activo", "inactivo", "pausa" o undefined para todos
 */
export async function getGymTrainers(gymId, state) {
  if (state) {
    return trainerService.getByGymAndState(gymId, state);
  }
  return trainerService.getByGym(gymId);
}

/**
 * Comparar hasta 3 gimnasios
 * @param {string[]} gymIds
 * @returns {Promise<Array[]>}
 */
export async function compareGyms(gymIds) {
  if (!gymIds || gymIds.length < 2 || gymIds.length > LIMITS.MAX_GIMNASIOS_COMPARE) {
    throw new Error(`Debes seleccionar entre 2 y ${LIMITS.MAX_GIMNASIOS_COMPARE} gimnasios`);
  }

  const gyms = [];
  for (const id of gymIds) {
    const gym = gymService.getById(id);
    if (gym) {
      const trainers = trainerService.getByGym(id);
      gyms.push({
        ...gym,
        entrenadores: trainers,
        entrenadoresDestacados: trainers
          .filter((t) => t.estado === "activo")
          .slice(0, 3)
          .map((t) => ({ nombre: t.nombre, especialidad: t.especialidad, foto: t.foto })),
      });
    }
  }
  return gyms;
}

/**
 * Obtener estadísticas de un gimnasio
 * @param {string} gymId
 */
export async function getGymStats(gymId) {
  const [trainers, reviews, payments] = await Promise.all([
    trainerService.getByGym(gymId),
    reviewService.getByGym(gymId),
    paymentService.getByGym(gymId),
  ]);

  const activos = trainers.filter((t) => t.estado === "activo").length;
  const clientesActivos = trainers.reduce((acc, t) => acc + 0, 0); // Se calcula desde clients
  const ingresosMes = payments
    .filter((p) => {
      const fecha = new Date(p.fecha);
      const ahora = new Date();
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
    })
    .reduce((acc, p) => acc + (p.monto || 0), 0);
  const reseñasPendientes = reviews.filter((r) => !r.approved).length;

  return {
    totalEntrenadores: trainers.length,
    entrenadoresActivos: activos,
    ingresosMes,
    reseñasPendientes,
  };
}

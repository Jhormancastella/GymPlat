/** Constantes de la aplicacion local. */
export const COLLECTIONS = {
  GYMS: "gyms",
  TRAINERS: "trainers",
  CLIENTS: "clients",
  SESSIONS: "sessions",
  PHOTOS: "photos",
  PAYMENTS: "payments",
  GYM_REVIEWS: "gymReviews",
};

export const ENUMS = {
  GYM_ESTADOS: ["activo", "inactivo"],
  TRAINER_ESTADOS: ["activo", "inactivo", "pausa"],
  CLIENT_ESTADOS: ["activo", "vencido", "pendiente"],
  PERIODOS: ["mensual", "quincenal", "semanal"],
  METODOS_PAGO: ["efectivo", "transferencia", "tarjeta"],
  TIPOS_SESION: ["personal", "grupal", "nutricional", "evaluacion"],
  FOTO_TIPOS: ["inicial", "semanal", "mensual", "progreso"],
  ESPECIALIDADES: ["CrossFit", "Fuerza", "Yoga", "Pilates", "Cardio", "Musculacion", "Acondicionamiento", "Rehabilitacion", "Funcional", "Boxeo", "Muay Thai", "Natacion", "Ciclismo", "Correr", "Nutricion", "Mindfulness"],
  DIAS_SEMANA: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
  ROLES: ["admin", "trainer", "client"],
};

export const LIMITS = {
  MAX_GIMNASIOS_COMPARE: 3,
  MAX_FOTOS_UPLOAD: 10,
  MAX_TAMANO_FOTO_MB: 10,
  RESULTS_PER_PAGE: 12,
  DEBOUNCE_DELAY_MS: 300,
  MAX_REVIEW_RATING: 5,
  MIN_REVIEW_RATING: 1,
};

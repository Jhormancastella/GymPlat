/**
 * Módulo de almacenamiento local (localStorage)
 * Simula una base de datos con colecciones
 * Reemplaza Firebase Firestore
 */
const DB_KEY = 'gymplat_db_v1';

let db = null;

function loadDb() {
  if (db) return db;
  try {
    const raw = localStorage.getItem(DB_KEY);
    db = raw ? JSON.parse(raw) : null;
  } catch (e) {
    db = null;
  }
  if (!db) {
    db = {
      gyms: [],
      trainers: [],
      clients: [],
      sessions: [],
      photos: [],
      payments: [],
      gymReviews: [],
      users: [],
    };
    saveDb();
  }
  return db;
}

function saveDb() {
  if (!db) return;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('Error guardando localStorage:', e);
  }
}

function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Colección genérica
 */
export const collection = {
  get(name) {
    const d = loadDb();
    if (!d[name]) d[name] = [];
    return d[name];
  },

  getAll(name) {
    return [...this.get(name)];
  },

  getById(name, id) {
    return this.get(name).find(item => item.id === id) || null;
  },

  add(name, data) {
    const items = this.get(name);
    const item = {
      id: data.id || generateId(),
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    items.push(item);
    saveDb();
    return item;
  },

  set(name, id, data) {
    const items = this.get(name);
    const idx = items.findIndex(item => item.id === id);
    const item = {
      id,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.push(item);
    }
    saveDb();
    return item;
  },

  update(name, id, data) {
    const items = this.get(name);
    const idx = items.findIndex(item => item.id === id);
    if (idx < 0) return null;
    items[idx] = {
      ...items[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveDb();
    return items[idx];
  },

  delete(name, id) {
    const items = this.get(name);
    const idx = items.findIndex(item => item.id === id);
    if (idx < 0) return false;
    items.splice(idx, 1);
    saveDb();
    return true;
  },

  query(name, filterFn) {
    const items = this.get(name);
    return filterFn ? items.filter(filterFn) : [...items];
  },
};

/**
 * Inicializar con datos de ejemplo si está vacío
 */
export function seedIfEmpty(seedData) {
  const d = loadDb();
  let added = false;
  for (const [collectionName, items] of Object.entries(seedData)) {
    if (!d[collectionName] || d[collectionName].length === 0) {
      d[collectionName] = items.map(item => ({
        id: item.id || generateId(),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        ...item,
      }));
      added = true;
    }
  }
  if (added) saveDb();
}

/**
 * Limpiar toda la base de datos
 */
export function clearDb() {
  db = null;
  localStorage.removeItem(DB_KEY);
}

/**
 * Exportar base de datos (para backup)
 */
export function exportDb() {
  return JSON.stringify(loadDb(), null, 2);
}

/**
 * Importar base de datos
 */
export function importDb(json) {
  try {
    db = JSON.parse(json);
    saveDb();
    return true;
  } catch (e) {
    return false;
  }
}
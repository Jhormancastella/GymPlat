/** Autenticacion local. La sesion y los usuarios viven en localStorage. */
import { collection } from "../db/storage.js";

const SESSION_KEY = "gymplat_session_v1";
const listeners = new Set();

function publicUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function notify() {
  const user = getCurrentUser();
  listeners.forEach((listener) => listener(user));
}

function createId() {
  const value = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return `user_${value}`;
}

export async function registerUser({ email, password, displayName, role = "client" }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !password || !displayName) throw new Error("Nombre, correo y contrasena son obligatorios");
  if (password.length < 6) throw new Error("La contrasena debe tener al menos 6 caracteres");
  if (collection.get("users").some((user) => user.email === normalizedEmail)) throw new Error("Ya existe una cuenta con este correo");
  const user = collection.add("users", { id: createId(), email: normalizedEmail, password, displayName: String(displayName).trim(), role });
  localStorage.setItem(SESSION_KEY, user.id);
  notify();
  return { user: publicUser(user), uid: user.id };
}

export async function loginUser(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = collection.get("users").find((item) => item.email === normalizedEmail && item.password === password);
  if (!user) throw new Error("Correo o contrasena incorrectos");
  localStorage.setItem(SESSION_KEY, user.id);
  notify();
  return { user: publicUser(user), uid: user.id };
}

export async function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  notify();
}

export function getCurrentUser() {
  return publicUser(collection.getById("users", localStorage.getItem(SESSION_KEY)));
}

export function onAuthStateChanged(callback) {
  listeners.add(callback);
  callback(getCurrentUser());
  return () => listeners.delete(callback);
}

export async function resetPassword() {
  throw new Error("La recuperacion de contrasena no esta disponible en modo local");
}

export async function getUserProfile(uid) {
  return publicUser(collection.getById("users", uid));
}

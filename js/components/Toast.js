/**
 * Toast - Sistema de notificaciones
 * Muestra alertas temporales en pantalla
 */
export class Toast {
  constructor() {
    this.container = null;
    this.defaultDuration = 4000;
  }

  /**
   * Obtener contenedor de toasts (singleton)
   */
  getContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  /**
   * Mostrar una notificación
   * @param {string} message
   * @param {string} type - "success", "error", "warning", "info"
   * @param {number} duration - ms
   */
  show(message, type = "info", duration = this.defaultDuration) {
    const container = this.getContainer();
    const toast = document.createElement("div");

    const colors = {
      success: "#22c55e",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    };

    toast.style.cssText = `
      background: ${colors[type] || colors.info};
      color: #fff;
      padding: 14px 22px;
      border-radius: 10px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      pointer-events: auto;
      cursor: pointer;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      max-width: 360px;
      word-wrap: break-word;
    `;

    toast.textContent = message;
    container.appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    });

    // Auto-dismiss
    const dismiss = () => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 350);
    };

    toast.addEventListener("click", dismiss);
    setTimeout(dismiss, duration);
  }

  success(msg) { this.show(msg, "success"); }
  error(msg) { this.show(msg, "error"); }
  warning(msg) { this.show(msg, "warning"); }
  info(msg) { this.show(msg, "info"); }
}

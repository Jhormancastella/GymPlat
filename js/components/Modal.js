/**
 * Modal - Componente reutilizable de modal
 * Crea modales dinámicos con header, body y actions
 */
export class Modal {
  constructor() {
    this.overlay = null;
    this.onClose = null;
  }

  /**
   * Abrir un modal
   * @param {Object} options
   * @param {string} options.title - Título del modal
   * @param {HTMLElement|string} options.content - Contenido (elemento o HTML string)
   * @param {Array} options.actions - [{ label, className, onClick }]
   * @param {boolean} options.closeOnOverlay - Cerrar al hacer clic en overlay
   * @param {string} options.size - "sm", "md", "lg", "xl"
   */
  open(options = {}) {
    const {
      title = "",
      content = "",
      actions = [],
      closeOnOverlay = true,
      size = "md",
    } = options;

    // Crear overlay
    this.overlay = document.createElement("div");
    this.overlay.className = "modal-overlay";
    this.overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.25s ease;
    `;

    const sizeMap = {
      sm: "400px",
      md: "560px",
      lg: "768px",
      xl: "1024px",
    };

    const modal = document.createElement("div");
    modal.className = "modal-container";
    modal.style.cssText = `
      background: var(--bg-primary);
      border-radius: 16px;
      overflow: hidden;
      width: 100%;
      max-width: ${sizeMap[size] || sizeMap.md};
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
      transform: scale(0.9);
      transition: transform 0.25s ease;
    `;

    // Header
    if (title) {
      const header = document.createElement("div");
      header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-color);
      `;

      const titleEl = document.createElement("h3");
      titleEl.textContent = title;
      titleEl.style.cssText = `
        font-family: 'Inter', sans-serif;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      `;

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "&times;";
      closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        line-height: 1;
      `;
      closeBtn.addEventListener("click", () => this.close());

      header.appendChild(titleEl);
      header.appendChild(closeBtn);
      modal.appendChild(header);
    }

    // Body
    const body = document.createElement("div");
    body.className = "modal-body";
    body.style.cssText = `
      padding: 24px;
      overflow-y: auto;
      flex: 1;
      color: var(--text-primary);
    `;

    if (typeof content === "string") {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }
    modal.appendChild(body);

    // Actions
    if (actions.length > 0) {
      const footer = document.createElement("div");
      footer.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding: 16px 24px;
        border-top: 1px solid var(--border-color);
      `;

      actions.forEach((action) => {
        const btn = document.createElement("button");
        btn.textContent = action.label;
        btn.className = action.className || "btn btn-secondary";
        btn.addEventListener("click", action.onClick || (() => this.close()));
        footer.appendChild(btn);
      });

      modal.appendChild(footer);
    }

    this.overlay.appendChild(modal);
    document.body.appendChild(this.overlay);

    // Animar entrada
    requestAnimationFrame(() => {
      this.overlay.style.opacity = "1";
      modal.style.transform = "scale(1)";
    });

    // Cerrar al hacer clic en overlay
    if (closeOnOverlay) {
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.close();
      });
    }

    // Cerrar con Escape
    this._escHandler = (e) => {
      if (e.key === "Escape") this.close();
    };
    document.addEventListener("keydown", this._escHandler);
  }

  /**
   * Cerrar el modal
   */
  close() {
    if (this.overlay) {
      this.overlay.style.opacity = "0";
      const modal = this.overlay.querySelector(".modal-container");
      if (modal) modal.style.transform = "scale(0.9)";
      setTimeout(() => {
        this.overlay.remove();
        this.overlay = null;
      }, 250);
    }
    if (this._escHandler) {
      document.removeEventListener("keydown", this._escHandler);
    }
  }
}

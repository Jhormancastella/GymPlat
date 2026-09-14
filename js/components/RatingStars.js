/**
 * RatingStars - Componente interactivo de estrellas 1-5
 */
export class RatingStars {
  /**
   * Crear componente de estrellas
   * @param {Object} options
   * @param {number} options.value - Valor inicial (1-5)
   * @param {number} options.size - Tamaño en px
   * @param {boolean} options.interactive - Permitir clic
   * @param {Function} options.onChange - callback(value)
   * @param {boolean} options.showValue - Mostrar número junto a estrellas
   */
  constructor(options = {}) {
    this.value = options.value || 0;
    this.size = options.size || 20;
    this.interactive = options.interactive !== false;
    this.onChange = options.onChange || null;
    this.showValue = options.showValue || false;
    this._element = null;
    this._hoverValue = 0;
  }

  /**
   * Renderizar componente
   */
  render() {
    this._element = document.createElement("div");
    this._element.className = "rating-stars";
    this._element.style.cssText = "display:inline-flex;align-items:center;gap:2px;";

    this._renderStars();

    if (this.showValue) {
      const valSpan = document.createElement("span");
      valSpan.textContent = this.value ? ` ${this.value.toFixed(1)}` : "";
      valSpan.style.cssText = `
        margin-left: 6px;
        font-size: 14px;
        color: var(--text-secondary);
        font-family: 'Inter', sans-serif;
      `;
      this._element.appendChild(valSpan);
    }

    return this._element;
  }

  /**
   * Renderizar estrellas
   */
  _renderStars() {
    this._element.innerHTML = "";
    const currentValue = this._hoverValue || this.value;

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.textContent = i <= Math.floor(currentValue) ? "★" : i <= currentValue ? "½" : "☆";
      star.style.cssText = `
        font-size: ${this.size}px;
        cursor: ${this.interactive ? "pointer" : "default"},
        color: ${i <= currentValue ? "#f59e0b" : "var(--text-tertiary)"},
        transition: color 0.15s, transform 0.15s;
        user-select: none;
        line-height: 1;
      `;

      if (this.interactive) {
        star.addEventListener("click", () => {
          this.value = i;
          this._hoverValue = 0;
          this._renderStars();
          if (this.onChange) this.onChange(i);
        });

        star.addEventListener("mouseenter", () => {
          this._hoverValue = i;
          this._renderStars();
        });

        star.addEventListener("mouseleave", () => {
          this._hoverValue = 0;
          this._renderStars();
        });
      }

      this._element.appendChild(star);
    }
  }

  /**
   * Obtener valor actual
   */
  getValue() {
    return this.value;
  }

  /**
   * Establecer valor
   */
  setValue(value) {
    this.value = Math.max(1, Math.min(5, value));
    this._renderStars();
  }

  /**
   * Hacer estrellas no interactivas
   */
  setReadOnly(readOnly) {
    this.interactive = !readOnly;
    this._renderStars();
  }
}

/**
 * Form - Campos de formulario con validación
 * Soporta campos: text, email, password, number, textarea, select, file, schedule
 */
export class FormBuilder {
  constructor(options = {}) {
    this.fields = options.fields || [];
    this._element = null;
    this._values = {};
    this._errors = {};
  }

  /**
   * Crear formulario con campos definidos
   * @param {Array} fields - Array de configuraciones de campo
   *  { name, label, type, required, placeholder, value, options, validation, helpText }
   */
  static create(fields) {
    const builder = new FormBuilder({ fields });
    return builder;
  }

  /**
   * Renderizar formulario completo
   */
  render() {
    this._element = document.createElement("form");
    this._element.className = "gymplat-form";
    this._element.style.cssText = "display:flex;flex-direction:column;gap:16px;";

    this.fields.forEach((field) => {
      this._element.appendChild(this._renderField(field));
    });

    return this._element;
  }

  /**
   * Renderizar un campo individual
   */
  _renderField(field) {
    const wrapper = document.createElement("div");
    wrapper.className = `form-field form-field-${field.type}`;
    wrapper.style.cssText = "display:flex;flex-direction:column;gap:4px;";

    // Label
    if (field.label) {
      const label = document.createElement("label");
      label.textContent = field.label + (field.required ? " *" : "");
      label.setAttribute("for", `field-${field.name}`);
      label.style.cssText = `
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-primary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      `;
      wrapper.appendChild(label);
    }

    // Input
    let input;

    if (field.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = field.rows || 3;
    } else if (field.type === "select") {
      input = document.createElement("select");
      if (field.options) {
        field.options.forEach((opt) => {
          const option = document.createElement("option");
          option.value = opt.value;
          option.textContent = opt.label;
          input.appendChild(option);
        });
      }
    } else if (field.type === "file") {
      input = document.createElement("input");
      input.type = "file";
      input.accept = field.accept || "image/*";
    } else if (field.type === "schedule") {
      // Schedule field: grupo de día + hora entrada + hora salida
      input = document.createElement("div");
      input.className = "schedule-field";
      input.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;";

      const diaSelect = document.createElement("select");
      diaSelect.name = `${field.name}_dia`;
      diaSelect.style.cssText = "flex:1;min-width:100px;";
      const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
      dias.forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        diaSelect.appendChild(opt);
      });

      const horaIn = document.createElement("input");
      horaIn.type = "time";
      horaIn.name = `${field.name}_horaInicio`;
      horaIn.style.cssText = "flex:1;min-width:100px;";

      const horaOut = document.createElement("input");
      horaOut.type = "time";
      horaOut.name = `${field.name}_horaFin`;
      horaOut.style.cssText = "flex:1;min-width:100px;";

      input.appendChild(diaSelect);
      input.appendChild(horaIn);
      input.appendChild(horaOut);
    } else {
      input = document.createElement("input");
      input.type = field.type || "text";
    }

    input.name = field.name;
    input.id = `field-${field.name}`;
    input.required = field.required || false;
    input.placeholder = field.placeholder || "";

    if (field.value !== undefined) input.value = field.value;
    if (field.min !== undefined) input.min = field.min;
    if (field.max !== undefined) input.max = field.max;
    if (field.step !== undefined) input.step = field.step;

    // Event listener para validación en tiempo real
    input.addEventListener("input", () => {
      this._validateField(field);
      this._updateValue(field);
    });
    input.addEventListener("change", () => {
      this._validateField(field);
      this._updateValue(field);
    });

    if (field.type !== "schedule" && field.type !== "file") {
      wrapper.appendChild(input);
    } else {
      wrapper.appendChild(input);
    }

    // Help text
    if (field.helpText) {
      const help = document.createElement("small");
      help.textContent = field.helpText;
      help.style.cssText = "font-size:12px;color:var(--text-secondary);";
      wrapper.appendChild(help);
    }

    // Error display
    const errorEl = document.createElement("span");
    errorEl.className = "field-error";
    errorEl.style.cssText = "font-size:12px;color:#ef4444;display:none;";
    errorEl.id = `error-${field.name}`;
    wrapper.appendChild(errorEl);

    return wrapper;
  }

  /**
   * Validar un campo
   */
  _validateField(field) {
    const input = this._element.querySelector(`[name="${field.name}"]`);
    const errorEl = this._element.querySelector(`#error-${field.name}`);
    if (!input || !errorEl) return true;

    let value = input.value;
    let valid = true;
    let errorMsg = "";

    // Required
    if (field.required && !value.trim()) {
      valid = false;
      errorMsg = "Campo obligatorio";
    }

    // Custom validation
    if (valid && field.validation) {
      const result = field.validation(value);
      if (result !== true) {
        valid = false;
        errorMsg = result;
      }
    }

    // Type-specific
    if (valid && field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        valid = false;
        errorMsg = "Email inválido";
      }
    }

    if (valid && field.type === "number" && value) {
      if (isNaN(value)) {
        valid = false;
        errorMsg = "Debe ser un número";
      }
    }

    if (valid && field.type === "password" && value) {
      if (value.length < 6) {
        valid = false;
        errorMsg = "Mínimo 6 caracteres";
      }
    }

    errorEl.textContent = errorMsg;
    errorEl.style.display = valid ? "none" : "block";
    input.style.borderColor = valid ? "var(--border-color)" : "#ef4444";

    return valid;
  }

  /**
   * Actualizar valor interno
   */
  _updateValue(field) {
    const input = this._element.querySelector(`[name="${field.name}"]`);
    if (input) {
      this._values[field.name] = input.value;
    }
  }

  /**
   * Obtener valores del formulario
   */
  getValues() {
    const values = {};
    this.fields.forEach((field) => {
      const input = this._element.querySelector(`[name="${field.name}"]`);
      if (input) {
        values[field.name] = input.value;
      }
    });
    return values;
  }

  /**
   * Validar todo el formulario
   */
  validateAll() {
    let allValid = true;
    this.fields.forEach((field) => {
      const valid = this._validateField(field);
      if (!valid) allValid = false;
    });
    return allValid;
  }

  /**
   * Limpiar formulario
   */
  clear() {
    this.fields.forEach((field) => {
      const input = this._element.querySelector(`[name="${field.name}"]`);
      if (input) {
        input.value = "";
        const errorEl = this._element.querySelector(`#error-${field.name}`);
        if (errorEl) {
          errorEl.textContent = "";
          errorEl.style.display = "none";
        }
        input.style.borderColor = "var(--border-color)";
      }
    });
  }

  /**
   * Obtener elemento DOM
   */
  getElement() {
    return this._element;
  }
}

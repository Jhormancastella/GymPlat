/**
 * Navbar - Barra de navegación con búsqueda, tema y auth
 */
export class Navbar {
  constructor(options = {}) {
    this.onSearch = options.onSearch || null;
    this.onLogout = options.onLogout || null;
    this.onLoginClick = options.onLoginClick || null;
    this.onRegisterClick = options.onRegisterClick || null;
    this.onGymClick = options.onGymClick || null;
    this.user = null;
    this.darkMode = false;
    this._debounceTimer = null;
    this._element = null;
  }

  /**
   * Renderizar la navbar
   */
  render() {
    this._element = document.createElement("nav");
    this._element.className = "navbar";
    this._element.style.cssText = `
      position: sticky;
      top: 0;
      z-index: 8000;
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      padding: 0 24px;
      transition: background 0.3s, border-color 0.3s;
    `;

    this._updateContent();
    return this._element;
  }

  /**
   * Actualizar contenido de la navbar
   */
  _updateContent() {
    this._element.innerHTML = "";

    const isDark = document.documentElement.classList.contains("dark");

    // Container
    const container = document.createElement("div");
    container.style.cssText = `
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      gap: 20px;
    `;

    // Logo
    const logo = document.createElement("a");
    logo.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
    logo.style.cssText = `
      font-family: 'Inter', sans-serif;
      font-size: 22px;
      font-weight: 800;
      text-decoration: none;
      background: linear-gradient(135deg, var(--accent-orange), var(--accent-magenta));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      white-space: nowrap;
    `;
    logo.textContent = "🏋️ GymPlat";
    container.appendChild(logo);

    // Search bar
    if (this.onSearch) {
      const searchWrapper = document.createElement("div");
      searchWrapper.style.cssText = `
        flex: 1;
        max-width: 480px;
        position: relative;
      `;

      const input = document.createElement("input");
      input.type = "search";
      input.placeholder = "Buscar gimnasios por ciudad o nombre...";
      input.style.cssText = `
        width: 100%;
        padding: 10px 16px 10px 42px;
        border-radius: 12px;
        border: 2px solid var(--border-color);
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
      `;

      // Search icon
      const icon = document.createElement("span");
      icon.innerHTML = "🔍";
      icon.style.cssText = `
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        pointer-events: none;
      `;

      input.addEventListener("input", (e) => {
        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
          if (this.onSearch) this.onSearch(e.target.value.trim());
        }, 300); // debounce 300ms
      });

      searchWrapper.appendChild(icon);
      searchWrapper.appendChild(input);
      container.appendChild(searchWrapper);
    }

    // Right section
    const right = document.createElement("div");
    right.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    `;

    // Toggle tema
    const themeBtn = document.createElement("button");
    themeBtn.style.cssText = `
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 10px;
      padding: 8px;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.2s;
    `;
    themeBtn.innerHTML = isDark ? "☀️" : "🌙";
    themeBtn.title = isDark ? "Modo claro" : "Modo oscuro";
    themeBtn.addEventListener("click", () => {
      this.darkMode = !this.darkMode;
      document.documentElement.classList.toggle("dark", this.darkMode);
      themeBtn.innerHTML = this.darkMode ? "☀️" : "🌙";
      localStorage.setItem("gymplat_theme", this.darkMode ? "dark" : "light");
    });
    right.appendChild(themeBtn);

    // Auth buttons
    if (this.user) {
      const userBtn = document.createElement("button");
      userBtn.textContent = this.user.displayName || this.user.email;
      userBtn.style.cssText = `
        background: linear-gradient(135deg, var(--accent-orange), var(--accent-magenta));
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 8px 16px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      `;
      right.appendChild(userBtn);

      if (this.onGymClick) {
        const gymBtn = document.createElement("a");
        gymBtn.href = "pages/gym.html";
        gymBtn.className = "btn btn-outline";
        gymBtn.textContent = "Gimnasio";
        right.appendChild(gymBtn);
      }

      const logoutBtn = document.createElement("button");
      logoutBtn.textContent = "Cerrar sesión";
      logoutBtn.style.cssText = `
        background: transparent;
        border: 2px solid var(--accent-orange);
        color: var(--accent-orange);
        border-radius: 10px;
        padding: 8px 16px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      `;
      logoutBtn.addEventListener("mouseenter", () => {
        logoutBtn.style.background = "var(--accent-orange)";
        logoutBtn.style.color = "#fff";
      });
      logoutBtn.addEventListener("mouseleave", () => {
        logoutBtn.style.background = "transparent";
        logoutBtn.style.color = "var(--accent-orange)";
      });
      logoutBtn.addEventListener("click", () => {
        if (this.onLogout) this.onLogout();
      });
      right.appendChild(logoutBtn);
    } else {
      const loginBtn = document.createElement("button");
      loginBtn.textContent = "Iniciar sesión";
      loginBtn.style.cssText = `
        background: transparent;
        border: 2px solid var(--accent-orange);
        color: var(--accent-orange);
        border-radius: 10px;
        padding: 8px 16px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      `;
      loginBtn.addEventListener("click", () => {
        if (this.onLoginClick) this.onLoginClick();
      });
      right.appendChild(loginBtn);

      const registerBtn = document.createElement("button");
      registerBtn.textContent = "Registrarse";
      registerBtn.style.cssText = `
        background: linear-gradient(135deg, var(--accent-orange), var(--accent-magenta));
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 8px 16px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s;
      `;
      registerBtn.addEventListener("mouseenter", () => (registerBtn.style.opacity = "0.85"));
      registerBtn.addEventListener("mouseleave", () => (registerBtn.style.opacity = "1"));
      registerBtn.addEventListener("click", () => {
        if (this.onRegisterClick) this.onRegisterClick();
      });
      right.appendChild(registerBtn);
    }

    container.appendChild(right);
    this._element.appendChild(container);
  }

  /**
   * Actualizar usuario
   */
  setUser(user) {
    this.user = user;
    this._updateContent();
  }

  /**
   * Obtener elemento DOM
   */
  getElement() {
    return this._element;
  }
}

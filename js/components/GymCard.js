/**
 * GymCard - Tarjeta de gimnasio con logo, rating, especialidades
 */
export class GymCard {
  /**
   * Crear tarjeta de gimnasio
   * @param {Object} gym - Datos del gimnasio
   * @param {Object} options - { showButton, onVerPerfil, compact }
   */
  static render(gym, options = {}) {
    const { showButton = true, onVerPerfil = null, compact = false } = options;

    const card = document.createElement("div");
    card.className = "gym-card";
    card.style.cssText = `
      background: var(--bg-secondary);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
    `;

    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-6px)";
      card.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "none";
    });

    // Logo e imagen
    const imgWrapper = document.createElement("div");
    imgWrapper.style.cssText = `
      height: ${compact ? "120px" : "180px"};
      background: var(--bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    `;

    if (gym.logo) {
      const img = document.createElement("img");
      img.src = gym.logo;
      img.alt = escapeHtml(gym.nombre || "Gimnasio");
      img.style.cssText = "width:100%;height:100%;object-fit:cover;";
      img.onerror = () => {
        img.src = this._getDefaultLogo(gym.nombre);
      };
      imgWrapper.appendChild(img);
    } else {
      imgWrapper.innerHTML = `<span style="font-size:48px;opacity:0.3;">🏋️</span>`;
    }

    // Estado badge
    if (gym.estado === "inactivo") {
      const badge = document.createElement("span");
      badge.textContent = "Inactivo";
      badge.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ef4444;
        color: #fff;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      `;
      imgWrapper.appendChild(badge);
    }

    card.appendChild(imgWrapper);

    // Content
    const content = document.createElement("div");
    content.style.cssText = "padding: 16px;";

    // Nombre
    const name = document.createElement("h3");
    name.textContent = gym.nombre || "Sin nombre";
    name.style.cssText = `
      font-family: 'Inter', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 6px;
    `;
    content.appendChild(name);

    // Ciudad
    if (gym.ciudad) {
      const city = document.createElement("p");
      city.textContent = `📍 ${escapeHtml(gym.ciudad)}`;
      city.style.cssText = `
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        color: var(--text-secondary);
        margin: 0 0 8px;
      `;
      content.appendChild(city);
    }

    // Rating
    if (gym.rating) {
      const ratingEl = document.createElement("div");
      ratingEl.style.cssText = "margin-bottom: 8px;";
      ratingEl.innerHTML = this._renderStars(gym.rating);
      const ratingText = document.createElement("span");
      ratingText.textContent = ` ${gym.rating.toFixed(1)} (${gym.reviewCount || 0})`;
      ratingText.style.cssText = `
        font-size: 13px;
        color: var(--text-secondary);
        margin-left: 4px;
      `;
      ratingEl.appendChild(ratingText);
      content.appendChild(ratingEl);
    }

    // Especialidades
    if (gym.especialidades && gym.especialidades.length > 0) {
      const chips = document.createElement("div");
      chips.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;";

      gym.especialidades.slice(0, 4).forEach((spec) => {
        const chip = document.createElement("span");
        chip.textContent = spec;
        chip.style.cssText = `
          background: linear-gradient(135deg, var(--accent-orange), var(--accent-magenta));
          color: #fff;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
        `;
        chips.appendChild(chip);
      });

      if (gym.especialidades.length > 4) {
        const more = document.createElement("span");
        more.textContent = `+${gym.especialidades.length - 4}`;
        more.style.cssText = `
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-family: 'Inter', sans-serif;
        `;
        chips.appendChild(more);
      }

      content.appendChild(chips);
    }

    // Precio
    if (gym.precioMensual) {
      const price = document.createElement("p");
      price.innerHTML = `<strong>$${gym.precioMensual}</strong><span style="font-size:12px;color:var(--text-secondary);">/mes</span>`;
      price.style.cssText = `
        font-family: 'Inter', sans-serif;
        font-size: 15px;
        color: var(--text-primary);
        margin: 0 0 12px;
      `;
      content.appendChild(price);
    }

    // Botón
    if (showButton) {
      const btn = document.createElement("button");
      btn.textContent = "Ver perfil";
      btn.className = "btn btn-primary";
      btn.style.cssText = `
        width: 100%;
        background: linear-gradient(135deg, var(--accent-orange), var(--accent-magenta));
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 10px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
      `;
      btn.addEventListener("mouseenter", () => (btn.style.opacity = "0.9"));
      btn.addEventListener("mouseleave", () => (btn.style.opacity = "1"));
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (onVerPerfil) onVerPerfil(gym);
        else window.location.href = (window.location.pathname.includes('/pages/') ? '../' : '') + `gym.html?id=${gym.id}`;
      });
      content.appendChild(btn);
    }

    card.appendChild(content);
    return card;
  }

  /**
   * Renderizar estrellas de rating
   */
  static _renderStars(rating) {
    let html = "";
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) html += "★";
    if (hasHalf) html += "½";
    const empty = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 0; i < empty; i++) html += "☆";
    return `<span style="color:#f59e0b;font-size:16px;">${html}</span>`;
  }

  /**
   * Logo por defecto con iniciales
   */
  static _getDefaultLogo(name) {
    const initial = (name || "G").charAt(0).toUpperCase();
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, "#f97316");
    gradient.addColorStop(1, "#ec4899");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 120px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial, 200, 170);
    return canvas.toDataURL();
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

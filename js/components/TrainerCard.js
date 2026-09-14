/**
 * TrainerCard - Tarjeta de entrenador con foto, especialidad, años, tarifa
 */
export class TrainerCard {
  /**
   * Crear tarjeta de entrenador
   * @param {Object} trainer - Datos del entrenador
   * @param {Object} options - { showButton, onVerPerfil }
   */
  static render(trainer, options = {}) {
    const { showButton = true, onVerPerfil = null } = options;

    const card = document.createElement("div");
    card.className = "trainer-card";
    card.style.cssText = `
      background: var(--bg-secondary);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: transform 0.3s, box-shadow 0.3s;
    `;

    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-6px)";
      card.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "none";
    });

    // Foto
    const imgWrapper = document.createElement("div");
    imgWrapper.style.cssText = `
      height: 200px;
      background: var(--bg-tertiary);
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    if (trainer.foto) {
      const img = document.createElement("img");
      img.src = trainer.foto;
      img.alt = escapeHtml(trainer.nombre || "Entrenador");
      img.style.cssText = "width:100%;height:100%;object-fit:cover;";
      img.onerror = () => {
        img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👤</text></svg>";
      };
      imgWrapper.appendChild(img);
    } else {
      imgWrapper.innerHTML = `<span style="font-size:64px;opacity:0.3;">👤</span>`;
    }

    // Estado badge
    const estadoBadge = trainer.estado === "activo" ? "bg-green" : trainer.estado === "pausa" ? "bg-yellow" : "bg-red";
    const badgeColors = {
      activo: "#22c55e",
      pausa: "#f59e0b",
      inactivo: "#ef4444",
    };
    const badge = document.createElement("span");
    badge.textContent = trainer.estado || "desconocido";
    badge.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: ${badgeColors[trainer.estado] || "#6b7280"};
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

    card.appendChild(imgWrapper);

    // Content
    const content = document.createElement("div");
    content.style.cssText = "padding: 16px;";

    // Nombre
    const name = document.createElement("h3");
    name.textContent = trainer.nombre || "Sin nombre";
    name.style.cssText = `
      font-family: 'Inter', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 4px;
    `;
    content.appendChild(name);

    // Especialidad
    if (trainer.especialidad) {
      const spec = document.createElement("p");
      spec.innerHTML = `🏋️ ${escapeHtml(trainer.especialidad)}`;
      spec.style.cssText = `
        font-size: 13px;
        color: var(--text-secondary);
        margin: 0 0 6px;
      `;
      content.appendChild(spec);
    }

    // Info line
    const info = document.createElement("div");
    info.style.cssText = "display:flex;gap:12px;flex-wrap:wrap;margin-bottom:10px;";

    if (trainer.aniosExperiencia) {
      const exp = document.createElement("span");
      exp.textContent = `${trainer.aniosExperiencia} años`;
      exp.style.cssText = `
        font-size: 12px;
        color: var(--text-secondary);
        background: var(--bg-tertiary);
        padding: 3px 8px;
        border-radius: 6px;
        font-family: 'Inter', sans-serif;
      `;
      info.appendChild(exp);
    }

    if (trainer.tarifaHora) {
      const fee = document.createElement("span");
      fee.textContent = `$${trainer.tarifaHora}/hr`;
      fee.style.cssText = `
        font-size: 12px;
        color: var(--accent-orange);
        font-weight: 600;
        font-family: 'Inter', sans-serif;
      `;
      info.appendChild(fee);
    }
    content.appendChild(info);

    // Gym badge
    if (trainer.gymNombre) {
      const gymBadge = document.createElement("p");
      gymBadge.innerHTML = `🏢 ${escapeHtml(trainer.gymNombre)}`;
      gymBadge.style.cssText = `
        font-size: 12px;
        color: var(--text-secondary);
        margin: 0 0 12px;
        opacity: 0.7;
      `;
      content.appendChild(gymBadge);
    }

    // Botón
    if (showButton) {
      const btn = document.createElement("button");
      btn.textContent = "Ver perfil";
      btn.className = "btn btn-primary";
      btn.style.cssText = `
        width: 100%;
        background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 10px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      `;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (onVerPerfil) onVerPerfil(trainer);
        else window.location.href = (window.location.pathname.includes('/pages/') ? '../' : '') + `trainer.html?id=${trainer.id}`;
      });
      content.appendChild(btn);
    }

    card.appendChild(content);
    return card;
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

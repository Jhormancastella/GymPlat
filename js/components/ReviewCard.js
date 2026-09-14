/**
 * ReviewCard - Reseña con estrellas, contenido y avatar
 */
export class ReviewCard {
  /**
   * Crear tarjeta de reseña
   * @param {Object} review - Datos de la reseña
   * @param {Object} options - { showActions, onEdit, onDelete, showAuthor }
   */
  static render(review, options = {}) {
    const { showActions = false, onEdit = null, onDelete = null } = options;

    const card = document.createElement("div");
    card.className = "review-card";
    card.style.cssText = `
      background: var(--bg-secondary);
      border-radius: 16px;
      padding: 20px;
      border: 1px solid var(--border-color);
      transition: transform 0.2s;
    `;

    // Header: avatar + autor + rating
    const header = document.createElement("div");
    header.style.cssText = "display:flex;align-items:center;gap:12px;margin-bottom:12px;";

    const avatar = document.createElement("div");
    avatar.style.cssText = `
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-orange), var(--accent-magenta));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      flex-shrink: 0;
    `;
    avatar.textContent = (review.autorNombre || "?").charAt(0).toUpperCase();
    header.appendChild(avatar);

    const info = document.createElement("div");
    info.style.cssText = "flex:1;";

    const author = document.createElement("h4");
    author.textContent = escapeHtml(review.autorNombre || "Anónimo");
    author.style.cssText = `
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    `;
    info.appendChild(author);

    if (review.createdAt) {
      const date = document.createElement("span");
      const d = new Date(review.createdAt);
      date.textContent = d.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      date.style.cssText = `
        font-size: 12px;
        color: var(--text-secondary);
      `;
      info.appendChild(date);
    }

    header.appendChild(info);

    // Rating stars
    const rating = document.createElement("div");
    rating.style.cssText = "margin-bottom: 8px;";
    if (review.rating) {
      let stars = "";
      for (let i = 0; i < 5; i++) {
        stars += i < review.rating ? "★" : "☆";
      }
      rating.innerHTML = `<span style="color:#f59e0b;font-size:16px;">${stars}</span>`;
    }
    card.appendChild(header);
    card.appendChild(rating);

    // Contenido
    if (review.contenido) {
      const content = document.createElement("p");
      content.textContent = review.contenido;
      content.style.cssText = `
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        color: var(--text-primary);
        line-height: 1.6;
        margin: 0 0 12px;
      `;
      card.appendChild(content);
    }

    // Media
    if (review.media && review.media.length > 0) {
      const mediaGrid = document.createElement("div");
      mediaGrid.style.cssText = "display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;";
      review.media.slice(0, 3).forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        img.style.cssText = "width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;";
        img.alt = "Foto de reseña";
        mediaGrid.appendChild(img);
      });
      card.appendChild(mediaGrid);
    }

    // Estado aprobación
    if (review.approved === false) {
      const status = document.createElement("span");
      status.textContent = "⏳ Pendiente de aprobación";
      status.style.cssText = `
        display: inline-block;
        background: #f59e0b;
        color: #fff;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
        margin-bottom: 8px;
      `;
      card.insertBefore(status, card.firstChild);
    }

    // Actions
    if (showActions) {
      const actions = document.createElement("div");
      actions.style.cssText = "display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border-color);";

      if (onEdit) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.className = "btn btn-secondary";
        editBtn.style.cssText = `
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        `;
        editBtn.addEventListener("click", () => onEdit(review));
        actions.appendChild(editBtn);
      }

      if (onDelete) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "Eliminar";
        delBtn.className = "btn btn-danger";
        delBtn.style.cssText = `
          background: transparent;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        `;
        delBtn.addEventListener("click", () => onDelete(review));
        actions.appendChild(delBtn);
      }

      card.appendChild(actions);
    }

    return card;
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

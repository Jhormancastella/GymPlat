/** Presentacion local de la ubicacion, sin servicios de mapas externos. */
export class MapEmbed {
  constructor(options = {}) {
    this.width = options.width || "100%";
    this.height = options.height || "350px";
    this.address = options.address || "Ubicacion no especificada";
  }

  render() {
    const element = document.createElement("div");
    element.className = "map-embed";
    element.style.cssText = `width:${this.width};height:${this.height};border-radius:12px;border:1px solid var(--border-color);background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;box-sizing:border-box;color:var(--text-secondary);`;
    const address = document.createElement("div");
    address.innerHTML = '<div style="font-size:42px;margin-bottom:10px;">Ubicacion</div><strong style="color:var(--text-primary);"></strong>';
    address.querySelector("strong").textContent = this.address;
    element.appendChild(address);
    return element;
  }
}

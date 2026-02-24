import { CONFIG } from './config.js';

export function renderDiagram(preset, svgElement) {
    if (!svgElement) return;

    let content = `
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#grid)"/>
      <ellipse cx="100" cy="90" rx="20" ry="25" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
      <text x="100" y="95" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9">Sujeto</text>
      <polygon points="100,170 90,185 110,185" fill="rgba(255,255,255,0.3)"/>
      <text x="100" y="195" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="8">📷</text>
    `;

    preset.lights.forEach((light) => {
        const x = 100 + (light.position.x * 12);
        const y = 90 - (light.position.z * 12);
        const color = CONFIG.COLORS[light.type] || '#ffffff';
        const label = light.type.charAt(0).toUpperCase();

        content += `
        <line x1="${x}" y1="${y}" x2="100" y2="90" stroke="${color}" stroke-width="2" stroke-opacity="0.3"/>
        <circle cx="${x}" cy="${y}" r="14" fill="${color}" fill-opacity="0.2"/>
        <circle cx="${x}" cy="${y}" r="10" fill="${color}" fill-opacity="0.9"/>
        <text x="${x}" y="${y + 4}" text-anchor="middle" fill="#000" font-size="10" font-weight="700">${label}</text>
      `;
    });

    // Legend
    const uniqueTypes = [...new Set(preset.lights.map(l => l.type))];
    uniqueTypes.forEach((type, i) => {
        content += `
        <circle cx="15" cy="${15 + i * 18}" r="5" fill="${CONFIG.COLORS[type]}"/>
        <text x="25" y="${18 + i * 18}" fill="rgba(255,255,255,0.5)" font-size="9">${CONFIG.LABELS[type] || type}</text>
      `;
    });

    svgElement.innerHTML = content;
}

import { CONFIG } from './config.js';

export function renderDiagram(preset, svgElement) {
    if (!svgElement) return;

    // Remove existing children
    while (svgElement.firstChild) {
        svgElement.removeChild(svgElement.firstChild);
    }

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const makeEl = (tag, attrs, textContent = null) => {
        const el = document.createElementNS(SVG_NS, tag);
        for (const [key, val] of Object.entries(attrs)) el.setAttribute(key, val);
        if (textContent) el.textContent = textContent;
        return el;
    };

    // --- Base Grid and Subject ---
    const defs = makeEl('defs', {});
    const pattern = makeEl('pattern', { id: 'grid', width: '20', height: '20', patternUnits: 'userSpaceOnUse' });
    pattern.appendChild(makeEl('path', { d: 'M 20 0 L 0 0 0 20', fill: 'none', stroke: 'rgba(255,255,255,0.03)', 'stroke-width': '0.5' }));
    defs.appendChild(pattern);
    svgElement.appendChild(defs);

    svgElement.appendChild(makeEl('rect', { width: '200', height: '200', fill: 'url(#grid)' }));
    svgElement.appendChild(makeEl('ellipse', { cx: '100', cy: '90', rx: '20', ry: '25', fill: 'rgba(255,255,255,0.1)', stroke: 'rgba(255,255,255,0.2)' }));
    svgElement.appendChild(makeEl('text', { x: '100', y: '95', 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.4)', 'font-size': '9' }, 'Sujeto'));
    svgElement.appendChild(makeEl('polygon', { points: '100,170 90,185 110,185', fill: 'rgba(255,255,255,0.3)' }));
    svgElement.appendChild(makeEl('text', { x: '100', y: '195', 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.3)', 'font-size': '8' }, '📷'));

    // --- Lights ---
    preset.lights.forEach((light) => {
        const x = 100 + (light.position.x * 12);
        const y = 90 - (light.position.z * 12);
        const color = CONFIG.COLORS[light.type] || '#ffffff';
        const label = light.type.charAt(0).toUpperCase();

        svgElement.appendChild(makeEl('line', { x1: x, y1: y, x2: '100', y2: '90', stroke: color, 'stroke-width': '2', 'stroke-opacity': '0.3' }));
        svgElement.appendChild(makeEl('circle', { cx: x, cy: y, r: '14', fill: color, 'fill-opacity': '0.2' }));
        svgElement.appendChild(makeEl('circle', { cx: x, cy: y, r: '10', fill: color, 'fill-opacity': '0.9' }));
        svgElement.appendChild(makeEl('text', { x: x, y: y + 4, 'text-anchor': 'middle', fill: '#000', 'font-size': '10', 'font-weight': '700' }, label));
    });

    // --- Legend ---
    const uniqueTypes = [...new Set(preset.lights.map(l => l.type))];
    uniqueTypes.forEach((type, i) => {
        const textLabel = CONFIG.LABELS[type] || type;
        const color = CONFIG.COLORS[type] || '#fff';
        const yCircle = 15 + i * 18;
        const yText = 18 + i * 18;

        svgElement.appendChild(makeEl('circle', { cx: '15', cy: yCircle, r: '5', fill: color }));
        svgElement.appendChild(makeEl('text', { x: '25', y: yText, fill: 'rgba(255,255,255,0.5)', 'font-size': '9' }, textLabel));
    });
}

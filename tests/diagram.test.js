// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderDiagram } from '../src/diagram.js';

describe('diagram.js', () => {
    let svgElement;

    beforeEach(() => {
        svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    });

    it('renderDiagram appends nodes based on preset lights safely', () => {
        const mockPreset = {
            lights: [
                { type: 'key', position: { x: 1, y: 0, z: -1 } },
                { type: 'fill', position: { x: -2, y: 0, z: -0.5 } }
            ]
        };

        renderDiagram(mockPreset, svgElement);
        
        // Should have a certain minimum number of base elements (grid, background, subject, etc.)
        expect(svgElement.childNodes.length).toBeGreaterThan(5);
        
        // It should contain the defs and grid pattern
        expect(svgElement.querySelector('defs')).not.toBeNull();
        
        // Expect light labels based on the first character
        const labels = Array.from(svgElement.querySelectorAll('text')).map(el => el.textContent);
        expect(labels).toContain('Sujeto'); // Center subject
        expect(labels).toContain('K'); // Key light
        expect(labels).toContain('F'); // Fill light
    });

    it('renderDiagram effectively clears previous children before rendering', () => {
        svgElement.innerHTML = '<path d="M0 0" id="old-child"></path>';
        
        const mockPreset = { lights: [] };
        renderDiagram(mockPreset, svgElement);
        
        expect(svgElement.querySelector('#old-child')).toBeNull();
        expect(svgElement.childNodes.length).toBeGreaterThan(0);
    });
});

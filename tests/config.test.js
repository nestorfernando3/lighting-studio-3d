import { describe, it, expect } from 'vitest';
import { CONFIG } from '../src/config.js';

const HEX_COLOR_RE = /^#[0-9a-fA-F]{3,6}$/;

describe('config.js', () => {

    it('CONFIG.COLORS has all 4 required light type keys', () => {
        const requiredKeys = ['key', 'fill', 'rim', 'back'];
        requiredKeys.forEach(key => {
            expect(CONFIG.COLORS, `missing color for "${key}"`).toHaveProperty(key);
        });
    });

    it('all CONFIG.COLORS values are valid CSS hex strings', () => {
        Object.entries(CONFIG.COLORS).forEach(([type, color]) => {
            expect(color, `invalid color for type "${type}"`).toMatch(HEX_COLOR_RE);
        });
    });

    it('CONFIG.LABELS has all 4 required light type keys', () => {
        const requiredKeys = ['key', 'fill', 'rim', 'back'];
        requiredKeys.forEach(key => {
            expect(CONFIG.LABELS, `missing label for "${key}"`).toHaveProperty(key);
        });
    });

    it('all CONFIG.LABELS values are non-empty strings', () => {
        Object.entries(CONFIG.LABELS).forEach(([type, label]) => {
            expect(typeof label, `label for "${type}" should be string`).toBe('string');
            expect(label.length, `label for "${type}" should not be empty`).toBeGreaterThan(0);
        });
    });

    it('COLORS and LABELS have the same keys', () => {
        const colorKeys = Object.keys(CONFIG.COLORS).sort();
        const labelKeys = Object.keys(CONFIG.LABELS).sort();
        expect(colorKeys).toEqual(labelKeys);
    });
});

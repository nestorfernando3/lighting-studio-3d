import { describe, it, expect } from 'vitest';
import { getPresetNames, getPreset, getAllPresets } from '../src/presets.js';

const REQUIRED_PRESET_FIELDS = ['id', 'name', 'category', 'difficulty', 'goal', 'lights'];
const REQUIRED_LIGHT_FIELDS = ['name', 'type', 'position', 'intensity', 'color'];
const VALID_LIGHT_TYPES = ['key', 'fill', 'rim', 'back', 'rect'];

describe('presets.js', () => {

    it('getPresetNames() returns a non-empty array of strings', () => {
        const names = getPresetNames();
        expect(names).toBeInstanceOf(Array);
        expect(names.length).toBeGreaterThan(0);
        names.forEach(n => expect(typeof n).toBe('string'));
    });

    it('all preset IDs match their registry keys', () => {
        const names = getPresetNames();
        names.forEach(key => {
            const preset = getPreset(key);
            expect(preset.id).toBe(key);
        });
    });

    it('every preset has all required fields', () => {
        getAllPresets().forEach(preset => {
            REQUIRED_PRESET_FIELDS.forEach(field => {
                expect(preset, `preset "${preset.id}" missing field "${field}"`).toHaveProperty(field);
            });
        });
    });

    it('every preset difficulty is between 1 and 3', () => {
        getAllPresets().forEach(preset => {
            expect(preset.difficulty, `preset "${preset.id}"`).toBeGreaterThanOrEqual(1);
            expect(preset.difficulty, `preset "${preset.id}"`).toBeLessThanOrEqual(3);
        });
    });

    it('every preset has at least one light', () => {
        getAllPresets().forEach(preset => {
            expect(preset.lights.length, `preset "${preset.id}"`).toBeGreaterThan(0);
        });
    });

    it('every light has required properties with valid types', () => {
        getAllPresets().forEach(preset => {
            preset.lights.forEach(light => {
                REQUIRED_LIGHT_FIELDS.forEach(field => {
                    expect(light, `light "${light.name}" in "${preset.id}" missing "${field}"`).toHaveProperty(field);
                });
                // position has x, y, z
                expect(typeof light.position.x).toBe('number');
                expect(typeof light.position.y).toBe('number');
                expect(typeof light.position.z).toBe('number');
                // intensity is a positive number
                expect(light.intensity).toBeGreaterThan(0);
                // color is a CSS hex string
                expect(light.color).toMatch(/^#[0-9a-fA-F]{3,6}$/);
            });
        });
    });

    it('light types are from the valid type list', () => {
        getAllPresets().forEach(preset => {
            preset.lights.forEach(light => {
                expect(VALID_LIGHT_TYPES).toContain(light.type);
            });
        });
    });

    it('getPreset() falls back to rembrandt for unknown key', () => {
        const fallback = getPreset('does-not-exist');
        expect(fallback.id).toBe('rembrandt');
    });

    it('sandbox preset has isSandbox: true', () => {
        const sandbox = getPreset('sandbox');
        expect(sandbox.isSandbox).toBe(true);
    });
});

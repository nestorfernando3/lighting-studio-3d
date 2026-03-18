import { describe, it, expect } from 'vitest';
import { DEFAULT_LANGUAGE, normalizeLanguage, parseRuntimeConfig } from '../src/runtime.js';
import { getAppCopy, getGoLabDescription, getLightTypeLabel } from '../src/localization.js';

describe('localization and runtime helpers', () => {
    it('normalizeLanguage defaults to Spanish', () => {
        expect(normalizeLanguage('')).toBe(DEFAULT_LANGUAGE);
        expect(normalizeLanguage('pt')).toBe(DEFAULT_LANGUAGE);
        expect(normalizeLanguage('en-US')).toBe('en');
    });

    it('returns translated copy for the selected language', () => {
        expect(getAppCopy('en').sections.goal).toBe('Your Goal');
        expect(getAppCopy('es').sections.goal).toBe('Tu Objetivo');
        expect(getGoLabDescription('en')).toContain('Browser-based 3D lab');
    });

    it('returns translated light labels', () => {
        expect(getLightTypeLabel('es', 'key')).toBe('Principal');
        expect(getLightTypeLabel('en', 'directional')).toBe('Directional');
    });

    it('parses runtime config from query params and storage', () => {
        const storage = new Map([['lightStudio3D.language', 'en']]);
        const previousLocalStorage = globalThis.localStorage;
        globalThis.localStorage = {
            getItem: (key) => storage.get(key) ?? null,
            setItem: (key, value) => storage.set(key, String(value))
        };

        try {
            const config = parseRuntimeConfig('?embed=1&lesson=rembrandt');
            expect(config.language).toBe('en');
            expect(config.embed).toBe(true);
            expect(config.lessonId).toBe('rembrandt');

            const override = parseRuntimeConfig('?lang=es&embed=1');
            expect(override.language).toBe('es');
        } finally {
            if (previousLocalStorage === undefined) {
                delete globalThis.localStorage;
            } else {
                globalThis.localStorage = previousLocalStorage;
            }
        }
    });
});

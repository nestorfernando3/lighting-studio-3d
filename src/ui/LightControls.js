/**
 * LightControls — handles light selection, sliders, color pickers,
 * cone/softbox controls and drag feedback in the controls panel.
 */
import { createElement, clearChildren, bindSlider } from '../utils/dom.js';

export class LightControls {
    /**
     * @param {import('../lighting.js').LightingSystem} lightingSystem
     * @param {Function} getCurrentPreset - returns current preset object
     * @param {Function} onDiagramUpdate - callback to re-render diagram
     */
    constructor(lightingSystem, getCurrentPreset, onDiagramUpdate) {
        this.lightingSystem = lightingSystem;
        this.getCurrentPreset = getCurrentPreset;
        this.onDiagramUpdate = onDiagramUpdate;
        this.selectedLightName = null;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /** Select a light: updates 3D highlight, panel, and controls */
    selectLight(light) {
        this.selectedLightName = light.name;

        // Update visual selection in lights list
        document.querySelectorAll('.light-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.lightName === light.name);
        });

        // Highlight in 3D scene
        const preset = this.getCurrentPreset();
        preset.lights.forEach(l => {
            this.lightingSystem.highlightLight(l.name, l.name === light.name);
        });

        // Show controls panel
        document.getElementById('controls-panel')?.classList.remove('collapsed');
        document.getElementById('drag-indicator')?.classList.remove('hidden');

        this.renderLightControls(light);
        this.renderLightSelector(preset, light.name);
    }

    /** Sync slider values when the light is dragged in 3D or reset */
    onLightDragged(lightName, position) {
        if (this.selectedLightName === lightName) {
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                const valEl = document.getElementById(id.replace('ctrl', 'val'));
                if (el) el.value = val;
                if (valEl) valEl.textContent = Number(val).toFixed(1);
            };
            setVal('ctrl-x', position.x);
            // Also update Y when called from resetLightPosition
            if (position.y != null) setVal('ctrl-y', position.y);
            setVal('ctrl-z', position.z);
        }

        // Keep preset data in sync for diagram updates
        const lightConfig = this.getCurrentPreset().lights.find(l => l.name === lightName);
        if (lightConfig) {
            lightConfig.position.x = position.x;
            if (position.y != null) lightConfig.position.y = position.y;
            lightConfig.position.z = position.z;
        }
        this.onDiagramUpdate();
    }

    /** Render the light-type pill selector */
    renderLightSelector(preset, selectedName = null) {
        const container = document.getElementById('light-selector');
        if (!container) return;

        clearChildren(container);

        preset.lights.forEach(light => {
            const dot = createElement('span', {
                className: 'light-select-dot',
                style: { backgroundColor: light.color }
            });

            const btn = createElement('button', {
                className: 'light-select-btn' + (light.name === selectedName ? ' active' : '')
            }, [dot, ` ${light.type.toUpperCase()}`]);

            btn.addEventListener('click', () => this.selectLight(light));
            container.appendChild(btn);
        });
    }

    /** Render the detailed sliders / controls for the selected light */
    renderLightControls(light) {
        const container = document.getElementById('light-controls');
        if (!container) return;

        clearChildren(container);

        // -- Intensity row --
        container.appendChild(this._makeSliderRow('Intensidad', 'intensity', 0, 5, 0.1, light.intensity));

        // -- Color row --
        container.appendChild(this._makeColorRow('Color', 'color', light.color));

        // -- Position rows --
        container.appendChild(this._makeSliderRow('Pos X', 'x', -5, 5, 0.1, light.position.x));
        container.appendChild(this._makeSliderRow('Altura Y', 'y', 0, 6, 0.1, light.position.y));
        container.appendChild(this._makeSliderRow('Pos Z', 'z', -5, 5, 0.1, light.position.z));

        // -- Spot cone (sandbox spot only) --
        if (light.type === 'key' && light.freeLight) {
            container.appendChild(this._makeSliderRow('Cono °', 'cone', 5, 90, 1, 45, 0));
        }

        // -- RectAreaLight dimensions --
        if (light.type === 'rect') {
            container.appendChild(this._makeSliderRow('Ancho', 'width', 0.5, 5, 0.1, 2));
            container.appendChild(this._makeSliderRow('Alto', 'height', 0.5, 4, 0.1, 1.5));
        }

        // -- Action buttons row --
        const resetBtn = createElement('button', {
            className: 'reset-light-btn',
            id: 'btn-reset-light',
            title: 'Resetear posición original'
        }, ['⟳ Resetear Posición']);

        const resetRow = createElement('div', { className: 'control-row reset-row' }, [resetBtn]);

        const preset = this.getCurrentPreset();
        if (preset?.isSandbox) {
            const dupBtn = createElement('button', {
                className: 'dup-light-btn',
                id: 'btn-dup-light',
                title: 'Duplicar luz'
            }, ['⧉']);
            resetRow.appendChild(dupBtn);
        }

        container.appendChild(resetRow);

        this._bindControlEvents(light.name);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /** Build a labelled slider row */
    _makeSliderRow(label, prop, min, max, step, value, decimals = 1) {
        const id = prop === 'intensity' || prop === 'cone' || prop === 'width' || prop === 'height'
            ? `ctrl-${prop}`
            : `ctrl-${prop}`;
        const valId = id.replace('ctrl', 'val');

        const labelEl = createElement('span', { className: 'control-label' }, [label]);
        const slider = createElement('input', {
            type: 'range',
            className: 'control-slider',
            id,
            min: String(min),
            max: String(max),
            step: String(step),
            value: String(value)
        });
        const valueSpan = createElement('span', { className: 'control-value', id: valId }, [
            Number(value).toFixed(decimals)
        ]);

        return createElement('div', { className: 'control-row' }, [labelEl, slider, valueSpan]);
    }

    /** Build a labelled color-picker row */
    _makeColorRow(label, prop, initialColor) {
        const labelEl = createElement('span', { className: 'control-label' }, [label]);
        const picker = createElement('input', {
            type: 'color',
            className: 'control-color',
            id: `ctrl-${prop}`,
            value: initialColor
        });
        return createElement('div', { className: 'control-row' }, [labelEl, picker]);
    }

    /** Attach reactive input events to all controls */
    _bindControlEvents(lightName) {
        const preset = this.getCurrentPreset();

        const updatePos = (axis) => (val) => {
            this.lightingSystem.updateLightPosition(lightName, axis, val);
            const cfg = preset.lights.find(l => l.name === lightName);
            if (cfg) cfg.position[axis] = val;
            this.onDiagramUpdate();
        };

        bindSlider('ctrl-intensity', (val) => this.lightingSystem.updateLightIntensity(lightName, val));
        bindSlider('ctrl-x', updatePos('x'));
        bindSlider('ctrl-y', updatePos('y'));
        bindSlider('ctrl-z', updatePos('z'));

        // Color picker
        document.getElementById('ctrl-color')?.addEventListener('input', (e) => {
            this.lightingSystem.updateLightColor(lightName, e.target.value);
            const cfg = preset.lights.find(l => l.name === lightName);
            if (cfg) cfg.color = e.target.value;
        });

        // Spot cone angle
        bindSlider('ctrl-cone', (angleDeg) => {
            const light = this.lightingSystem.lightObjects.get(lightName);
            if (light?.isSpotLight) light.angle = (angleDeg * Math.PI) / 180;
            window.requestRender?.();
        }, 0);

        // RectAreaLight dimensions
        bindSlider('ctrl-width', (v) => {
            const light = this.lightingSystem.lightObjects.get(lightName);
            if (light?.isRectAreaLight) light.width = v;
            window.requestRender?.();
        });
        bindSlider('ctrl-height', (v) => {
            const light = this.lightingSystem.lightObjects.get(lightName);
            if (light?.isRectAreaLight) light.height = v;
            window.requestRender?.();
        });

        // Reset position button
        document.getElementById('btn-reset-light')?.addEventListener('click', () => {
            this.lightingSystem.resetLightPosition(lightName);
            const cfg = preset.lights.find(l => l.name === lightName);
            if (cfg) {
                this.renderLightControls(cfg);
                this.onDiagramUpdate();
            }
        });

        // Duplicate light button (sandbox only)
        document.getElementById('btn-dup-light')?.addEventListener('click', () => {
            const newConfig = this.lightingSystem.duplicateLight(lightName);
            if (newConfig) {
                preset.lights.push(newConfig);
                // Signal that a new light was added
                this._onDupLight?.(newConfig);
            }
        });
    }
}

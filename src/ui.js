/**
 * UI — Thin orchestrator that wires together all UI sub-modules.
 *
 * Modules:
 *  - LessonNavigator  → lesson progression, dots, progress, keyboard
 *  - LightControls    → light selection, sliders, color pickers
 *  - SandboxManager   → free-mode add/remove lights
 *  - ScreenshotExporter → PNG download
 */
import { getPresetNames, getPreset } from './presets.js';
import { switchModelForLighting, switchModel, MODEL_REGISTRY, BACKGROUND_PRESETS, setBackdropColor } from './model.js';
import { setupOnboarding } from './onboarding.js';
import { renderDiagram } from './diagram.js';
import { LessonNavigator } from './ui/LessonNavigator.js';
import { LightControls } from './ui/LightControls.js';
import { SandboxManager } from './ui/SandboxManager.js';
import { ScreenshotExporter } from './ui/ScreenshotExporter.js';

export class UI {
    constructor(lightingSystem, scene, renderer, environment) {
        this.lightingSystem = lightingSystem;
        this.scene = scene;
        this.renderer = renderer;
        this.environment = environment;
        this.currentPreset = null;

        const presetNames = getPresetNames();

        // ── Sub-modules ──────────────────────────────────────────────────────

        this.navigator = new LessonNavigator(presetNames, (index) => this.loadLesson(index));

        this.lightControls = new LightControls(
            lightingSystem,
            () => this.currentPreset,
            () => this._updateDiagram()
        );

        // Wire duplicate-light callback — push already done in LightControls._bindControlEvents
        this.lightControls._onDupLight = (newConfig) => {
            this._refreshSandboxUI(newConfig);
        };

        this.sandboxManager = new SandboxManager(
            lightingSystem,
            () => this.currentPreset,
            (newConfig) => this._onSandboxChange(newConfig)
        );

        this.screenshotExporter = new ScreenshotExporter(
            () => this.currentPreset?.id
        );

        // ── Init ─────────────────────────────────────────────────────────────

        this._setupGeneralControls();
        this._setupBackgroundControls();
        this._setupModelSelector();
        setupOnboarding(() => this.loadLesson(0));
    }

    // ── Lesson Loading ────────────────────────────────────────────────────────

    async loadLesson(index) {
        const presetNames = getPresetNames();
        if (index < 0 || index >= presetNames.length) return;

        this.navigator.index = index;
        const presetName = presetNames[index];
        this.currentPreset = getPreset(presetName);

        await switchModelForLighting(this.currentPreset.id);

        this.navigator.updateProgress(index);
        this.navigator.updateLessonHeader(this.currentPreset, index);
        this.navigator.updateGoalSection(this.currentPreset);
        this.navigator.updateObserveSection(this.currentPreset);
        this._updateDiagram();
        this._updateLightsOverview();
        this.navigator.updateNavigation(index);

        this.lightingSystem.loadPreset(this.currentPreset);

        this.lightControls.selectedLightName = null;
        this.lightControls.renderLightSelector(this.currentPreset);
        document.getElementById('controls-panel')?.classList.add('collapsed');

        // Toggle sandbox toolbar visibility
        const toolbar = document.getElementById('sandbox-toolbar');
        if (toolbar) toolbar.classList.toggle('hidden', !this.currentPreset.isSandbox);
        this.sandboxManager.setupSandboxButtons();
    }

    // ── Light drag feedback (called from main.js) ─────────────────────────────

    onLightDragged(lightName, position) {
        this.lightControls.onLightDragged(lightName, position);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    _updateDiagram() {
        const svg = document.getElementById('lighting-diagram');
        renderDiagram(this.currentPreset, svg);
    }

    _updateLightsOverview() {
        this.sandboxManager.renderLightsOverview(
            (light) => this.lightControls.selectLight(light),
            this.currentPreset?.isSandbox
        );
    }

    _onSandboxChange(newConfig) {
        this._updateLightsOverview();
        this._updateDiagram();
        this.lightControls.renderLightSelector(this.currentPreset, newConfig?.name || this.lightControls.selectedLightName);
        if (newConfig) {
            this.lightControls.selectLight(newConfig);
        } else {
            // Light was removed — clear controls if it was selected
            if (!this.currentPreset.lights.find(l => l.name === this.lightControls.selectedLightName)) {
                this.lightControls.selectedLightName = null;
                const container = document.getElementById('light-controls');
                if (container) container.innerHTML = '';
            }
            this._updateLightsOverview();
        }
    }

    _refreshSandboxUI(newConfig) {
        this._updateLightsOverview();
        this._updateDiagram();
        this.lightControls.renderLightSelector(this.currentPreset, newConfig.name);
        this.lightControls.selectLight(newConfig);
    }

    _setupGeneralControls() {
        document.getElementById('controls-toggle')?.addEventListener('click', () => {
            document.getElementById('controls-panel')?.classList.toggle('collapsed');
        });

        document.getElementById('exposure')?.addEventListener('input', (e) => {
            if (this.renderer) {
                this.renderer.toneMappingExposure = parseFloat(e.target.value);
                window.requestRender?.();
            }
        });

        document.getElementById('btn-screenshot')?.addEventListener('click', () => {
            this.screenshotExporter.takeScreenshot();
        });

        document.getElementById('btn-help')?.addEventListener('click', () => {
            document.getElementById('onboarding')?.classList.remove('hidden');
        });
    }

    _setupBackgroundControls() {
        const container = document.getElementById('bg-swatches');
        if (!container) return;

        BACKGROUND_PRESETS.forEach(preset => {
            const btn = document.createElement('button');
            btn.className = 'bg-swatch';
            btn.style.backgroundColor = preset.color;
            btn.title = preset.name;
            btn.setAttribute('aria-label', `Fondo ${preset.name}`);
            btn.addEventListener('click', () => {
                setBackdropColor(this.scene, this.environment, preset.color);
                const customInput = document.getElementById('bg-custom-color');
                if (customInput) customInput.value = preset.color;
                container.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
                btn.classList.add('active');
            });
            container.appendChild(btn);
        });

        document.getElementById('bg-custom-color')?.addEventListener('input', (e) => {
            setBackdropColor(this.scene, this.environment, e.target.value);
            container.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
        });
    }

    _setupModelSelector() {
        const container = document.getElementById('model-selector');
        if (!container) return;

        MODEL_REGISTRY.forEach((model, i) => {
            const btn = document.createElement('button');
            btn.className = 'model-card' + (i === 0 ? ' active' : '');
            btn.dataset.modelId = model.id;
            btn.title = model.description;
            btn.setAttribute('aria-label', model.name);

            const iconEl = document.createElement('span');
            iconEl.className = 'model-icon';
            iconEl.textContent = model.icon;

            const nameEl = document.createElement('span');
            nameEl.className = 'model-name';
            nameEl.textContent = model.name;

            btn.appendChild(iconEl);
            btn.appendChild(nameEl);

            btn.addEventListener('click', () => {
                switchModel(model.id);
                container.querySelectorAll('.model-card').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
            });
            container.appendChild(btn);
        });
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading')?.classList.add('hidden');
        }, 800);
    }
}

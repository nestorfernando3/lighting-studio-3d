import { getPresetNames, getPreset } from './presets.js';
import { switchModelForLighting } from './model.js';
import { setupOnboarding } from './onboarding.js';
import { renderDiagram } from './diagram.js';

export class UI {
    constructor(lightingSystem, scene, renderer) {
        this.lightingSystem = lightingSystem;
        this.scene = scene;
        this.renderer = renderer;
        this.currentIndex = 0;
        this.presetNames = getPresetNames();
        this.selectedLightName = null;
        this.currentPreset = null;

        this.init();
    }

    init() {
        this.createLessonDots();
        this.setupNavigation();
        this.setupControls();
        this.setupOnboarding();
        this.setupKeyboardShortcuts();
        this.hideLoading();
    }

    // ========== Onboarding ==========
    setupOnboarding() {
        setupOnboarding(() => {
            this.loadLesson(0);
        });
    }

    // ========== Lesson Navigation ==========
    createLessonDots() {
        const container = document.getElementById('lesson-dots');
        if (!container) return;

        this.presetNames.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'lesson-dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', () => this.loadLesson(index));
            container.appendChild(dot);
        });
    }

    setupNavigation() {
        document.getElementById('btn-prev')?.addEventListener('click', () => {
            if (this.currentIndex > 0) this.loadLesson(this.currentIndex - 1);
        });

        document.getElementById('btn-next')?.addEventListener('click', () => {
            if (this.currentIndex < this.presetNames.length - 1) {
                this.loadLesson(this.currentIndex + 1);
            }
        });
    }

    async loadLesson(index) {
        if (index < 0 || index >= this.presetNames.length) return;

        this.currentIndex = index;
        const presetName = this.presetNames[index];
        this.currentPreset = getPreset(presetName);

        // Switch model based on lighting type
        await switchModelForLighting(this.currentPreset.id);

        this.updateProgress(index);
        this.updateLessonHeader(this.currentPreset, index);
        this.updateGoalSection(this.currentPreset);
        this.updateObserveSection(this.currentPreset);
        this.updateDiagram(this.currentPreset);
        this.updateLightsOverview(this.currentPreset);
        this.updateNavigation(index);

        this.lightingSystem.loadPreset(this.currentPreset);

        this.selectedLightName = null;
        this.updateLightSelector(this.currentPreset);
        document.getElementById('controls-panel')?.classList.add('collapsed');
    }

    updateProgress(index) {
        const fill = document.getElementById('progress-fill');
        if (fill) {
            fill.style.width = `${((index + 1) / this.presetNames.length) * 100}%`;
        }
    }

    updateLessonHeader(preset, index) {
        const el = (id) => document.getElementById(id);

        if (el('lesson-number')) el('lesson-number').textContent = index + 1;
        if (el('lesson-category')) el('lesson-category').textContent = preset.category;
        if (el('lesson-title')) el('lesson-title').textContent = preset.name;

        const difficultyEl = document.getElementById('difficulty-badge');
        if (difficultyEl) {
            difficultyEl.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i < preset.difficulty);
            });
        }
    }

    updateGoalSection(preset) {
        const goalText = document.getElementById('goal-text');
        if (goalText) goalText.textContent = preset.goal;
    }

    updateObserveSection(preset) {
        const list = document.getElementById('observe-list');
        if (!list) return;

        list.innerHTML = '';
        (preset.whatToObserve || []).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    }

    updateDiagram(preset) {
        const svg = document.getElementById('lighting-diagram');
        renderDiagram(preset, svg);
    }

    updateLightsOverview(preset) {
        const container = document.getElementById('lights-overview-list');
        if (!container) return;

        container.innerHTML = '';

        preset.lights.forEach((light, index) => {
            const item = document.createElement('div');
            item.className = 'light-item';
            item.dataset.lightName = light.name;

            item.innerHTML = `
        <div class="light-dot" style="background-color: ${light.color}; color: ${light.color};"></div>
        <div class="light-item-info">
          <div class="light-item-name">${light.name}</div>
          <div class="light-item-role">${light.role}</div>
        </div>
      `;

            item.addEventListener('click', () => this.selectLight(light));
            container.appendChild(item);
        });
    }

    updateNavigation(index) {
        const prevBtn = document.getElementById('btn-prev');
        const nextBtn = document.getElementById('btn-next');

        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === this.presetNames.length - 1;

        document.querySelectorAll('.lesson-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // ========== Light Selection & Drag ==========
    selectLight(light) {
        this.selectedLightName = light.name;

        // Update visual selection
        document.querySelectorAll('.light-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.lightName === light.name);
        });

        // Highlight in 3D
        this.currentPreset.lights.forEach(l => {
            this.lightingSystem.highlightLight(l.name, l.name === light.name);
        });

        // Show controls
        document.getElementById('controls-panel')?.classList.remove('collapsed');
        document.getElementById('drag-indicator')?.classList.remove('hidden');

        this.updateLightControls(light);
        this.updateLightSelector(this.currentPreset, light.name);
    }

    // Called by lighting system when light is dragged
    onLightDragged(lightName, position) {
        // Update sliders if this light is selected
        if (this.selectedLightName === lightName) {
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                const valEl = document.getElementById(id.replace('ctrl', 'val'));
                if (el) el.value = val;
                if (valEl) valEl.textContent = val.toFixed(1);
            };

            setVal('ctrl-x', position.x);
            setVal('ctrl-z', position.z);
        }

        // Update local preset data for diagram
        const lightConfig = this.currentPreset.lights.find(l => l.name === lightName);
        if (lightConfig) {
            lightConfig.position.x = position.x;
            lightConfig.position.z = position.z;
        }

        // Update diagram
        this.updateDiagram(this.currentPreset);
    }

    updateLightSelector(preset, selectedName = null) {
        const container = document.getElementById('light-selector');
        if (!container) return;

        container.innerHTML = '';

        preset.lights.forEach((light) => {
            const btn = document.createElement('button');
            btn.className = 'light-select-btn' + (light.name === selectedName ? ' active' : '');
            btn.innerHTML = `
        <span class="light-select-dot" style="background-color: ${light.color};"></span>
        ${light.type.toUpperCase()}
      `;
            btn.addEventListener('click', () => this.selectLight(light));
            container.appendChild(btn);
        });
    }

    updateLightControls(light) {
        const container = document.getElementById('light-controls');
        if (!container) return;

        container.innerHTML = `
      <div class="control-row">
        <span class="control-label">Intensidad</span>
        <input type="range" class="control-slider" id="ctrl-intensity" min="0" max="5" step="0.1" value="${light.intensity}">
        <span class="control-value" id="val-intensity">${light.intensity.toFixed(1)}</span>
      </div>
      <div class="control-row">
        <span class="control-label">Color</span>
        <input type="color" class="control-color" id="ctrl-color" value="${light.color}">
      </div>
      <div class="control-row">
        <span class="control-label">Pos X</span>
        <input type="range" class="control-slider" id="ctrl-x" min="-5" max="5" step="0.1" value="${light.position.x}">
        <span class="control-value" id="val-x">${light.position.x.toFixed(1)}</span>
      </div>
      <div class="control-row">
        <span class="control-label">Altura Y</span>
        <input type="range" class="control-slider" id="ctrl-y" min="0" max="6" step="0.1" value="${light.position.y}">
        <span class="control-value" id="val-y">${light.position.y.toFixed(1)}</span>
      </div>
      <div class="control-row">
        <span class="control-label">Pos Z</span>
        <input type="range" class="control-slider" id="ctrl-z" min="-5" max="5" step="0.1" value="${light.position.z}">
        <span class="control-value" id="val-z">${light.position.z.toFixed(1)}</span>
      </div>
    `;

        this.bindControlEvents(light.name);
    }

    bindControlEvents(lightName) {
        const bind = (id, prop, axis = null) => {
            const slider = document.getElementById(id);
            const valueEl = document.getElementById(id.replace('ctrl', 'val'));

            slider?.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                if (valueEl) valueEl.textContent = val.toFixed(1);

                if (prop === 'intensity') {
                    this.lightingSystem.updateLightIntensity(lightName, val);
                } else if (axis) {
                    this.lightingSystem.updateLightPosition(lightName, axis, val);

                    // Update preset data and diagram
                    const lightConfig = this.currentPreset.lights.find(l => l.name === lightName);
                    if (lightConfig) lightConfig.position[axis] = val;
                    this.updateDiagram(this.currentPreset);
                }
            });
        };

        bind('ctrl-intensity', 'intensity');
        bind('ctrl-x', 'position', 'x');
        bind('ctrl-y', 'position', 'y');
        bind('ctrl-z', 'position', 'z');

        document.getElementById('ctrl-color')?.addEventListener('input', (e) => {
            this.lightingSystem.updateLightColor(lightName, e.target.value);

            // Update preset data
            const lightConfig = this.currentPreset.lights.find(l => l.name === lightName);
            if (lightConfig) lightConfig.color = e.target.value;
        });
    }

    // ========== General Controls ==========
    setupControls() {
        document.getElementById('controls-toggle')?.addEventListener('click', () => {
            document.getElementById('controls-panel')?.classList.toggle('collapsed');
        });

        document.getElementById('exposure')?.addEventListener('input', (e) => {
            if (this.renderer) {
                this.renderer.toneMappingExposure = parseFloat(e.target.value);
                if (window.requestRender) window.requestRender();
            }
        });

        document.getElementById('btn-screenshot')?.addEventListener('click', () => this.takeScreenshot());
        document.getElementById('btn-help')?.addEventListener('click', () => {
            document.getElementById('onboarding')?.classList.remove('hidden');
        });
    }

    takeScreenshot() {
        const canvas = document.getElementById('scene-canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `lighting-${this.currentPreset?.id || 'studio'}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    }

    // ========== Keyboard Shortcuts ==========
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (this.currentIndex > 0) this.loadLesson(this.currentIndex - 1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (this.currentIndex < this.presetNames.length - 1) {
                        this.loadLesson(this.currentIndex + 1);
                    }
                    break;
                case 'r': case 'R':
                    window.controls?.reset();
                    break;
                case '1': case '2': case '3': case '4': case '5': case '6': case '7':
                    const idx = parseInt(e.key) - 1;
                    if (idx < this.presetNames.length) this.loadLesson(idx);
                    break;
            }
        });
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading')?.classList.add('hidden');
        }, 800);
    }
}

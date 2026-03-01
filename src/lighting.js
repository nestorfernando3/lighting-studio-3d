import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

// Init RectAreaLight support
RectAreaLightUniformsLib.init();

const sharedGeometries = {
    sphere: new THREE.SphereGeometry(0.15, 16, 16),
    ring: new THREE.RingGeometry(0.22, 0.26, 32),
    arrow: new THREE.ConeGeometry(0.05, 0.12, 4),
    hitbox: new THREE.SphereGeometry(0.5, 12, 12) // Larger hitbox for easier touch selection
};

// Max drag constraints
const DRAG_CLAMP_XZ = 4;
const DRAG_CLAMP_Y_MIN = 0.5;
const DRAG_CLAMP_Y_MAX = 5.0;
const DRAG_MAX_DISTANCE = 5; // Max distance from center before ignoring drag
const DRAG_TIMEOUT_MS = 10000; // Auto-cancel drag after 10 seconds

export class LightingSystem {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.lights = [];
        this.helpers = [];
        this.lightObjects = new Map();
        this.helperMap = new Map();
        this.ambientLight = null;
        this.showHelpers = true;

        // Drag state
        this.isDragging = false;
        this.draggedLight = null;
        this.dragPlane = new THREE.Plane();
        this.intersectionPoint = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Callbacks
        this.onLightDragStart = null;
        this.onLightDrag = null;
        this.onLightDragEnd = null;
        this.onChange = null;

        this.setupDragControls();
    }

    setupDragControls() {
        const canvas = this.renderer.domElement;

        canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        canvas.addEventListener('mouseleave', () => this.onMouseUp());

        // Touch support
        canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        canvas.addEventListener('touchend', () => this.onMouseUp());
    }

    updateMouse(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    getHelpersUnderMouse() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const helperMeshes = this.helpers
            .filter(h => h.userData.type === 'helper' && h.visible)
            .flatMap(h => h.children);

        return this.raycaster.intersectObjects(helperMeshes, true);
    }

    onMouseDown(e) {
        this.updateMouse(e);
        const intersects = this.getHelpersUnderMouse();

        if (intersects.length > 0) {
            e.preventDefault();
            e.stopPropagation();

            // Find the light associated with this helper
            let helper = intersects[0].object;
            while (helper && !helper.userData.light) {
                helper = helper.parent;
            }

            if (helper && helper.userData.light) {
                this.startDrag(helper.userData.light);
            }
        }
    }

    onTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.updateMouse(touch);
            const intersects = this.getHelpersUnderMouse();

            if (intersects.length > 0) {
                e.preventDefault();

                let helper = intersects[0].object;
                while (helper && !helper.userData.light) {
                    helper = helper.parent;
                }

                if (helper && helper.userData.light) {
                    this.startDrag(helper.userData.light);
                }
            }
        }
    }

    startDrag(light) {
        this.isDragging = true;
        this.draggedLight = light;

        // Save original position for rollback if drag goes wrong
        this._dragOriginalPosition = light.position.clone();

        // Create a plane at the light's height facing the camera
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0;
        cameraDirection.normalize();

        this.dragPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(0, 1, 0), // Horizontal plane
            light.position
        );

        // Add visual feedback
        document.body.classList.add('dragging-light');

        // Safety timeout — auto-cancel drag after 10 seconds
        this._dragTimeout = setTimeout(() => {
            if (this.isDragging) {
                console.warn('Drag timeout — auto-cancelling');
                this.onMouseUp();
            }
        }, DRAG_TIMEOUT_MS);

        if (this.onLightDragStart) {
            this.onLightDragStart(light.name);
        }
    }

    onMouseMove(e) {
        this.updateMouse(e);

        if (this.isDragging && this.draggedLight) {
            this.performDrag();
        } else {
            // Hover state
            const intersects = this.getHelpersUnderMouse();
            const canvas = this.renderer.domElement;

            if (intersects.length > 0) {
                canvas.classList.add('light-draggable');
            } else {
                canvas.classList.remove('light-draggable');
            }
        }
    }

    onTouchMove(e) {
        if (this.isDragging && e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            this.updateMouse(touch);
            this.performDrag();
        }
    }

    performDrag() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersectionPoint)) {
            const ix = this.intersectionPoint.x;
            const iz = this.intersectionPoint.z;

            // Guard against NaN / Infinity from bad intersections
            if (!isFinite(ix) || !isFinite(iz)) return;

            // Ignore if intersection is too far from center (prevents fly-away)
            if (Math.sqrt(ix * ix + iz * iz) > DRAG_MAX_DISTANCE) return;

            // Apply position with tighter constraints
            const newX = THREE.MathUtils.clamp(ix, -DRAG_CLAMP_XZ, DRAG_CLAMP_XZ);
            const newZ = THREE.MathUtils.clamp(iz, -DRAG_CLAMP_XZ, DRAG_CLAMP_XZ);

            this.draggedLight.position.x = newX;
            this.draggedLight.position.z = newZ;

            this.updateHelpers();

            if (this.onLightDrag) {
                this.onLightDrag(this.draggedLight.name, {
                    x: newX,
                    y: this.draggedLight.position.y,
                    z: newZ
                });
            }
        }
    }

    onMouseUp() {
        if (this.isDragging) {
            // Clear safety timeout
            if (this._dragTimeout) {
                clearTimeout(this._dragTimeout);
                this._dragTimeout = null;
            }

            document.body.classList.remove('dragging-light');

            if (this.onLightDragEnd && this.draggedLight) {
                this.onLightDragEnd(this.draggedLight.name);
            }

            this.isDragging = false;
            this.draggedLight = null;
            this._dragOriginalPosition = null;
        }
    }

    // Check if we're dragging (to disable orbit controls)
    isDraggingLight() {
        return this.isDragging;
    }

    // Reset a light to its original preset position
    resetLightPosition(name) {
        const light = this.getLight(name);
        if (light) {
            // Use the deep-cloned original position (not the mutated config reference)
            const pos = light.userData.originalPosition || light.userData.config?.position;
            if (!pos) return;
            light.position.set(pos.x, pos.y, pos.z);
            this.updateHelpers();
            if (this.onLightDrag) {
                this.onLightDrag(name, { x: pos.x, y: pos.y, z: pos.z });
            }
        }
    }

    // Duplicate an existing light
    duplicateLight(name) {
        const light = this.lightObjects.get(name);
        if (!light) return null;
        this._freeLightCounter++;
        const pos = light.position;
        const config = {
            name: `${name} Copia`,
            type: light.userData.type || 'fill',
            position: { x: pos.x + 0.5, y: pos.y, z: pos.z + 0.5 },
            intensity: light.intensity,
            color: `#${light.color.getHexString()}`,
            role: `Copia de ${name}`,
            freeLight: true,
            freeLightType: light.userData.freeLightType || 'point'
        };
        this.createLight(config);
        return config;
    }

    // Free illumination mode: create a new light of any type
    _freeLightCounter = 0;
    addFreeLight(lightType = 'spot') {
        this._freeLightCounter++;
        const typeLabels = {
            spot: 'Spot',
            point: 'Point',
            directional: 'Directional',
            rect: 'Softbox'
        };
        const typeConfigs = {
            spot: { type: 'key', intensity: 2.5, color: '#ffffff', position: { x: 1.5, y: 3.0, z: 1.5 } },
            point: { type: 'fill', intensity: 2.0, color: '#ffeedd', position: { x: -1.5, y: 2.5, z: 1.0 } },
            directional: { type: 'rim', intensity: 2.0, color: '#e0e8ff', position: { x: 0, y: 3.5, z: -2.0 } },
            rect: { type: 'rect', intensity: 3.0, color: '#fff5e8', position: { x: 1.0, y: 2.5, z: 2.0 } }
        };
        const cfg = typeConfigs[lightType] || typeConfigs.spot;
        const name = `${typeLabels[lightType] || 'Luz'} ${this._freeLightCounter}`;

        const config = {
            name,
            type: cfg.type,
            position: { ...cfg.position },
            intensity: cfg.intensity,
            color: cfg.color,
            role: `${typeLabels[lightType] || 'Luz'} libre`,
            freeLight: true,
            freeLightType: lightType
        };

        this.createLight(config);
        return config;
    }

    // Remove a specific light by name
    removeLight(name) {
        const light = this.lightObjects.get(name);
        if (!light) return false;

        // Remove light from scene
        if (light.target) this.scene.remove(light.target);
        this.scene.remove(light);

        // Remove helpers
        const helperData = this.helperMap.get(name);
        if (helperData) {
            this.scene.remove(helperData.group);
            this.scene.remove(helperData.line);
            this.helpers = this.helpers.filter(h =>
                h !== helperData.group && h !== helperData.line
            );
            this.helperMap.delete(name);
        }

        this.lights = this.lights.filter(l => l !== light);
        this.lightObjects.delete(name);
        if (this.onChange) this.onChange();
        return true;
    }

    clearLights() {
        this.lights.forEach(light => {
            if (light.target) this.scene.remove(light.target);
            this.scene.remove(light);
        });
        this.helpers.forEach(helper => {
            this.scene.remove(helper);
        });
        this.lights = [];
        this.helpers = [];
        this.lightObjects.clear();
        this.helperMap.clear();
        if (this.onChange) this.onChange();
    }

    createLight(config) {
        const { type, name, position, intensity, color, enabled } = config;

        let light;

        switch (type) {
            case 'key':
                light = new THREE.SpotLight(color, intensity, 0, Math.PI / 4, 0.5, 1.5);
                light.castShadow = true;
                light.shadow.mapSize.width = 2048;
                light.shadow.mapSize.height = 2048;
                light.shadow.camera.near = 0.5;
                light.shadow.camera.far = 20;
                light.shadow.bias = -0.0001;
                light.shadow.radius = 4;
                break;

            case 'fill':
                light = new THREE.PointLight(color, intensity, 0, 1.8);
                light.castShadow = false;
                break;

            case 'rim':
            case 'back':
                light = new THREE.SpotLight(color, intensity, 0, Math.PI / 3, 0.3, 1.5);
                light.castShadow = false;
                break;

            case 'rect': {
                const rectLight = new THREE.RectAreaLight(color, intensity, 2, 1.5);
                light = rectLight;
                break;
            }

            default:
                light = new THREE.PointLight(color, intensity, 0, 2);
        }

        light.position.set(position.x, position.y, position.z);
        light.name = name;
        light.userData.type = type;
        light.userData.config = config;
        // Deep-clone the original position so reset always works,
        // even after sliders or drag mutate config.position
        light.userData.originalPosition = { x: position.x, y: position.y, z: position.z };
        light.userData.enabled = enabled !== false;
        light.visible = enabled !== false;

        if (light.target) {
            const target = new THREE.Object3D();
            target.position.set(0, 1.6, 0);
            this.scene.add(target);
            light.target = target;
        }

        this.scene.add(light);
        this.lights.push(light);
        this.lightObjects.set(name, light);

        this.createLightHelper(light, type, color);
        if (this.onChange) this.onChange();

        return light;
    }

    createLightHelper(light, type, color) {
        const helperGroup = new THREE.Group();

        // Main sphere (draggable)
        const sphereMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.95
        });
        const sphere = new THREE.Mesh(sharedGeometries.sphere, sphereMat);
        helperGroup.add(sphere);

        // Invisible larger Hitbox for easier touch selection
        const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitbox = new THREE.Mesh(sharedGeometries.hitbox, hitboxMat);
        helperGroup.add(hitbox);

        // Outer ring
        const ringMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(sharedGeometries.ring, ringMat);
        helperGroup.add(ring);

        // Drag indicator arrows
        const arrowsGroup = new THREE.Group();
        const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });

        const directions = [
            { pos: [0.35, 0, 0], rot: [0, 0, -Math.PI / 2] },
            { pos: [-0.35, 0, 0], rot: [0, 0, Math.PI / 2] },
            { pos: [0, 0, 0.35], rot: [Math.PI / 2, 0, 0] },
            { pos: [0, 0, -0.35], rot: [-Math.PI / 2, 0, 0] }
        ];

        directions.forEach(d => {
            const arrow = new THREE.Mesh(sharedGeometries.arrow, arrowMat);
            arrow.position.set(...d.pos);
            arrow.rotation.set(...d.rot);
            arrowsGroup.add(arrow);
        });

        arrowsGroup.visible = false;
        helperGroup.add(arrowsGroup);
        helperGroup.userData.arrows = arrowsGroup;

        helperGroup.position.copy(light.position);
        helperGroup.userData.light = light;
        helperGroup.userData.type = 'helper';
        helperGroup.visible = this.showHelpers;

        // For RectAreaLight — attach the native area light helper
        if (light.isRectAreaLight) {
            const rectHelper = new RectAreaLightHelper(light);
            helperGroup.add(rectHelper);
        }

        // Connection line
        const points = [light.position.clone(), new THREE.Vector3(0, 1.6, 0)];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineDashedMaterial({
            color: color,
            transparent: true,
            opacity: 0.3,
            dashSize: 0.2,
            gapSize: 0.1
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        line.userData.light = light;
        line.userData.type = 'line';
        line.visible = this.showHelpers;

        this.scene.add(helperGroup);
        this.scene.add(line);
        this.helpers.push(helperGroup, line);
        this.helperMap.set(light.name, { group: helperGroup, line });
        if (this.onChange) this.onChange();
    }

    updateHelpers() {
        this.helpers.forEach(helper => {
            if (helper.userData.light) {
                const light = helper.userData.light;

                if (helper.userData.type === 'helper') {
                    helper.position.copy(light.position);
                    helper.visible = this.showHelpers && light.visible;
                } else if (helper.userData.type === 'line') {
                    const points = [light.position.clone(), new THREE.Vector3(0, 1.6, 0)];
                    helper.geometry.setFromPoints(points);
                    helper.computeLineDistances();
                    helper.visible = this.showHelpers && light.visible;
                }
            }
        });
        if (this.onChange) this.onChange();
    }

    // Highlight a specific light helper
    highlightLight(name, highlight = true) {
        const helperData = this.helperMap.get(name);
        if (helperData) {
            const arrows = helperData.group.userData.arrows;
            if (arrows) {
                arrows.visible = highlight;
            }
        }
    }

    toggleHelpers(show) {
        this.showHelpers = show;
        this.helpers.forEach(helper => {
            if (helper.userData.light) {
                helper.visible = show && helper.userData.light.visible;
            }
        });
        if (this.onChange) this.onChange();
    }

    loadPreset(preset) {
        this.clearLights();
        preset.lights.forEach(lightConfig => {
            this.createLight(lightConfig);
        });
        if (this.onChange) this.onChange();
    }

    getLight(name) {
        return this.lightObjects.get(name);
    }

    updateLightIntensity(name, intensity) {
        const light = this.getLight(name);
        if (light) {
            light.intensity = intensity;
            if (this.onChange) this.onChange();
        }
    }

    updateLightColor(name, color) {
        const light = this.getLight(name);
        if (light) {
            light.color.set(color);

            this.helpers.forEach(helper => {
                if (helper.userData.light === light) {
                    if (helper.userData.type === 'helper') {
                        helper.children.forEach(child => {
                            if (child.material && !child.userData.arrows) {
                                child.material.color.set(color);
                            }
                        });
                    } else if (helper.material) {
                        helper.material.color.set(color);
                    }
                }
            });
            if (this.onChange) this.onChange();
        }
    }

    updateLightPosition(name, axis, value) {
        const light = this.getLight(name);
        if (light) {
            light.position[axis] = value;
            this.updateHelpers(); // updateHelpers calls onChange
        }
    }

    toggleLight(name, enabled) {
        const light = this.getLight(name);
        if (light) {
            light.visible = enabled;
            light.userData.enabled = enabled;
            this.updateHelpers(); // updateHelpers calls onChange
        }
    }

    setAmbientLight(light) {
        this.ambientLight = light;
        if (this.onChange) this.onChange();
    }

    updateAmbientIntensity(intensity) {
        if (this.ambientLight) {
            this.ambientLight.intensity = intensity;
            if (this.onChange) this.onChange();
        }
    }

    getLights() {
        return this.lights;
    }

    /**
     * Release all Three.js resources held by this system.
     * Call this when the lighting system is being destroyed.
     */
    dispose() {
        this.clearLights();

        // Dispose shared geometries
        Object.values(sharedGeometries).forEach(geo => geo.dispose());

        // Remove canvas event listeners by cloning (lightweight teardown)
        const canvas = this.renderer?.domElement;
        if (canvas) {
            const clone = canvas.cloneNode(false);
            canvas.parentNode?.replaceChild(clone, canvas);
        }
    }
}

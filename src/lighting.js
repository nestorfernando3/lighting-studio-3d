import * as THREE from 'three';

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
            // Apply position with constraints
            const newX = THREE.MathUtils.clamp(this.intersectionPoint.x, -6, 6);
            const newZ = THREE.MathUtils.clamp(this.intersectionPoint.z, -6, 6);

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
            document.body.classList.remove('dragging-light');

            if (this.onLightDragEnd && this.draggedLight) {
                this.onLightDragEnd(this.draggedLight.name);
            }

            this.isDragging = false;
            this.draggedLight = null;
        }
    }

    // Check if we're dragging (to disable orbit controls)
    isDraggingLight() {
        return this.isDragging;
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

            default:
                light = new THREE.PointLight(color, intensity, 0, 2);
        }

        light.position.set(position.x, position.y, position.z);
        light.name = name;
        light.userData.type = type;
        light.userData.config = config;
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

        return light;
    }

    createLightHelper(light, type, color) {
        const helperGroup = new THREE.Group();

        // Main sphere (draggable)
        const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.95
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        helperGroup.add(sphere);

        // Outer ring
        const ringGeo = new THREE.RingGeometry(0.22, 0.26, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        helperGroup.add(ring);

        // Drag indicator arrows
        const arrowsGroup = new THREE.Group();
        const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
        const arrowGeo = new THREE.ConeGeometry(0.05, 0.12, 4);

        const directions = [
            { pos: [0.35, 0, 0], rot: [0, 0, -Math.PI / 2] },
            { pos: [-0.35, 0, 0], rot: [0, 0, Math.PI / 2] },
            { pos: [0, 0, 0.35], rot: [Math.PI / 2, 0, 0] },
            { pos: [0, 0, -0.35], rot: [-Math.PI / 2, 0, 0] }
        ];

        directions.forEach(d => {
            const arrow = new THREE.Mesh(arrowGeo, arrowMat);
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
    }

    loadPreset(preset) {
        this.clearLights();
        preset.lights.forEach(lightConfig => {
            this.createLight(lightConfig);
        });
    }

    getLight(name) {
        return this.lightObjects.get(name);
    }

    updateLightIntensity(name, intensity) {
        const light = this.getLight(name);
        if (light) {
            light.intensity = intensity;
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
        }
    }

    updateLightPosition(name, axis, value) {
        const light = this.getLight(name);
        if (light) {
            light.position[axis] = value;
            this.updateHelpers();
        }
    }

    toggleLight(name, enabled) {
        const light = this.getLight(name);
        if (light) {
            light.visible = enabled;
            light.userData.enabled = enabled;
            this.updateHelpers();
        }
    }

    setAmbientLight(light) {
        this.ambientLight = light;
    }

    updateAmbientIntensity(intensity) {
        if (this.ambientLight) {
            this.ambientLight.intensity = intensity;
        }
    }

    getLights() {
        return this.lights;
    }
}

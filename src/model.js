import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ====== Model registry — add more GLB models here ======
export const MODEL_REGISTRY = [
    {
        id: 'male',
        name: 'Retrato Masculino',
        icon: '👨',
        path: './models/head.glb',
        scale: 0.26,
        positionY: 1.6,
        skinColor: 0xd4a574,
        hideBase: false,
        preserveMaterial: false,
        description: 'Modelo masculino realista'
    },
    {
        id: 'female',
        name: 'Retrato Femenino',
        icon: '👩',
        path: './models/female_portrait.glb',
        scale: 2.0,
        positionY: 1.1,
        skinColor: 0xf0c9a0,
        hideBase: false,
        preserveMaterial: true,
        description: 'Modelo femenino — rostro realista'
    },
    {
        id: 'nefertiti',
        name: 'Nefertiti',
        icon: '👑',
        path: './models/female_head.glb',
        scale: 0.07,
        positionY: 0.25,
        skinColor: 0xf5c5a3,
        hideBase: true,
        preserveMaterial: true,
        materialBoost: true,      // brightens dark GLB materials
        description: 'Busto de Nefertiti'
    }
];


class ModelManager {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.modelGroup = new THREE.Group();
        this.currentHead = null;
        this.currentModelId = null;
        this.isLoading = false;
        this.baseDisk = null;
        this.bustCylinder = null;

        this.scene.add(this.modelGroup);
        this.createBase();
        this.loadModel('male');
    }

    createBase() {
        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.9,
            metalness: 0.1
        });
        this.baseDisk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.7, 0.25, 32),
            baseMat
        );
        this.baseDisk.position.y = 0.125;
        this.baseDisk.receiveShadow = true;
        this.modelGroup.add(this.baseDisk);

        const bustMat = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            roughness: 0.7,
            metalness: 0.1
        });
        this.bustCylinder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.5, 0.8, 24),
            bustMat
        );
        this.bustCylinder.position.y = 0.65;
        this.bustCylinder.castShadow = true;
        this.bustCylinder.receiveShadow = true;
        this.modelGroup.add(this.bustCylinder);

        this.modelGroup.rotation.y = Math.PI / 16;
    }

    loadModel(modelId) {
        const config = MODEL_REGISTRY.find(m => m.id === modelId);
        if (!config || this.isLoading || modelId === this.currentModelId) return;

        this.isLoading = true;
        this.currentModelId = modelId;

        // Show/hide generated base parts based on model config
        if (this.bustCylinder) this.bustCylinder.visible = !config.hideBase;
        if (this.baseDisk) this.baseDisk.visible = !config.hideBase;

        const loading = document.getElementById('loading');
        if (loading) loading.classList.remove('hidden');

        // Remove old head and dispose its resources
        if (this.currentHead) {
            this.modelGroup.remove(this.currentHead);
            this.currentHead.traverse(child => {
                child.geometry?.dispose();
                if (child.material) {
                    (Array.isArray(child.material) ? child.material : [child.material])
                        .forEach(m => m.dispose());
                }
            });
            this.currentHead = null;
        }

        // Placeholder wireframe while loading
        const placeholder = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0x444455, wireframe: true })
        );
        placeholder.position.y = config.positionY;
        placeholder.name = 'placeholder';
        this.modelGroup.add(placeholder);

        this.loader.load(
            config.path,
            (gltf) => {
                const head = gltf.scene;

                const ph = this.modelGroup.getObjectByName('placeholder');
                if (ph) this.modelGroup.remove(ph);

                head.scale.set(config.scale, config.scale, config.scale);
                head.position.set(0, config.positionY, 0);
                head.rotation.y = 0;

                head.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        if (!config.preserveMaterial) {
                            // Override with a consistent skin material
                            const orig = child.material;
                            child.material = new THREE.MeshStandardMaterial({
                                color: config.skinColor,
                                roughness: 0.5,
                                metalness: 0.0,
                                map: orig?.map || null,
                                normalMap: orig?.normalMap || null,
                                normalScale: new THREE.Vector2(0.8, 0.8)
                            });
                        } else if (config.materialBoost) {
                            // Keep original materials but boost brightness
                            const mats = Array.isArray(child.material)
                                ? child.material : [child.material];
                            mats.forEach(mat => {
                                if (mat?.isMeshStandardMaterial || mat?.isMeshPhysicalMaterial) {
                                    mat.roughness = Math.max(0.2, (mat.roughness ?? 0.8) - 0.3);
                                    mat.emissive = mat.emissive || new THREE.Color(0x000000);
                                    mat.emissive.set(0x1a1008);
                                    mat.emissiveIntensity = 0.4;
                                    mat.needsUpdate = true;
                                }
                            });
                        }
                    }
                });

                this.modelGroup.add(head);
                this.currentHead = head;
                this.isLoading = false;

                if (loading) loading.classList.add('hidden');
                if (window.requestRender) window.requestRender();
            },
            null,
            (error) => {
                console.error('Error loading model:', error);
                this.isLoading = false;
                const ph = this.modelGroup.getObjectByName('placeholder');
                if (ph) this.modelGroup.remove(ph);
                if (loading) loading.classList.add('hidden');
            }
        );
    }

    getModelGroup() {
        return this.modelGroup;
    }
}


// Singleton
let modelManager = null;

export function createPortraitModel(scene) {
    modelManager = new ModelManager(scene);
    return modelManager.getModelGroup();
}

export function getModelManager() {
    return modelManager;
}

export function switchModel(modelId) {
    if (modelManager) modelManager.loadModel(modelId);
}

// kept for preset compatibility
export function switchModelForLighting() {
    return Promise.resolve();
}


export function createEnvironment(scene) {
    // Ground
    const groundGeo = new THREE.CircleGeometry(12, 64);
    const groundMat = new THREE.MeshStandardMaterial({
        color: 0x080810,
        roughness: 0.95,
        metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);

    // Backdrop
    const backdropGeo = new THREE.PlaneGeometry(20, 12);
    const backdropMat = new THREE.MeshStandardMaterial({
        color: 0x12182a,
        roughness: 0.98,
        metalness: 0.02
    });
    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    backdrop.position.set(0, 5, -4);
    backdrop.receiveShadow = true;
    scene.add(backdrop);

    return { ground, backdrop, ambientLight };
}

// Background color presets for color testing
export const BACKGROUND_PRESETS = [
    { name: 'Negro', color: '#080810' },
    { name: 'Gris 18%', color: '#737373' },
    { name: 'Blanco', color: '#e0e0e0' },
    { name: 'Azul', color: '#1a3a5c' },
    { name: 'Verde', color: '#1a4a2a' },
    { name: 'Rojo', color: '#5c1a1a' }
];

// Change backdrop and scene background color
export function setBackdropColor(scene, environment, colorHex) {
    const color = new THREE.Color(colorHex);
    scene.background = color;
    scene.fog = new THREE.FogExp2(color, 0.04);
    if (environment.backdrop) {
        environment.backdrop.material.color.set(color);
    }
    if (environment.ground) {
        environment.ground.material.color.set(color);
    }
    if (window.requestRender) window.requestRender();
}

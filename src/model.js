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
        procedural: true,       // built with Three.js geometry, no GLB needed
        skinColor: 0xe8c4a0,
        hairColor: 0x1a0f08,
        hideBase: false,
        description: 'Modelo femenino estilizado'
    },
    {
        id: 'nefertiti',
        name: 'Nefertiti',
        icon: '👑',
        path: './models/female_head.glb',
        scale: 0.07,
        positionY: 0.25,
        hideBase: true,
        preserveMaterial: true,
        materialBoost: true,
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

        if (this.bustCylinder) this.bustCylinder.visible = !config.hideBase;
        if (this.baseDisk) this.baseDisk.visible = !config.hideBase;

        const loading = document.getElementById('loading');
        if (loading) loading.classList.remove('hidden');

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

        if (config.procedural) {
            // Build head from Three.js geometry (no GLB needed)
            const head = this.createProceduralHead(config);
            this.modelGroup.add(head);
            this.currentHead = head;
            this.isLoading = false;
            if (loading) loading.classList.add('hidden');
            if (window.requestRender) window.requestRender();
            return;
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
                            // Universal brightness boost — works on any material type
                            const mats = Array.isArray(child.material)
                                ? child.material : [child.material];
                            mats.forEach(mat => {
                                if (!mat) return;
                                // Force roughness down for more light reflection
                                if ('roughness' in mat) mat.roughness = 0.25;
                                // Add emissive if supported
                                if ('emissive' in mat) {
                                    mat.emissive = new THREE.Color(0x261808);
                                    mat.emissiveIntensity = 0.6;
                                }
                                // Boost all diffuse colors by lightening
                                if ('color' in mat && mat.color) {
                                    mat.color.multiplyScalar(1.4);
                                }
                                mat.needsUpdate = true;
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

    // Build a stylized female head from Three.js geometry
    createProceduralHead(config) {
        const skin = new THREE.MeshStandardMaterial({
            color: config.skinColor,
            roughness: 0.52,
            metalness: 0.0
        });
        const hairMat = new THREE.MeshStandardMaterial({
            color: config.hairColor || 0x1a0f08,
            roughness: 0.88,
            metalness: 0.0
        });

        const group = new THREE.Group();
        group.position.y = 1.55; // align with male head positionY

        const applyShading = mesh => {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        };

        // ---- Cranium (feminine: taller, narrower jaw) ----
        const craniumGeo = new THREE.SphereGeometry(0.46, 40, 30);
        craniumGeo.applyMatrix4(new THREE.Matrix4().makeScale(1.0, 1.12, 0.96));
        const cranium = new THREE.Mesh(craniumGeo, skin.clone());
        cranium.position.y = 0.06;
        applyShading(cranium);
        group.add(cranium);

        // ---- Jaw/chin cap (lower hemisphere, tapered for feminine chin) ----
        const jawGeo = new THREE.SphereGeometry(0.34, 36, 18, 0, Math.PI * 2, Math.PI * 0.52, Math.PI * 0.5);
        jawGeo.applyMatrix4(new THREE.Matrix4().makeScale(1.0, 0.9, 0.96));
        const jaw = new THREE.Mesh(jawGeo, skin.clone());
        jaw.position.y = -0.16;
        applyShading(jaw);
        group.add(jaw);

        // ---- Neck ----
        const neckGeo = new THREE.CylinderGeometry(0.16, 0.21, 0.48, 20);
        const neck = new THREE.Mesh(neckGeo, skin.clone());
        neck.position.y = -0.68;
        applyShading(neck);
        group.add(neck);

        // ---- Shoulder / clavicle hint ----
        const shoulderGeo = new THREE.CylinderGeometry(0.42, 0.44, 0.12, 24);
        const shoulder = new THREE.Mesh(shoulderGeo, skin.clone());
        shoulder.position.y = -0.96;
        applyShading(shoulder);
        group.add(shoulder);

        // ---- Hair cap (dark semi-sphere slightly larger than cranium) ----
        const hairGeo = new THREE.SphereGeometry(0.49, 36, 20, 0, Math.PI * 2, 0, Math.PI * 0.52);
        hairGeo.applyMatrix4(new THREE.Matrix4().makeScale(1.0, 1.08, 0.96));
        const hair = new THREE.Mesh(hairGeo, hairMat.clone());
        hair.position.y = 0.09;
        applyShading(hair);
        group.add(hair);

        return group;
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

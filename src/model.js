import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Single high-quality realistic head model
const MODEL_PATH = './models/head.glb';

class ModelManager {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.modelGroup = new THREE.Group();
        this.currentHead = null;

        this.scene.add(this.modelGroup);
        this.createBase();
        this.loadRealisticHead();
    }

    createBase() {
        // Base/pedestal
        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.9,
            metalness: 0.1
        });

        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.7, 0.25, 32),
            baseMat
        );
        base.position.y = 0.125;
        base.receiveShadow = true;
        this.modelGroup.add(base);

        // Neck/bust support
        const bustMat = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            roughness: 0.7,
            metalness: 0.1
        });

        const bust = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.5, 0.8, 24),
            bustMat
        );
        bust.position.y = 0.65;
        bust.castShadow = true;
        bust.receiveShadow = true;
        this.modelGroup.add(bust);

        // Initial rotation
        this.modelGroup.rotation.y = Math.PI / 16;
    }

    loadRealisticHead() {
        // Create placeholder
        const placeholder = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0x444455, wireframe: true })
        );
        placeholder.position.y = 1.6;
        placeholder.name = 'placeholder';
        this.modelGroup.add(placeholder);

        this.loader.load(
            MODEL_PATH,
            (gltf) => {
                const head = gltf.scene;

                // Remove placeholder
                const ph = this.modelGroup.getObjectByName('placeholder');
                if (ph) this.modelGroup.remove(ph);

                // Scale and position
                head.scale.set(0.26, 0.26, 0.26);
                head.position.set(0, 1.6, 0);
                head.rotation.y = 0;

                // Apply enhanced skin material
                head.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        const originalMat = child.material;
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0xf5d0b5,
                            roughness: 0.5,
                            metalness: 0.0,
                            map: originalMat?.map || null,
                            normalMap: originalMat?.normalMap || null,
                            normalScale: new THREE.Vector2(0.8, 0.8)
                        });
                    }
                });

                this.modelGroup.add(head);
                this.currentHead = head;

                // Hide loading
                const loading = document.getElementById('loading');
                if (loading) loading.classList.add('hidden');

                console.log('Realistic head model loaded successfully');
                if (window.requestRender) window.requestRender();
            },
            (progress) => {
                const percent = (progress.loaded / progress.total * 100).toFixed(0);
                console.log(`Loading head model: ${percent}%`);
            },
            (error) => {
                console.error('Error loading head model:', error);
            }
        );
    }

    getModelGroup() {
        return this.modelGroup;
    }
}

// Singleton instance
let modelManager = null;

export function createPortraitModel(scene) {
    modelManager = new ModelManager(scene);
    return modelManager.getModelGroup();
}

export function getModelManager() {
    return modelManager;
}

// Stub function for compatibility - no model switching needed
export function switchModelForLighting(lightingId) {
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
    const ambientLight = new THREE.AmbientLight(0x404060, 0.2);
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

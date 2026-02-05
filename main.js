import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createPortraitModel, createEnvironment } from './src/model.js';
import { LightingSystem } from './src/lighting.js';
import { UI } from './src/ui.js';

// Scene
const canvas = document.getElementById('scene-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080810);
scene.fog = new THREE.FogExp2(0x080810, 0.04);

// Camera
const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(2.5, 2.2, 5.5);
camera.lookAt(0, 1.65, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Orbit controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 2.5;
controls.maxDistance = 8;
controls.maxPolarAngle = Math.PI / 2 + 0.15;
controls.minPolarAngle = Math.PI / 5;
controls.target.set(0, 1.65, 0);
controls.enablePan = false;
controls.update();

window.controls = controls;

// Create model and environment
const model = createPortraitModel(scene);
const environment = createEnvironment(scene);

// Lighting system with drag support
const lightingSystem = new LightingSystem(scene, camera, renderer);
lightingSystem.setAmbientLight(environment.ambientLight);

// Disable orbit controls when dragging lights
lightingSystem.onLightDragStart = (lightName) => {
    controls.enabled = false;
};

lightingSystem.onLightDragEnd = (lightName) => {
    controls.enabled = true;
};

// UI - pass lighting system for drag updates
const ui = new UI(lightingSystem, scene, renderer);

// Connect drag events to UI updates
lightingSystem.onLightDrag = (lightName, position) => {
    ui.onLightDragged(lightName, position);
};

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    lightingSystem.updateHelpers();
    renderer.render(scene, camera);
}

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

// Debug exports
window.scene = scene;
window.camera = camera;
window.lightingSystem = lightingSystem;
window.renderer = renderer;

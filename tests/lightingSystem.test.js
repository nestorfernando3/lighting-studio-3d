/**
 * LightingSystem tests.
 * THREE.js is mocked so these run in Node without WebGL.
 *
 * NOTE: vi.mock() is hoisted by Vitest to the top of the file,
 * so all mock helpers must be defined with vi.hoisted() so they
 * are also available before the rest of the module runs.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted helpers (available inside vi.mock factories) ─────────────────────

const {
    makeColor, makeVec3, makeGeometry, makeMaterial, makeMesh, makeGroup, makeThreeLight
} = vi.hoisted(() => {
    const makeColor = () => ({ set: vi.fn(), getHexString: vi.fn(() => 'ffffff') });

    const makeVec3 = (x = 0, y = 0, z = 0) => {
        const v = { x, y, z };
        v.set = vi.fn((nx, ny, nz) => { v.x = nx; v.y = ny; v.z = nz; return v; });
        v.clone = vi.fn(() => makeVec3(v.x, v.y, v.z));
        v.copy = vi.fn((o) => { v.x = o.x; v.y = o.y; v.z = o.z; return v; });
        v.normalize = vi.fn(() => v);
        return v;
    };

    const makeGeometry = () => ({ dispose: vi.fn(), setFromPoints: vi.fn() });

    const makeMaterial = (opts = {}) => ({
        color: makeColor(),
        transparent: false,
        opacity: 1,
        visible: true,
        dispose: vi.fn(),
        ...opts
    });

    const makeMesh = () => ({
        position: makeVec3(),
        rotation: makeVec3(), // Euler angles — needs set() for arrow.rotation.set(...d.rot)
        userData: {},
        children: [],
        visible: true,
        castShadow: false,
        receiveShadow: false,
        name: '',
        add: vi.fn(),
        material: makeMaterial()
    });

    const makeGroup = () => {
        const g = { position: makeVec3(), userData: {}, children: [], visible: true, name: '' };
        g.add = vi.fn();
        g.copy = vi.fn();
        return g;
    };

    const makeThreeLight = (extra = {}) => ({
        name: '',
        position: makeVec3(),
        intensity: 1,
        color: makeColor(),
        visible: true,
        userData: {},
        castShadow: false,
        shadow: { mapSize: { width: 0, height: 0 }, camera: { near: 0, far: 0 }, bias: 0, radius: 0 },
        target: null,
        angle: 0,
        width: 2,
        height: 1.5,
        ...extra
    });

    return { makeColor, makeVec3, makeGeometry, makeMaterial, makeMesh, makeGroup, makeThreeLight };
});

// ── THREE.js mock ────────────────────────────────────────────────────────────

vi.mock('three', () => {
    const Color = vi.fn(() => makeColor());
    const Vector3 = vi.fn((x = 0, y = 0, z = 0) => makeVec3(x, y, z));
    const Vector2 = vi.fn((x = 0, y = 0) => ({ x, y }));
    const Plane = vi.fn(() => ({ setFromNormalAndCoplanarPoint: vi.fn() }));
    const Raycaster = vi.fn(() => ({
        setFromCamera: vi.fn(),
        intersectObjects: vi.fn(() => []),
        ray: { intersectPlane: vi.fn(() => false) }
    }));

    const SphereGeometry = vi.fn(() => makeGeometry());
    const RingGeometry = vi.fn(() => makeGeometry());
    const ConeGeometry = vi.fn(() => makeGeometry());
    const BufferGeometry = vi.fn(() => makeGeometry());
    const MeshBasicMaterial = vi.fn((opts) => makeMaterial(opts));
    const LineDashedMaterial = vi.fn(() => ({ ...makeMaterial(), dashSize: 0, gapSize: 0 }));
    const Mesh = vi.fn(() => makeMesh());
    const Group = vi.fn(() => makeGroup());
    const Line = vi.fn(() => ({
        userData: {},
        visible: true,
        computeLineDistances: vi.fn(),
        geometry: makeGeometry(),
        material: makeMaterial()
    }));
    const Object3D = vi.fn(() => ({ position: makeVec3(), add: vi.fn() }));

    const SpotLight = vi.fn(() => makeThreeLight({ isSpotLight: true, castShadow: true }));
    const PointLight = vi.fn(() => makeThreeLight({ isPointLight: true }));
    const RectAreaLight = vi.fn(() => makeThreeLight({ isRectAreaLight: true }));

    const MathUtils = { clamp: (v, min, max) => Math.min(Math.max(v, min), max) };

    return {
        default: {},
        Color, Vector3, Vector2, Plane, Raycaster,
        SphereGeometry, RingGeometry, ConeGeometry, BufferGeometry,
        MeshBasicMaterial, LineDashedMaterial, Mesh, Group, Line,
        SpotLight, PointLight, RectAreaLight, Object3D, MathUtils,
        PCFSoftShadowMap: 0,
        DoubleSide: 2
    };
});

vi.mock('three/examples/jsm/helpers/RectAreaLightHelper.js', () => ({
    RectAreaLightHelper: vi.fn(() => ({}))
}));
vi.mock('three/examples/jsm/lights/RectAreaLightUniformsLib.js', () => ({
    RectAreaLightUniformsLib: { init: vi.fn() }
}));

// ── System under test ────────────────────────────────────────────────────────

import { LightingSystem } from '../src/lighting.js';

const makeScene = () => ({ add: vi.fn(), remove: vi.fn() });
const makeCamera = () => ({
    getWorldDirection: vi.fn((v) => { v.x = 0; v.y = 0; v.z = -1; return v; })
});
const makeRenderer = () => ({
    domElement: {
        addEventListener: vi.fn(),
        getBoundingClientRect: vi.fn(() => ({ left: 0, top: 0, width: 800, height: 600 })),
        classList: { add: vi.fn(), remove: vi.fn() },
        cloneNode: vi.fn(() => ({ addEventListener: vi.fn() })),
        parentNode: null
    }
});

const cfg = (name = 'L', type = 'fill') => ({
    name, type,
    position: { x: 0, y: 1, z: 0 },
    intensity: 1,
    color: '#ffffff'
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe('LightingSystem', () => {
    let ls;

    beforeEach(() => {
        ls = new LightingSystem(makeScene(), makeCamera(), makeRenderer());
    });

    it('starts with no lights', () => {
        expect(ls.getLights()).toHaveLength(0);
    });

    it('createLight() adds a light to the scene and registry', () => {
        ls.createLight(cfg('Key', 'key'));
        expect(ls.getLights()).toHaveLength(1);
        expect(ls.getLight('Key')).toBeDefined();
    });

    it('createLight() supports all light types without throwing', () => {
        ['key', 'fill', 'rim', 'back', 'rect', 'unknown'].forEach((type, i) => {
            expect(() => ls.createLight(cfg(`L${i}`, type))).not.toThrow();
        });
    });

    it('removeLight() removes a light by name', () => {
        ls.createLight(cfg('Removable'));
        expect(ls.removeLight('Removable')).toBe(true);
        expect(ls.getLights()).toHaveLength(0);
        expect(ls.getLight('Removable')).toBeUndefined();
    });

    it('removeLight() returns false for non-existent lights', () => {
        expect(ls.removeLight('ghost')).toBe(false);
    });

    it('clearLights() removes all lights', () => {
        ls.createLight(cfg('A'));
        ls.createLight(cfg('B', 'key'));
        ls.clearLights();
        expect(ls.getLights()).toHaveLength(0);
    });

    it('updateLightIntensity() changes light intensity', () => {
        ls.createLight(cfg('L'));
        ls.updateLightIntensity('L', 3.5);
        expect(ls.getLight('L').intensity).toBe(3.5);
    });

    it('toggleLight() sets visibility and userData.enabled', () => {
        ls.createLight(cfg('L'));
        ls.toggleLight('L', false);
        expect(ls.getLight('L').visible).toBe(false);
        expect(ls.getLight('L').userData.enabled).toBe(false);
    });

    it('loadPreset() clears previous lights and loads new ones', () => {
        ls.createLight(cfg('Old'));
        ls.loadPreset({ lights: [cfg('NewA', 'key'), cfg('NewB')] });
        expect(ls.getLights()).toHaveLength(2);
        expect(ls.getLight('Old')).toBeUndefined();
        expect(ls.getLight('NewA')).toBeDefined();
    });

    it('updateLightPosition() sets a light axis directly', () => {
        ls.createLight(cfg('L'));
        ls.updateLightPosition('L', 'x', 2.5);
        expect(ls.getLight('L').position.x).toBe(2.5);
    });

    it('onChange callback fires after light creation and removal', () => {
        const cb = vi.fn();
        ls.onChange = cb;
        ls.createLight(cfg('CB'));
        expect(cb).toHaveBeenCalled();
        cb.mockClear();
        ls.removeLight('CB');
        expect(cb).toHaveBeenCalled();
    });

    it('dispose() clears all lights without throwing', () => {
        ls.createLight(cfg('Temp'));
        expect(() => ls.dispose()).not.toThrow();
        expect(ls.getLights()).toHaveLength(0);
    });
});

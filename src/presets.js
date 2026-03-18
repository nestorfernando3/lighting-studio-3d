// Presets de iluminación fotográfica profesional
// UPCA - Corporación Universitaria Politécnico de la Costa

import { DEFAULT_LANGUAGE, normalizeLanguage } from './runtime.js';

const presets = {
    rembrandt: {
        id: 'rembrandt',
        name: { es: 'Rembrandt', en: 'Rembrandt' },
        category: { es: 'Clásico', en: 'Classic' },
        difficulty: 1,
        goal: {
            es: 'Crear un triángulo de luz iluminado en la mejilla del lado de sombra, justo debajo del ojo.',
            en: 'Create a lit triangle on the shadow-side cheek, just below the eye.'
        },
        whatToObserve: {
            es: [
                'Busca el triángulo de luz bajo el ojo del lado en sombra',
                'La sombra de la nariz debe conectar con la sombra de la mejilla',
                'El lado iluminado del rostro tiene forma claramente definida'
            ],
            en: [
                'Look for the light triangle under the eye on the shadow side',
                'The nose shadow should connect with the cheek shadow',
                'The lit side of the face should be clearly shaped'
            ]
        },
        practice: {
            task: {
                es: 'Mueve la luz principal hasta formar el triángulo de Rembrandt y ajusta el relleno para que las sombras sigan visibles.',
                en: 'Move the key light until you form the Rembrandt triangle, then adjust fill light so the shadows remain visible.'
            },
            expectedOutput: {
                es: 'Una mitad del rostro iluminada con el triángulo visible bajo el ojo del lado en sombra.',
                en: 'One side of the face lit with a visible triangle under the eye on the shadow side.'
            }
        },
        lights: [
            {
                id: 'rembrandt-key',
                name: { es: 'Luz Principal', en: 'Key Light' },
                type: 'key',
                position: { x: 2.5, y: 3.2, z: 2.0 },
                intensity: 3.0,
                color: '#fff5e6',
                role: {
                    es: 'Ilumina el rostro en ángulo de 45° para crear el triángulo característico',
                    en: 'Lights the face at a 45° angle to create the characteristic triangle'
                }
            },
            {
                id: 'rembrandt-fill',
                name: { es: 'Luz de Relleno', en: 'Fill Light' },
                type: 'fill',
                position: { x: -2.0, y: 2.2, z: 2.5 },
                intensity: 0.6,
                color: '#e6f0ff',
                role: {
                    es: 'Suaviza las sombras sin eliminar el contraste',
                    en: 'Softens shadows without removing contrast'
                }
            },
            {
                id: 'rembrandt-back',
                name: { es: 'Luz de Fondo', en: 'Background Light' },
                type: 'back',
                position: { x: 0, y: 2.8, z: -2.5 },
                intensity: 1.5,
                color: '#ffeedd',
                role: {
                    es: 'Separa el sujeto del fondo y añade profundidad',
                    en: 'Separates the subject from the background and adds depth'
                }
            }
        ]
    },

    butterfly: {
        id: 'butterfly',
        name: { es: 'Butterfly', en: 'Butterfly' },
        category: { es: 'Glamour', en: 'Glamour' },
        difficulty: 1,
        goal: {
            es: 'Crear una sombra simétrica en forma de mariposa directamente debajo de la nariz.',
            en: 'Create a symmetrical butterfly-shaped shadow directly beneath the nose.'
        },
        whatToObserve: {
            es: [
                'La sombra bajo la nariz tiene forma de mariposa simétrica',
                'Los pómulos se ven muy definidos y esculpidos',
                'La iluminación es completamente simétrica'
            ],
            en: [
                'The shadow under the nose looks like a symmetrical butterfly',
                'The cheekbones appear strongly defined and sculpted',
                'The lighting is completely symmetrical'
            ]
        },
        practice: {
            task: {
                es: 'Coloca la luz principal por encima del sujeto y ajusta el relleno inferior para crear un patrón de mariposa claro.',
                en: 'Place the key light above the subject and adjust the lower fill to create a clear butterfly pattern.'
            },
            expectedOutput: {
                es: 'Una sombra centrada bajo la nariz con alto contraste y simetría visible.',
                en: 'A centered shadow below the nose with high contrast and visible symmetry.'
            }
        },
        lights: [
            {
                id: 'butterfly-key',
                name: { es: 'Luz Principal', en: 'Key Light' },
                type: 'key',
                position: { x: 0, y: 4.0, z: 2.5 },
                intensity: 3.2,
                color: '#ffffff',
                role: {
                    es: 'Posicionada directamente arriba para iluminación simétrica de mariposa',
                    en: 'Placed directly above for symmetrical butterfly lighting'
                }
            },
            {
                id: 'butterfly-fill',
                name: { es: 'Reflector Inferior', en: 'Lower Fill' },
                type: 'fill',
                position: { x: 0, y: 0.3, z: 2.0 },
                intensity: 0.8,
                color: '#fff8f0',
                role: {
                    es: 'Simula un reflector bajo el mentón para suavizar sombras',
                    en: 'Simulates a reflector under the chin to soften shadows'
                }
            },
            {
                id: 'butterfly-rim',
                name: { es: 'Luz de Pelo', en: 'Hair Light' },
                type: 'rim',
                position: { x: 0, y: 3.5, z: -2.0 },
                intensity: 2.0,
                color: '#ffeedd',
                role: {
                    es: 'Resalta el cabello y la silueta desde atrás',
                    en: 'Highlights the hair and silhouette from behind'
                }
            },
            {
                id: 'butterfly-back',
                name: { es: 'Luz de Fondo', en: 'Background Light' },
                type: 'back',
                position: { x: 2.0, y: 2.0, z: -2.5 },
                intensity: 1.0,
                color: '#e0e8ff',
                role: {
                    es: 'Añade separación y tono al fondo',
                    en: 'Adds separation and tone to the background'
                }
            }
        ]
    },

    loop: {
        id: 'loop',
        name: { es: 'Loop', en: 'Loop' },
        category: { es: 'Versátil', en: 'Versatile' },
        difficulty: 1,
        goal: {
            es: 'Crear una sombra pequeña y suave de la nariz que cae ligeramente hacia un lado.',
            en: 'Create a small, soft nose shadow that falls slightly to one side.'
        },
        whatToObserve: {
            es: [
                'Una pequeña sombra de loop junto a la nariz (no toca la mejilla)',
                'La iluminación se siente natural y favorecedora',
                'El rostro tiene volumen pero sin sombras dramáticas'
            ],
            en: [
                'A small loop shadow beside the nose that does not touch the cheek',
                'The lighting feels natural and flattering',
                'The face has volume without dramatic shadows'
            ]
        },
        practice: {
            task: {
                es: 'Ajusta la luz principal hasta que la sombra de la nariz caiga suavemente hacia un lado sin tocar la mejilla.',
                en: 'Adjust the key light until the nose shadow falls softly to one side without touching the cheek.'
            },
            expectedOutput: {
                es: 'Una sombra de loop sutil, natural y bien separada de la mejilla.',
                en: 'A subtle, natural loop shadow that stays clear of the cheek.'
            }
        },
        lights: [
            {
                id: 'loop-key',
                name: { es: 'Luz Principal', en: 'Key Light' },
                type: 'key',
                position: { x: 1.8, y: 3.0, z: 2.5 },
                intensity: 2.8,
                color: '#fff8f0',
                role: {
                    es: 'En ángulo de 30-40° para crear el loop sutil',
                    en: 'Set at a 30-40° angle to create the subtle loop shadow'
                }
            },
            {
                id: 'loop-fill',
                name: { es: 'Luz de Relleno', en: 'Fill Light' },
                type: 'fill',
                position: { x: -1.5, y: 2.0, z: 2.0 },
                intensity: 0.7,
                color: '#f0f5ff',
                role: {
                    es: 'Balance de sombras con ratio 2:1',
                    en: 'Balances shadows with a 2:1 ratio'
                }
            },
            {
                id: 'loop-rim',
                name: { es: 'Luz de Borde', en: 'Rim Light' },
                type: 'rim',
                position: { x: -2.0, y: 3.0, z: -1.5 },
                intensity: 1.8,
                color: '#ffe4cc',
                role: {
                    es: 'Separación y definición del contorno',
                    en: 'Adds separation and contour definition'
                }
            }
        ]
    },

    split: {
        id: 'split',
        name: { es: 'Split', en: 'Split' },
        category: { es: 'Dramático', en: 'Dramatic' },
        difficulty: 2,
        goal: {
            es: 'Dividir el rostro perfectamente en dos: una mitad iluminada y otra en sombra total.',
            en: 'Split the face perfectly in two: one half lit and the other in full shadow.'
        },
        whatToObserve: {
            es: [
                'La línea de división pasa exactamente por el centro de la nariz',
                'Una mitad del rostro está completamente oscura',
                'El efecto es muy dramático y misterioso'
            ],
            en: [
                'The dividing line passes exactly through the center of the nose',
                'One half of the face is completely dark',
                'The effect is very dramatic and mysterious'
            ]
        },
        practice: {
            task: {
                es: 'Mueve la luz principal hasta que una mitad completa del rostro quede en sombra y la división atraviese la nariz.',
                en: 'Move the key light until one full half of the face falls into shadow and the split crosses the nose.'
            },
            expectedOutput: {
                es: 'Un retrato con contraste fuerte y división vertical muy clara.',
                en: 'A portrait with strong contrast and a very clear vertical split.'
            }
        },
        lights: [
            {
                id: 'split-key',
                name: { es: 'Luz Principal', en: 'Key Light' },
                type: 'key',
                position: { x: 3.5, y: 2.5, z: 0 },
                intensity: 3.5,
                color: '#ffeedd',
                role: {
                    es: 'Posicionada a 90° para dividir el rostro perfectamente',
                    en: 'Placed at 90° to split the face perfectly'
                }
            },
            {
                id: 'split-fill',
                name: { es: 'Ambiente Mínimo', en: 'Minimal Fill' },
                type: 'fill',
                position: { x: -3.0, y: 2.0, z: 0 },
                intensity: 0.15,
                color: '#4466aa',
                role: {
                    es: 'Un toque muy sutil de luz fría en las sombras',
                    en: 'A very subtle touch of cool light in the shadows'
                }
            },
            {
                id: 'split-rim',
                name: { es: 'Contraluz', en: 'Back Rim' },
                type: 'rim',
                position: { x: -1.5, y: 3.5, z: -2.0 },
                intensity: 1.5,
                color: '#ff9966',
                role: {
                    es: 'Define el contorno del lado oscuro',
                    en: 'Defines the contour of the dark side'
                }
            }
        ]
    },

    threePoint: {
        id: 'threePoint',
        name: { es: 'Tres Puntos', en: 'Three-Point' },
        category: { es: 'Estándar', en: 'Standard' },
        difficulty: 2,
        goal: {
            es: 'Dominar el setup clásico de tres luces usado en cine, televisión y fotografía profesional.',
            en: 'Master the classic three-light setup used in film, television, and professional photography.'
        },
        whatToObserve: {
            es: [
                'La luz principal (key) define las sombras y el mood',
                'La luz de relleno (fill) controla el contraste',
                'La luz trasera (rim) separa el sujeto del fondo'
            ],
            en: [
                'The key light defines the shadows and mood',
                'The fill light controls the contrast',
                'The rim light separates the subject from the background'
            ]
        },
        practice: {
            task: {
                es: 'Configura una luz principal, una de relleno y una de borde para lograr una iluminación equilibrada de tres puntos.',
                en: 'Set up a key light, fill light, and rim light to achieve a balanced three-point lighting setup.'
            },
            expectedOutput: {
                es: 'Un retrato con separación clara del fondo y control visible del contraste.',
                en: 'A portrait with clear separation from the background and visible contrast control.'
            }
        },
        lights: [
            {
                id: 'threepoint-key',
                name: { es: 'Key Light', en: 'Key Light' },
                type: 'key',
                position: { x: 2.2, y: 3.0, z: 2.2 },
                intensity: 3.0,
                color: '#fff5e0',
                role: {
                    es: 'Luz principal que define la iluminación dominante',
                    en: 'Main light that defines the dominant lighting'
                }
            },
            {
                id: 'threepoint-fill',
                name: { es: 'Fill Light', en: 'Fill Light' },
                type: 'fill',
                position: { x: -2.0, y: 2.0, z: 2.0 },
                intensity: 0.9,
                color: '#e8f0ff',
                role: {
                    es: 'Rellena las sombras manteniendo el contraste',
                    en: 'Fills the shadows while maintaining contrast'
                }
            },
            {
                id: 'threepoint-rim',
                name: { es: 'Rim Light', en: 'Rim Light' },
                type: 'rim',
                position: { x: -0.5, y: 3.5, z: -2.5 },
                intensity: 2.2,
                color: '#ffddcc',
                role: {
                    es: 'Crea un halo de luz que separa del fondo',
                    en: 'Creates a halo of light that separates the subject from the background'
                }
            },
            {
                id: 'threepoint-back',
                name: { es: 'Background', en: 'Background' },
                type: 'back',
                position: { x: 2.0, y: 1.5, z: -3.0 },
                intensity: 0.8,
                color: '#8899bb',
                role: {
                    es: 'Ilumina sutilmente el fondo para profundidad',
                    en: 'Subtly lights the background for depth'
                }
            }
        ]
    },

    broad: {
        id: 'broad',
        name: { es: 'Broad', en: 'Broad' },
        category: { es: 'Retrato', en: 'Portrait' },
        difficulty: 2,
        goal: {
            es: 'Iluminar el lado del rostro que está más hacia la cámara, haciendo el rostro más ancho.',
            en: 'Light the side of the face that faces the camera more directly, making the face appear wider.'
        },
        whatToObserve: {
            es: [
                'El lado más cercano a la cámara está completamente iluminado',
                'El lado alejado de la cámara tiene sombras',
                'El rostro parece más ancho y lleno'
            ],
            en: [
                'The side closest to the camera is fully lit',
                'The side farther from the camera has shadows',
                'The face looks wider and fuller'
            ]
        },
        practice: {
            task: {
                es: 'Gira el sujeto hasta que el lado más cercano a la cámara reciba la luz principal y compare el efecto con Short lighting.',
                en: 'Turn the subject so the camera-side receives the key light and compare the effect with short lighting.'
            },
            expectedOutput: {
                es: 'Un rostro visualmente más ancho con el lado cercano completamente iluminado.',
                en: 'A visually wider face with the near side fully illuminated.'
            }
        },
        lights: [
            {
                id: 'broad-key',
                name: { es: 'Luz Principal', en: 'Key Light' },
                type: 'key',
                position: { x: -2.5, y: 3.0, z: 2.0 },
                intensity: 2.8,
                color: '#fff4e8',
                role: {
                    es: 'Ilumina el lado ancho (más cercano a cámara)',
                    en: 'Lights the broad side (closest to the camera)'
                }
            },
            {
                id: 'broad-fill',
                name: { es: 'Luz de Relleno', en: 'Fill Light' },
                type: 'fill',
                position: { x: 2.0, y: 2.2, z: 2.5 },
                intensity: 0.5,
                color: '#e6eeff',
                role: {
                    es: 'Suaviza levemente el lado en sombra',
                    en: 'Slightly softens the shadow side'
                }
            },
            {
                id: 'broad-rim',
                name: { es: 'Separación', en: 'Separation' },
                type: 'rim',
                position: { x: 2.5, y: 3.2, z: -1.5 },
                intensity: 1.6,
                color: '#ffd4b8',
                role: {
                    es: 'Define el contorno del lado en sombra',
                    en: 'Defines the contour of the shadow side'
                }
            }
        ]
    },

    short: {
        id: 'short',
        name: { es: 'Short', en: 'Short' },
        category: { es: 'Retrato', en: 'Portrait' },
        difficulty: 2,
        goal: {
            es: 'Iluminar el lado del rostro alejado de la cámara, adelgazando visualmente el rostro.',
            en: 'Light the side of the face farther from the camera, visually slimming the face.'
        },
        whatToObserve: {
            es: [
                'El lado alejado de la cámara está iluminado',
                'El lado más cercano tiene sombras prominentes',
                'El rostro parece más delgado y esculpido'
            ],
            en: [
                'The side farther from the camera is lit',
                'The closer side has prominent shadows',
                'The face appears slimmer and more sculpted'
            ]
        },
        practice: {
            task: {
                es: 'Ajusta la luz principal para que el lado alejado de la cámara quede iluminado y el lado cercano conserve sombras marcadas.',
                en: 'Adjust the key light so the far side from the camera is lit while the near side keeps strong shadows.'
            },
            expectedOutput: {
                es: 'Un rostro visualmente más delgado con el foco en el lado opuesto a la cámara.',
                en: 'A visually slimmer face with the emphasis on the side away from the camera.'
            }
        },
        lights: [
            {
                id: 'short-key',
                name: { es: 'Luz Principal', en: 'Key Light' },
                type: 'key',
                position: { x: 2.5, y: 3.0, z: 2.0 },
                intensity: 2.8,
                color: '#fff4e8',
                role: {
                    es: 'Ilumina el lado corto (alejado de cámara)',
                    en: 'Lights the short side (away from the camera)'
                }
            },
            {
                id: 'short-fill',
                name: { es: 'Luz de Relleno', en: 'Fill Light' },
                type: 'fill',
                position: { x: -2.0, y: 2.2, z: 2.5 },
                intensity: 0.4,
                color: '#e6eeff',
                role: {
                    es: 'Mínimo relleno para mantener el efecto adelgazante',
                    en: 'Minimal fill to preserve the slimming effect'
                }
            },
            {
                id: 'short-rim',
                name: { es: 'Separación', en: 'Separation' },
                type: 'rim',
                position: { x: -2.5, y: 3.2, z: -1.5 },
                intensity: 1.8,
                color: '#ffd4b8',
                role: {
                    es: 'Resalta el contorno del lado cercano',
                    en: 'Highlights the contour of the near side'
                }
            }
        ]
    },

    sandbox: {
        id: 'sandbox',
        name: { es: 'Modo Libre', en: 'Free Mode' },
        category: { es: 'Sandbox', en: 'Sandbox' },
        difficulty: 3,
        isSandbox: true,
        goal: {
            es: 'Experimenta libremente. Agrega, elimina y modifica cualquier tipo de luz para crear tu propio setup de iluminación.',
            en: 'Experiment freely. Add, remove, and modify any type of light to create your own lighting setup.'
        },
        whatToObserve: {
            es: [
                'Crea tu propia configuración de iluminación',
                'Prueba diferentes tipos de luces: Spot, Point, Directional',
                'Experimenta con posiciones, colores e intensidades'
            ],
            en: [
                'Create your own lighting configuration',
                'Try different light types: Spot, Point, Directional',
                'Experiment with positions, colors, and intensities'
            ]
        },
        practice: {
            task: {
                es: 'Construye una configuración propia y explica por qué elegiste cada luz.',
                en: 'Build your own setup and explain why you chose each light.'
            },
            expectedOutput: {
                es: 'Una escena original con al menos dos tipos de luz y una breve justificación.',
                en: 'An original scene with at least two light types and a short rationale.'
            }
        },
        lights: [
            {
                id: 'sandbox-ambient',
                name: { es: 'Luz Ambiente', en: 'Ambient Light' },
                type: 'fill',
                position: { x: 0, y: 3.0, z: 2.0 },
                intensity: 1.0,
                color: '#ffffff',
                role: {
                    es: 'Luz base para comenzar. ¡Agrega más luces!',
                    en: 'Base light to start with. Add more lights!'
                }
            }
        ]
    }
};

function localizeValue(value, lang) {
    const normalized = normalizeLanguage(lang);
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value[normalized] || value[DEFAULT_LANGUAGE] || value.en || value.es || value;
    }
    return value;
}

function localizeLight(light, lang) {
    return {
        ...light,
        name: localizeValue(light.name, lang),
        role: localizeValue(light.role, lang)
    };
}

export function localizePreset(preset, lang = DEFAULT_LANGUAGE) {
    const normalized = normalizeLanguage(lang);
    const observations = Array.isArray(preset.whatToObserve)
        ? preset.whatToObserve
        : (preset.whatToObserve?.[normalized]
            || preset.whatToObserve?.[DEFAULT_LANGUAGE]
            || preset.whatToObserve?.en
            || preset.whatToObserve?.es
            || []);

    return {
        ...preset,
        name: localizeValue(preset.name, normalized),
        category: localizeValue(preset.category, normalized),
        goal: localizeValue(preset.goal, normalized),
        whatToObserve: observations.map(item => localizeValue(item, normalized)),
        practice: {
            task: localizeValue(preset.practice?.task, normalized),
            expectedOutput: localizeValue(preset.practice?.expectedOutput, normalized)
        },
        lights: (preset.lights || []).map(light => localizeLight(light, normalized))
    };
}

export function getPresetNames() {
    return Object.keys(presets);
}

export function getPreset(name, lang = null) {
    const preset = presets[name] || presets.rembrandt;
    return lang ? localizePreset(preset, lang) : preset;
}

export function getAllPresets(lang = null) {
    const values = Object.values(presets);
    return lang ? values.map(preset => localizePreset(preset, lang)) : values;
}

export function getRawPresets() {
    return presets;
}

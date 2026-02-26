// Presets de iluminación fotográfica profesional
// UPCA - Corporación Universitaria Politécnico de la Costa

const presets = {
    rembrandt: {
        id: 'rembrandt',
        name: 'Rembrandt',
        category: 'Clásico',
        difficulty: 1,
        goal: 'Crear un triángulo de luz iluminado en la mejilla del lado de sombra, justo debajo del ojo.',
        whatToObserve: [
            'Busca el triángulo de luz bajo el ojo del lado en sombra',
            'La sombra de la nariz debe conectar con la sombra de la mejilla',
            'El lado iluminado del rostro tiene forma claramente definida'
        ],
        lights: [
            {
                name: 'Luz Principal',
                type: 'key',
                position: { x: 2.5, y: 3.2, z: 2.0 },
                intensity: 3.0,
                color: '#fff5e6',
                role: 'Ilumina el rostro en ángulo de 45° para crear el triángulo característico'
            },
            {
                name: 'Luz de Relleno',
                type: 'fill',
                position: { x: -2.0, y: 2.2, z: 2.5 },
                intensity: 0.6,
                color: '#e6f0ff',
                role: 'Suaviza las sombras sin eliminar el contraste'
            },
            {
                name: 'Luz de Fondo',
                type: 'back',
                position: { x: 0, y: 2.8, z: -2.5 },
                intensity: 1.5,
                color: '#ffeedd',
                role: 'Separa el sujeto del fondo y añade profundidad'
            }
        ]
    },

    butterfly: {
        id: 'butterfly',
        name: 'Butterfly',
        category: 'Glamour',
        difficulty: 1,
        goal: 'Crear una sombra simétrica en forma de mariposa directamente debajo de la nariz.',
        whatToObserve: [
            'La sombra bajo la nariz tiene forma de mariposa simétrica',
            'Los pómulos se ven muy definidos y esculpidos',
            'La iluminación es completamente simétrica'
        ],
        lights: [
            {
                name: 'Luz Principal',
                type: 'key',
                position: { x: 0, y: 4.0, z: 2.5 },
                intensity: 3.2,
                color: '#ffffff',
                role: 'Posicionada directamente arriba para iluminación simétrica de mariposa'
            },
            {
                name: 'Reflector Inferior',
                type: 'fill',
                position: { x: 0, y: 0.3, z: 2.0 },
                intensity: 0.8,
                color: '#fff8f0',
                role: 'Simula un reflector bajo el mentón para suavizar sombras'
            },
            {
                name: 'Luz de Pelo',
                type: 'rim',
                position: { x: 0, y: 3.5, z: -2.0 },
                intensity: 2.0,
                color: '#ffeedd',
                role: 'Resalta el cabello y la silueta desde atrás'
            },
            {
                name: 'Luz de Fondo',
                type: 'back',
                position: { x: 2.0, y: 2.0, z: -2.5 },
                intensity: 1.0,
                color: '#e0e8ff',
                role: 'Añade separación y tono al fondo'
            }
        ]
    },

    loop: {
        id: 'loop',
        name: 'Loop',
        category: 'Versátil',
        difficulty: 1,
        goal: 'Crear una sombra pequeña y suave de la nariz que cae ligeramente hacia un lado.',
        whatToObserve: [
            'Una pequeña sombra de loop junto a la nariz (no toca la mejilla)',
            'La iluminación se siente natural y favorecedora',
            'El rostro tiene volumen pero sin sombras dramáticas'
        ],
        lights: [
            {
                name: 'Luz Principal',
                type: 'key',
                position: { x: 1.8, y: 3.0, z: 2.5 },
                intensity: 2.8,
                color: '#fff8f0',
                role: 'En ángulo de 30-40° para crear el loop sutil'
            },
            {
                name: 'Luz de Relleno',
                type: 'fill',
                position: { x: -1.5, y: 2.0, z: 2.0 },
                intensity: 0.7,
                color: '#f0f5ff',
                role: 'Balance de sombras con ratio 2:1'
            },
            {
                name: 'Luz de Borde',
                type: 'rim',
                position: { x: -2.0, y: 3.0, z: -1.5 },
                intensity: 1.8,
                color: '#ffe4cc',
                role: 'Separación y definición del contorno'
            }
        ]
    },

    split: {
        id: 'split',
        name: 'Split',
        category: 'Dramático',
        difficulty: 2,
        goal: 'Dividir el rostro perfectamente en dos: una mitad iluminada y otra en sombra total.',
        whatToObserve: [
            'La línea de división pasa exactamente por el centro de la nariz',
            'Una mitad del rostro está completamente oscura',
            'El efecto es muy dramático y misterioso'
        ],
        lights: [
            {
                name: 'Luz Principal',
                type: 'key',
                position: { x: 3.5, y: 2.5, z: 0 },
                intensity: 3.5,
                color: '#ffeedd',
                role: 'Posicionada a 90° para dividir el rostro perfectamente'
            },
            {
                name: 'Ambiente Mínimo',
                type: 'fill',
                position: { x: -3.0, y: 2.0, z: 0 },
                intensity: 0.15,
                color: '#4466aa',
                role: 'Un toque muy sutil de luz fría en las sombras'
            },
            {
                name: 'Contraluz',
                type: 'rim',
                position: { x: -1.5, y: 3.5, z: -2.0 },
                intensity: 1.5,
                color: '#ff9966',
                role: 'Define el contorno del lado oscuro'
            }
        ]
    },

    threePoint: {
        id: 'threePoint',
        name: 'Tres Puntos',
        category: 'Estándar',
        difficulty: 2,
        goal: 'Dominar el setup clásico de tres luces usado en cine, televisión y fotografía profesional.',
        whatToObserve: [
            'La luz principal (key) define las sombras y el mood',
            'La luz de relleno (fill) controla el contraste',
            'La luz trasera (rim) separa el sujeto del fondo'
        ],
        lights: [
            {
                name: 'Key Light',
                type: 'key',
                position: { x: 2.2, y: 3.0, z: 2.2 },
                intensity: 3.0,
                color: '#fff5e0',
                role: 'Luz principal que define la iluminación dominante'
            },
            {
                name: 'Fill Light',
                type: 'fill',
                position: { x: -2.0, y: 2.0, z: 2.0 },
                intensity: 0.9,
                color: '#e8f0ff',
                role: 'Rellena las sombras manteniendo el contraste'
            },
            {
                name: 'Rim Light',
                type: 'rim',
                position: { x: -0.5, y: 3.5, z: -2.5 },
                intensity: 2.2,
                color: '#ffddcc',
                role: 'Crea un halo de luz que separa del fondo'
            },
            {
                name: 'Background',
                type: 'back',
                position: { x: 2.0, y: 1.5, z: -3.0 },
                intensity: 0.8,
                color: '#8899bb',
                role: 'Ilumina sutilmente el fondo para profundidad'
            }
        ]
    },

    broad: {
        id: 'broad',
        name: 'Broad',
        category: 'Retrato',
        difficulty: 2,
        goal: 'Iluminar el lado del rostro que está más hacia la cámara, haciendo el rostro más ancho.',
        whatToObserve: [
            'El lado más cercano a la cámara está completamente iluminado',
            'El lado alejado de la cámara tiene sombras',
            'El rostro parece más ancho y lleno'
        ],
        lights: [
            {
                name: 'Luz Principal',
                type: 'key',
                position: { x: -2.5, y: 3.0, z: 2.0 },
                intensity: 2.8,
                color: '#fff4e8',
                role: 'Ilumina el lado ancho (más cercano a cámara)'
            },
            {
                name: 'Luz de Relleno',
                type: 'fill',
                position: { x: 2.0, y: 2.2, z: 2.5 },
                intensity: 0.5,
                color: '#e6eeff',
                role: 'Suaviza levemente el lado en sombra'
            },
            {
                name: 'Separación',
                type: 'rim',
                position: { x: 2.5, y: 3.2, z: -1.5 },
                intensity: 1.6,
                color: '#ffd4b8',
                role: 'Define el contorno del lado en sombra'
            }
        ]
    },

    short: {
        id: 'short',
        name: 'Short',
        category: 'Retrato',
        difficulty: 2,
        goal: 'Iluminar el lado del rostro alejado de la cámara, adelgazando visualmente el rostro.',
        whatToObserve: [
            'El lado alejado de la cámara está iluminado',
            'El lado más cercano tiene sombras prominentes',
            'El rostro parece más delgado y esculpido'
        ],
        lights: [
            {
                name: 'Luz Principal',
                type: 'key',
                position: { x: 2.5, y: 3.0, z: 2.0 },
                intensity: 2.8,
                color: '#fff4e8',
                role: 'Ilumina el lado corto (alejado de cámara)'
            },
            {
                name: 'Luz de Relleno',
                type: 'fill',
                position: { x: -2.0, y: 2.2, z: 2.5 },
                intensity: 0.4,
                color: '#e6eeff',
                role: 'Mínimo relleno para mantener el efecto adelgazante'
            },
            {
                name: 'Separación',
                type: 'rim',
                position: { x: -2.5, y: 3.2, z: -1.5 },
                intensity: 1.8,
                color: '#ffd4b8',
                role: 'Resalta el contorno del lado cercano'
            }
        ]
    },

    sandbox: {
        id: 'sandbox',
        name: 'Modo Libre',
        category: 'Sandbox',
        difficulty: 3,
        isSandbox: true,
        goal: 'Experimenta libremente. Agrega, elimina y modifica cualquier tipo de luz para crear tu propio setup de iluminación.',
        whatToObserve: [
            'Crea tu propia configuración de iluminación',
            'Prueba diferentes tipos de luces: Spot, Point, Directional',
            'Experimenta con posiciones, colores e intensidades'
        ],
        lights: [
            {
                name: 'Luz Ambiente',
                type: 'fill',
                position: { x: 0, y: 3.0, z: 2.0 },
                intensity: 1.0,
                color: '#ffffff',
                role: 'Luz base para comenzar. ¡Agrega más luces!'
            }
        ]
    }
};

export function getPresetNames() {
    return Object.keys(presets);
}

export function getPreset(name) {
    return presets[name] || presets.rembrandt;
}

export function getAllPresets() {
    return Object.values(presets);
}

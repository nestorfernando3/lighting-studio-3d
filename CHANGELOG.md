# Changelog

Todos los cambios notables de este proyecto serán documentados aquí.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [1.1.0] - 2026-02-26

### ✨ Agregado

- **🎨 Selector de Backdrop** — Panel de controles con 6 fondos predeterminados de fotografía (Negro, Gris 18%, Blanco, Azul, Verde, Rojo) y selector de color personalizado para probar cómo reacciona la iluminación ante diferentes fondos
- **💡 Modo Iluminación Libre (Sandbox)** — Nueva lección "Modo Libre" (#8) donde los estudiantes pueden crear libremente luces de tipo Spot, Point y Directional, ajustar sus propiedades y eliminarlas. Accesible también con la tecla `8`
- **⟳ Resetear Posición de Luz** — Nuevo botón en el panel de controles para devolver cualquier luz a su posición original del preset, útil si se pierde de la vista

### 🐛 Arreglado

- **Bug crítico de arrastre de luces** — Las luces ya no se "vuelan" fuera de la escena al arrastrarlas. Se implementaron: rango de restricción más ajustado (±4 unidades), validación contra valores NaN/Infinity, límite máximo de distancia al centro (5 unidades), y timeout de seguridad de 10 segundos que cancela el drag automáticamente
- **Controles inusables después de arrastrar** — El estado de drag ahora se limpia correctamente en todos los casos, incluyendo cuando el cursor sale del canvas

### 📱 Mejorado (iPhone / Móvil)

- El panel de controles ahora es visible en pantallas medianas (\<900px) como un **bottom sheet** deslizable en lugar de ocultarse completamente
- Todos los botones, sliders y elementos táctiles tienen un mínimo de **44×44px** para cumplir con las guías de accesibilidad de Apple/Google
- Panel de lección reducido de 58vh a **45vh** en móvil para dar más espacio a la escena 3D
- Sliders más anchos y fáciles de manipular en pantallas táctiles
- Tipografía más grande para mejor legibilidad en móvil

### 🔧 Técnico

- Hitbox de helpers de luces aumentado de 0.35 a **0.5** de radio para facilitar la selección táctil
- Actualizado conteo de técnicas: **8 técnicas** (incluyendo Sandbox)
- Corregido warning de CSS: añadida propiedad estándar `line-clamp` para compatibilidad

---

## [1.0.0] - 2026-02-05

### ✨ Agregado

- **Escena 3D interactiva** con modelo de cabeza realista de alta calidad
- **5 técnicas de iluminación profesional**: Rembrandt, Butterfly, Loop, Split, Broad
- **Panel de lecciones guiadas** con objetivos y puntos de observación
- **Vista superior** (top-down) para visualizar posición de luces
- **Controles interactivos** para ajustar intensidad de luces
- **Onboarding guiado** para nuevos usuarios
- **Navegación por lecciones** con botones anterior/siguiente
- **Empaquetado multiplataforma** con Electron (Windows, macOS, Linux)

### 🎨 Interfaz

- Diseño moderno estilo glassmorphism con gradientes vibrantes
- Animaciones suaves y microinteracciones
- Panel lateral colapsable con información de lección
- Indicadores de progreso de lección
- Tipografía Inter para mejor legibilidad

### 🔧 Técnico

- Basado en Three.js para renderizado 3D WebGL
- Vite como bundler para desarrollo rápido
- Electron para distribución como aplicación de escritorio
- Modelo GLB realista con materiales PBR

---

## [0.3.0] - 2026-02-04 (Beta)

### Cambiado

- Reemplazado modelo estilizado por cabeza realista de alta calidad
- Mejorada la posición y centrado de botones de navegación
- Simplificado sistema de modelos (removido modelo Nefertiti problemático)

### Arreglado

- Corregido overflow de botones de navegación en panel lateral
- Ajustada escala y posición del modelo para mejor visualización

---

## [0.2.0] - 2026-02-04 (Alpha)

### Agregado

- Sistema de presets de iluminación con configuraciones profesionales
- Panel de controles expandible para ajustar luces
- Vista superior con representación de posición de luces
- Tooltips y tips educativos
- Branding UPCA

### Cambiado

- Rediseño completo de interfaz con estética premium
- Mejorada estructura de lecciones con objetivos claros

---

## [0.1.0] - 2026-02-04 (Prototipo)

### Agregado

- Escena 3D básica con modelo de cabeza
- Sistema de iluminación con luz principal y de relleno
- Controles de cámara orbital
- Estructura inicial del proyecto con Vite + Three.js

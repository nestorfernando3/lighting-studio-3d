# Changelog

Todos los cambios notables de este proyecto serán documentados aquí.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

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

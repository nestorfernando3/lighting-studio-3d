# Light Studio 3D - UPCA

Aplicación interactiva 3D para aprender técnicas de iluminación fotográfica profesional.

![Light Studio 3D](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 🎯 Características

- **Escena 3D interactiva** con modelo de cabeza realista
- **5 técnicas de iluminación profesional**:
  - Rembrandt
  - Butterfly (Paramount)
  - Loop
  - Split
  - Broad
- **Controles interactivos** para manipular luces en tiempo real
- **Vista superior** para entender posiciones de luces
- **Onboarding guiado** para principiantes

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/TU-USUARIO/lighting-studio-3d.git
cd lighting-studio-3d

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## 📦 Generar Ejecutables

```bash
# macOS (.app, .dmg)
npm run electron:build:mac

# Windows (.exe)
npm run electron:build:win

# Linux (.AppImage)
npm run electron:build:linux

# Todas las plataformas
npm run electron:build
```

Los ejecutables se generan en la carpeta `release/`.

## 🛠️ Stack Tecnológico

- **Three.js** - Gráficos 3D y WebGL
- **Electron** - Empaquetado como aplicación de escritorio
- **Vite** - Bundler y servidor de desarrollo
- **Vanilla JS/CSS** - Sin frameworks adicionales

## 📸 Capturas

La aplicación permite explorar diferentes técnicas de iluminación profesional usadas en fotografía de retratos.

## 📄 Licencia

MIT © UPCA

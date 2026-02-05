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

## 📥 Descargar y Ejecutar

Descarga la última versión desde [**Releases**](https://github.com/NFDELEON/lighting-studio-3d/releases/latest):

### Windows
1. Descarga `Light.Studio.3D.Setup.1.0.0.exe`
2. Ejecuta el instalador
3. Sigue las instrucciones de instalación
4. Abre **Light Studio 3D** desde el menú de inicio

### macOS (Intel)
1. Descarga `Light.Studio.3D-1.0.0.dmg`
2. Abre el archivo `.dmg`
3. Arrastra la app a la carpeta **Aplicaciones**
4. **Primera vez**: Click derecho → **Abrir** (o ejecuta en terminal: `xattr -cr /Applications/Light\ Studio\ 3D.app`)

### macOS (Apple Silicon / M1/M2/M3)
1. Descarga `Light.Studio.3D-1.0.0-arm64.dmg`
2. Sigue los mismos pasos que para Intel

---

## 🚀 Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/NFDELEON/lighting-studio-3d.git
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

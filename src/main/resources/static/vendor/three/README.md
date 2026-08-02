# Vendored Three.js r160

This directory holds vendored copies of Three.js modules required by the campus map frontend.
The files here are **placeholders** that must be replaced with the real library source before
the 3D map will function.

## Required Files

| File | Source in Three.js r160 archive |
|------|---------------------------------|
| `three.module.js` | `build/three.module.js` |
| `GLTFLoader.js` | `examples/jsm/loaders/GLTFLoader.js` |
| `OrbitControls.js` | `examples/jsm/controls/OrbitControls.js` |

## How to Vendor

1. Download the Three.js r160 release from:
   https://github.com/mrdoob/three.js/releases/tag/r160

2. Extract the downloaded archive (zip or tar.gz).

3. Copy the three files listed above from the extracted archive into this directory,
   replacing the placeholder files entirely.

4. Verify that the import map in `src/main/resources/templates/mapa.html` resolves
   to these local paths (it should already be configured correctly):

   ```json
   {
       "imports": {
           "three": "/vendor/three/three.module.js",
           "three/addons/loaders/GLTFLoader.js": "/vendor/three/GLTFLoader.js",
           "three/addons/controls/OrbitControls.js": "/vendor/three/OrbitControls.js"
       }
   }
   ```

5. No CDN or external network access is required at runtime once the real files are in place.

## Why Vendor?

Vendoring ensures the application works in:
- Air-gapped / offline environments
- Environments with strict Content Security Policy (CSP) rules
- Deployments where CDN availability cannot be guaranteed

The import map in `mapa.html` resolves bare specifiers (`'three'`, etc.) to these local
paths, so `mapa.js` uses standard import syntax without hardcoded URLs.

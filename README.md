# S08 · Interacciones con Mouse

**Bloque 2 · Sesión 01 · Diseño de Interacciones: técnicas esenciales con Mouse / Cursor.**
Interacción y Renderizado Web Avanzado (CC325-21) · CENTRO · Jueves 15 de octubre de 2026.

Este repositorio tiene todos los ejercicios de la sesión. Cada uno trae una **demo** (el resultado al que llegamos) y un **starter** (el punto de partida donde trabajas tú).

---

## Contenido

- [Antes de empezar](#antes-de-empezar)
- [Cómo usar el repositorio](#cómo-usar-el-repositorio)
- [Estructura](#estructura)
- [Overview de la clase](#overview-de-la-clase)
- [Tarea 01](#tarea-01)
- [Si algo no funciona](#si-algo-no-funciona)
- [Referencias](#referencias)

---

## Antes de empezar

Necesitas:

- **Node.js 20.19 o más nuevo** (o 22.12+). Revisa tu versión con `node -v`. Lo pide Vite, la herramienta que corre cada ejercicio.
- **npm** (viene con Node).
- **Git** para clonar el repositorio. Si no lo tienes configurado, usa **Code → Download ZIP** en GitHub.
- Un editor: **VS Code** o **Cursor**.

---

## Cómo usar el repositorio

### 1 · Clona una sola vez

El repositorio ya tiene todos los ejercicios. Lo clonas una vez al inicio de la clase y no necesitas volver a actualizarlo.

```bash
git clone https://github.com/AndrewAlva/S08-Interacciones-Mouse
```

Abre la carpeta `S08-Interacciones-Mouse` en VS Code.

### 2 · Dos terminales: demo y starter

Cada ejercicio se trabaja con **dos terminales abiertas al mismo tiempo**: una corre la demo (tu referencia) y otra corre el starter (donde programas).

**Primer ejercicio.** Abre dos terminales nuevas en VS Code (*Terminal → New Terminal*); arrancan en la raíz del repositorio:

```bash
# Terminal 1 · Demo
cd 01-Cursor-Customizado/01-Demo
npm install
npm run dev        # → http://localhost:5173
```

```bash
# Terminal 2 · Starter
cd 01-Cursor-Customizado/02-Starter
npm install
npm run dev        # → http://localhost:5174
```

**Del ejercicio 02 en adelante** usa las mismas dos terminales. Detén el servidor anterior con `Ctrl + C` y entra a la carpeta nueva:

```bash
# Terminal 1 · Demo
cd ../../02-Mouse-Follow/01-Demo
npm install
npm run dev
```

```bash
# Terminal 2 · Starter
cd ../../02-Mouse-Follow/02-Starter
npm install
npm run dev
```

Cada `../` sube un nivel: el primero te saca de `01-Demo/` (o `02-Starter/`), el segundo de la carpeta del ejercicio anterior. Así quedas en la raíz y entras al siguiente.

> **Ojo con los puertos.** Si no detienes los servidores anteriores, Vite manda los nuevos a otro puerto (`:5175`, `:5176`…) y es fácil abrir la pestaña equivocada. Siempre `Ctrl + C` antes de cambiar de ejercicio.

**Ejercicio 06 (libre)** no tiene demo: solo usas la Terminal 1 con `06-Libre/01-Starter`. Detén también la Terminal 2.

---

## Estructura

```
S08-Interacciones-Mouse/
├── 01-Cursor-Customizado/
│   ├── 01-Demo/
│   └── 02-Starter/
├── 02-Mouse-Follow/
│   ├── 01-Demo/
│   └── 02-Starter/
├── 03-Normalizacion/
│   ├── 01-Demo/
│   └── 02-Starter/
├── 04-Remapeo-Map/
│   ├── 01-Demo/
│   └── 02-Starter/
├── 05-Map-Parallax/
│   ├── 01-Demo/
│   └── 02-Starter/
└── 06-Libre/
    └── 01-Starter/
```

Cada carpeta `01-Demo/` o `02-Starter/` es un proyecto de Vite independiente, con su propio `package.json`, `index.html` y `src/`. Por eso `npm install` se corre en cada una.

---

## Overview de la clase

La sesión construye una sola cadena, un eslabón por ejercicio:

```
leer el mouse  →  normalizar  →  mapear  →  suavizar  →  dibujar
```

### Una regla para toda la sesión: leer en el evento, animar en el loop

El mouse dispara eventos a su propio ritmo (muchos por segundo, o ninguno si no se mueve). La pantalla dibuja al suyo. Por eso se separan:

- **El evento** (`pointermove`) solo **lee** y guarda datos.
- **El loop** (`requestAnimationFrame`) **calcula y dibuja** con esos datos, una vez por frame.

### 01 · Cursor customizado

*Leyendo coordenadas del mouse para posicionar un objeto.*

Un elemento de HTML/CSS reemplaza al cursor y se coloca exactamente en `clientX` / `clientY`, sin suavizado.
**Necesitas:** posicionamiento con HTML y CSS; eventos de JavaScript (`pointermove` cubre mouse y pantallas táctiles).

### 02 · Objetos 2D que siguen al mouse

*Interpolando incrementos para alcanzar una posición.*

Dos objetos: `mouse` (a dónde vamos, lo escribe el evento) y `target` (dónde estamos, lo escribe el loop y es lo que se dibuja). En cada frame, `target` recorre una fracción de lo que le falta:

```js
target.x += (mouse.x - target.x) * 0.1;
```

Con `1` no hay suavizado; con `0.1` llega con *ease out*, como el Easy Ease de After Effects.
**Necesitas:** variables y loops de animación en JavaScript; sumar, restar, multiplicar y dividir.

### 03 · Normalización de valores

*Traduciendo inputs a valores universales: de -1 a 1.*

Los píxeles dependen de la pantalla; el valor normalizado no. El centro siempre es `0` y los bordes siempre son `±1`.

```js
mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
```

- **¿Por qué de -1 a 1?** El 0 es el centro (sin input, sin efecto), el signo es la dirección, y multiplicar escala parejo hacia los dos lados.
- **¿Por qué el `-` en y?** En la pantalla, Y crece hacia abajo (como en Figma, After Effects y CSS). En Three.js y WebGL crece hacia arriba (como en Cinema 4D). El signo invierte la dirección.

**Necesitas:** variables y funciones en JavaScript; matemáticas básicas.

### 04 · Map (o remapeo) de valores

*Usar valores normalizados en animaciones e interacciones: rotación.*

Map convierte un valor de un rango a otro: primero calcula qué porcentaje del camino lleva en la entrada (`t`, de 0 a 1) y luego dónde queda ese mismo porcentaje en la salida.

```js
function map(valor, inMin, inMax, outMin, outMax) {
  const t = (valor - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

const grados = map(mouse.x, -1, 1, -90, 90);
```

En la demo, la x del mouse gira una caja de Three.js alrededor de su eje Y, y la y del mouse la gira alrededor de su eje X.
After Effects ya tiene esta función: `linear(t, tMin, tMax, valor1, valor2)`. En Three.js: `THREE.MathUtils.mapLinear()`.
**Necesitas:** variables y funciones en JavaScript; matemáticas básicas.

### 05 · Map y Parallax (práctica)

*Aplicar valores normalizados en posición / traslación.*

Un solo input y varias salidas: el mismo mouse normalizado mueve varias capas con rangos distintos (por ejemplo ±5, ±10 y ±20). La capa más cercana es la que más se mueve; esa diferencia es lo que el ojo lee como profundidad. Es la cámara 2.5D de After Effects, decidida por código.
**Necesitas:** variables y funciones en JavaScript; matemáticas básicas.

### 06 · Ejercicio libre

*Diseña y crea una composición propia con los conceptos de hoy.*

Ideas para empezar:

- **Gaze camera:** la cámara voltea hacia donde está el mouse.
- **Órbitas en capas:** elementos orbitando en distintas capas, cada una con su velocidad e interpolación.
- **Estela de color:** copias del objeto que lo siguen con retraso, cada una de otro color (efecto Sandevistan, Ashura Senku).
- **Tipografía variable:** el peso o el ancho de cada letra según su distancia al cursor.
- **Linterna:** la escena a oscuras; solo se ve lo que ilumina una luz que persigue al mouse.
- **Imán:** piezas que se jalan hacia el cursor al acercarse y regresan al alejarse.

**Necesitas:** interpolación (Mouse-Follow), normalización y mapeo de valores.

---

## Tarea 01

Termina tu composición utilizando los conceptos aprendidos hoy.

| | |
|---|---|
| **Piso** | El mouse normalizado mueve **un elemento con interpolación** y **una propiedad con `map()`**. El evento lee; el loop anima. |
| **Extensión 1** | Tres o más elementos con rangos distintos que construyan profundidad, como el parallax. |
| **Extensión 2** | Una técnica nueva (estela, imán, linterna, influencia por distancia…) con dirección de arte propia. |
| **60 FPS** | En el equipo más lento del grupo. Compruébalo en Chrome: *DevTools → Rendering → Frame rendering stats*. |
| **Fecha** | Miércoles 21 de octubre de 2026. La hora límite está en la actividad de BrightSpace. No hay entregas fuera de tiempo. |
| **Entrega** | Un **repositorio nuevo en tu cuenta de GitHub**, y su link en la actividad **Tarea 01** de BrightSpace. |
| **Defensa** | ¿Qué mapeaste y por qué ese rango? ¿Cómo sostienes 60 fps? |
| **Bitácora de IA** | En el README de tu repositorio: qué le consultaste a la IA, qué aceptaste y qué descartaste, y por qué. |

---

## Si algo no funciona

| Síntoma | Qué revisar |
|---|---|
| `npm install` falla | Tu versión de Node: `node -v`. Necesitas 20.19+ o 22.12+. |
| `cd: no such file or directory` | Dónde estás parado: `pwd` (Mac / Linux) o `cd` sin argumentos (Windows). Si abriste una terminal nueva, arranca en la raíz del repositorio: ahí va sin `../../`. |
| La página abre en otro puerto | Quedó un servidor corriendo. `Ctrl + C` en las terminales anteriores. |
| Los cambios no aparecen | Revisa que estés editando el `02-Starter` y viendo su puerto (`:5174`), no el de la demo. |
| Abrir el `index.html` con doble clic no funciona | Es normal: los módulos de JavaScript necesitan un servidor. Usa `npm run dev`. |
| Three.js no se encuentra en tu ejercicio | Instálalo en esa carpeta: `npm install three`. |

---

## Referencias

- [Pointer events · MDN (inglés)](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
- [`requestAnimationFrame` · MDN](https://developer.mozilla.org/es/docs/Web/API/Window/requestAnimationFrame)
- [Three.js · documentación](https://threejs.org/docs/)
- [`Raycaster.setFromCamera` · Three.js](https://threejs.org/docs/#api/en/core/Raycaster.setFromCamera)
- [`MathUtils.mapLinear` · Three.js](https://threejs.org/docs/#api/en/math/MathUtils)
- [Vite · Guía](https://vite.dev/guide/)

Dudas: salvaradoh@centro.edu.mx · lunes a viernes, 10:00–20:00.

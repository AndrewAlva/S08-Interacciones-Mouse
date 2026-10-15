import './style.css';
import * as THREE from 'three';
console.log("04-Remapeo-Map. 01-Demo.");

// Obtener referencias a los elementos del DOM ---------------------------------------------------------------
const normalLerpContainerX = document.getElementById("normal-lerp-x");
const normalLerpContainerY = document.getElementById("normal-lerp-y");
const rotationContainerX = document.getElementById("rotation-x");
const rotationContainerY = document.getElementById("rotation-y");

const lienzo = document.getElementById("lienzo");
// -------------------------------------------------------------------------






// Definición de variables y constantes ---------------------------------------------------------------
let pointerData = {
  x: 0,
  y: 0
};

let normalizedPointer = {
  x: 0,
  y: 0
};

let normalizedLerpPointer = {
  x: 0,
  y: 0
};

let rotation = {
  x: 0,
  y: 0
};

const COF = 0.08; // Coefficient of friction for the cursor movement
const ROTATION_LIMIT = 70; // Maximum rotation in degrees
// -------------------------------------------------------------------------






// Escena 3D ---------------------------------------------------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // tope en 2: pantallas retina sin castigar el rendimiento
renderer.setSize(window.innerWidth, window.innerHeight);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.7 })
);
scene.add(box);

// Canvas responsivo: cámara y renderer siguen el tamaño de la ventana
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// -------------------------------------------------------------------------






// Cursor / Pointer normalización ---------------------------------------------------------------
function calculateNormalizedPointer() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  normalizedPointer.x = (pointerData.x / windowWidth) * 2 - 1; // Normalize to range [-1, 1]
  normalizedPointer.y = -(pointerData.y / windowHeight) * 2 + 1; // Normalize to range [-1, 1]
}

document.addEventListener("pointermove", (event) => {
  pointerData.x = Math.floor(event.clientX);
  pointerData.y = Math.floor(event.clientY);

  calculateNormalizedPointer();
});


function calculateNormalizedLerpPointer() {
  normalizedLerpPointer.x += (normalizedPointer.x - normalizedLerpPointer.x) * COF;
  normalizedLerpPointer.y += (normalizedPointer.y - normalizedLerpPointer.y) * COF;

  normalLerpContainerX.innerText = normalizedLerpPointer.x.toFixed(2);
  normalLerpContainerY.innerText = normalizedLerpPointer.y.toFixed(2);
}

function calculateRotation() {
  // Signo invertido en X para que la caja mire al cursor: una rotación X positiva inclina el frente hacia abajo
  rotation.x = -normalizedLerpPointer.y * ROTATION_LIMIT; // Rotate up to ±70 degrees (ROTATION_LIMIT) based on normalized y
  rotation.y = normalizedLerpPointer.x * ROTATION_LIMIT;  // Rotate up to ±70 degrees (ROTATION_LIMIT) based on normalized x

  rotationContainerX.innerText = rotation.x.toFixed(0);
  rotationContainerY.innerText = rotation.y.toFixed(0);
}
// -------------------------------------------------------------------------






// Loop de animación actualizando el cursor suavizado y realizando la rotación ---------------------------------------------------------------
function animate() {
  calculateNormalizedLerpPointer();
  calculateRotation();

  // Three.js rota en radianes; tus valores están en grados
  box.rotation.x = THREE.MathUtils.degToRad(rotation.x);
  box.rotation.y = THREE.MathUtils.degToRad(rotation.y);
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();
// -------------------------------------------------------------------------
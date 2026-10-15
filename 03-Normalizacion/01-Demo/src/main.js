import './style.css'
console.log("03-Normalizacion. 01-Demo.")

const dataContainerX = document.getElementById("cursor-x");
const dataContainerY = document.getElementById("cursor-y");
const cursor = document.getElementById("cursor");

const normalContainerX = document.getElementById("normal-x");
const normalContainerY = document.getElementById("normal-y");
const normalLerpContainerX = document.getElementById("normal-lerp-x");
const normalLerpContainerY = document.getElementById("normal-lerp-y");

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

const COF = 0.05; // Coefficient of friction for the cursor movement

function updateCursorPosition() {
  cursor.style.transform = `translate(${pointerData.x}px, ${pointerData.y}px)`;
}

function updateDataContainers() {
  dataContainerX.innerText = pointerData.x;
  dataContainerY.innerText = pointerData.y;
}

function calculateNormalizedPointer() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  normalizedPointer.x = (pointerData.x / windowWidth) * 2 - 1; // Normalize to range [-1, 1]
  normalizedPointer.y = -(pointerData.y / windowHeight) * 2 + 1; // Normalize to range [-1, 1]

  normalContainerX.innerText = normalizedPointer.x.toFixed(2);
  normalContainerY.innerText = normalizedPointer.y.toFixed(2);
}

document.addEventListener("pointermove", (event) => {
  pointerData.x = Math.floor(event.clientX);
  pointerData.y = Math.floor(event.clientY);

  updateDataContainers();
  updateCursorPosition();

  calculateNormalizedPointer();
});


function calculateNormalizedLerpPointer() {
  normalizedLerpPointer.x += (normalizedPointer.x - normalizedLerpPointer.x) * COF;
  normalizedLerpPointer.y += (normalizedPointer.y - normalizedLerpPointer.y) * COF;

  normalLerpContainerX.innerText = normalizedLerpPointer.x.toFixed(2);
  normalLerpContainerY.innerText = normalizedLerpPointer.y.toFixed(2);
}

function animate() {
  calculateNormalizedLerpPointer();
  requestAnimationFrame(animate);
}

animate();



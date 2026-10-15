import './style.css';
console.log("03-Normalizacion. 02-Starter.");

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

function updateCursorPosition() {
  cursor.style.transform = `translate(${pointerData.x}px, ${pointerData.y}px)`;
}

function updateDataContainers() {
  dataContainerX.innerText = pointerData.x;
  dataContainerY.innerText = pointerData.y;
}

document.addEventListener("pointermove", (event) => {
  pointerData.x = Math.floor(event.clientX);
  pointerData.y = Math.floor(event.clientY);

  updateDataContainers();
  updateCursorPosition();
});
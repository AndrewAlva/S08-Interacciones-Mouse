import './style.css'
console.log("02-Mouse-Follow. 01-Demo.")

const dataContainerX = document.getElementById("cursor-x");
const dataContainerY = document.getElementById("cursor-y");
const cursor = document.getElementById("cursor");

const targetContainerX = document.getElementById("target-x");
const targetContainerY = document.getElementById("target-y");
const target = document.getElementById("target");

let pointerData = {
  x: 0,
  y: 0
};

let targetPosition = {
  x: 0,
  y: 0
};

const COF = 0.1; // Coefficient of friction for the cursor movement

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


function calculateTargetPosition() {
  targetPosition.x += (pointerData.x - targetPosition.x) * COF;
  targetPosition.y += (pointerData.y - targetPosition.y) * COF;

  targetContainerX.innerText = Math.floor(targetPosition.x);
  targetContainerY.innerText = Math.floor(targetPosition.y);
}

function updateTargetPosition() {
  target.style.transform = `translate(${targetPosition.x}px, ${targetPosition.y}px)`;
}


function animate() {
  calculateTargetPosition();
  updateTargetPosition();
  requestAnimationFrame(animate);
}

animate();
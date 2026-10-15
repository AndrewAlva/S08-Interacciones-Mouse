import './style.css';
console.log("01-Cursor-Customizado. 01-Demo.");

let pointerData = {
  x: 0,
  y: 0
};

const dataContainerX = document.getElementById("cursor-x");
const dataContainerY = document.getElementById("cursor-y");

const cursor = document.getElementById("cursor");

document.addEventListener("pointermove", (event) => {
  pointerData.x = Math.floor(event.clientX);
  pointerData.y = Math.floor(event.clientY);

  dataContainerX.innerText = pointerData.x;
  dataContainerY.innerText = pointerData.y;

  cursor.style.transform = `translate(${pointerData.x}px, ${pointerData.y}px)`;
});
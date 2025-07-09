const gridSize = 7;
const grid = [];
const gridElement = document.getElementById("grid");
const shapeContainer = document.getElementById("shapeContainer");

const SHAPES = [
  [[1,1,1]],
  [[1],[1],[1]],
  [[1,1],[1,0]],
  [[1,1],[0,1]],
  [[1,1],[1,1]],
  [[1,0,1],[1,1,1]]
];

let currentShapes = [];
let activeShape = null;

function createGrid() {
  gridElement.innerHTML = "";
  grid.length = 0;
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("dragenter", handleDragEnter);
    cell.addEventListener("dragover", handleDragOver);
    cell.addEventListener("dragleave", clearPreview);
    cell.addEventListener("drop", handleDrop);
    gridElement.appendChild(cell);
    grid.push({ element: cell, filled: false });
  }
}

function generateRandomShapes(count = 3) {
  shapeContainer.innerHTML = "";
  currentShapes = [];

  for (let i = 0; i < count; i++) {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    currentShapes.push(shape);

    const div = document.createElement("div");
    div.className = "shape";
    div.draggable = true;
    div.dataset.index = i;
    div.style.gridTemplateColumns = `repeat(${shape[0].length}, 20px)`;

    for (let row of shape) {
      for (let block of row) {
        const b = document.createElement("div");
        if (block === 1) b.className = "block";
        div.appendChild(b);
      }
    }

    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", i);
      activeShape = shape;
    });

    shapeContainer.appendChild(div);
  }
}

function getXY(index) {
  return [index % gridSize, Math.floor(index / gridSize)];
}

function canPlace(shape, x, y) {
  if (x + shape[0].length > gridSize || y + shape.length > gridSize) return false;
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[0].length; dx++) {
      if (shape[dy][dx]) {
        const gx = x + dx;
        const gy = y + dy;
        const index = gy * gridSize + gx;
        if (grid[index].filled) return false;
      }
    }
  }
  return true;
}

function canAnyShapeFit() {
  for (let shape of currentShapes) {
    for (let y = 0; y <= gridSize - shape.length; y++) {
      for (let x = 0; x <= gridSize - shape[0].length; x++) {
        if (canPlace(shape, x, y)) return true;
      }
    }
  }
  return false;
}

function placeShape(shape, x, y) {
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[0].length; dx++) {
      if (shape[dy][dx]) {
        const gx = x + dx;
        const gy = y + dy;
        const index = gy * gridSize + gx;
        grid[index].filled = true;
        grid[index].element.classList.add("occupied");
      }
    }
  }
  checkAndClearLines();

  // Check for game over after placing
  setTimeout(() => {
    if (!canAnyShapeFit()) {
      document.getElementById("gameOverModal").style.display = "flex";

document.getElementById("restartBtn").onclick = () => {
  document.getElementById("gameOverModal").style.display = "none";
  createGrid();
  generateRandomShapes();
};

document.getElementById("quitBtn").onclick = () => {
  window.location.href = "../home page/home.html"; 
};

    }
  }, 100);
}

function showPreview(shape, x, y) {
  clearPreview();
  if (!canPlace(shape, x, y)) return;
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[0].length; dx++) {
      if (shape[dy][dx]) {
        const gx = x + dx;
        const gy = y + dy;
        const index = gy * gridSize + gx;
        grid[index].element.classList.add("preview");
      }
    }
  }
}

function clearPreview() {
  grid.forEach(cell => cell.element.classList.remove("preview"));
}

function handleDragEnter(e) {
  e.preventDefault();
  const targetIndex = +e.currentTarget.dataset.index;
  const [x, y] = getXY(targetIndex);
  if (activeShape) showPreview(activeShape, x, y);
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const targetIndex = +e.currentTarget.dataset.index;
  const [x, y] = getXY(targetIndex);
  const shapeIndex = +e.dataTransfer.getData("text/plain");
  const shape = currentShapes[shapeIndex];

  if (canPlace(shape, x, y)) {
    placeShape(shape, x, y);
    document.querySelectorAll(".shape")[shapeIndex].classList.add("hidden");
    if ([...document.querySelectorAll(".shape")].every(s => s.classList.contains("hidden"))) {
      generateRandomShapes();

      
      setTimeout(() => {
        if (!canAnyShapeFit()) {
          alert("Game Over! No shapes can be placed.");
          createGrid();
          generateRandomShapes();
        }
      }, 100);
    }
  }
  clearPreview();
  activeShape = null;
}

function checkAndClearLines() {
  const rows = Array(gridSize).fill(true);
  const cols = Array(gridSize).fill(true);
  const toClear = new Set();

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!grid[y * gridSize + x].filled) {
        rows[y] = false;
        cols[x] = false;
      }
    }
  }

  for (let y = 0; y < gridSize; y++) {
    if (rows[y]) {
      for (let x = 0; x < gridSize; x++) {
        toClear.add(y * gridSize + x);
      }
    }
  }

  for (let x = 0; x < gridSize; x++) {
    if (cols[x]) {
      for (let y = 0; y < gridSize; y++) {
        toClear.add(y * gridSize + x);
      }
    }
  }

  if (toClear.size > 0) {
    toClear.forEach(i => {
      grid[i].element.classList.add("clear-animation");
    });

    setTimeout(() => {
      toClear.forEach(i => {
        grid[i].filled = false;
        grid[i].element.classList.remove("occupied");
        grid[i].element.classList.remove("clear-animation");
      });
    }, 300);
  }
}

createGrid();
generateRandomShapes();

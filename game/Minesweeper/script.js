const board = document.getElementById("board");
const statusDisplay = document.getElementById("status");

const size = 8;
const mineCount = 10;
let cells = [];
let gameOver = false;

function initGame() {
  board.innerHTML = "";
  statusDisplay.textContent = "Left click: Reveal | Right click: Flag";
  gameOver = false;
  cells = [];

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.oncontextmenu = (e) => {
      e.preventDefault();
      flagCell(i);
    };
    cell.onclick = () => revealCell(i);
    board.appendChild(cell);
    cells.push({ mine: false, revealed: false, flagged: false, element: cell });
  }

  placeMines();
  calculateNumbers();
}

function placeMines() {
  let placed = 0;
  while (placed < mineCount) {
    const index = Math.floor(Math.random() * cells.length);
    if (!cells[index].mine) {
      cells[index].mine = true;
      placed++;
    }
  }
}

function calculateNumbers() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].mine) continue;

    const neighbors = getNeighbors(i);
    let count = neighbors.filter(n => cells[n].mine).length;
    cells[i].number = count;
  }
}

function getNeighbors(index) {
  const x = index % size;
  const y = Math.floor(index / size);
  const deltas = [-1, 0, 1];
  const neighbors = [];

  for (let dx of deltas) {
    for (let dy of deltas) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        neighbors.push(ny * size + nx);
      }
    }
  }
  return neighbors;
}

function revealCell(index) {
  const cell = cells[index];
  if (cell.revealed || cell.flagged || gameOver) return;

  cell.revealed = true;
  cell.element.classList.add("revealed");

  if (cell.mine) {
    cell.element.textContent = "💣";
    cell.element.classList.add("mine");
    statusDisplay.textContent = "💥 Game Over!";
    revealAllMines();
    gameOver = true;
    return;
  }

  if (cell.number > 0) {
    cell.element.textContent = cell.number;
  } else {
    // recursively reveal neighbors
    for (let n of getNeighbors(index)) {
      if (!cells[n].revealed) revealCell(n);
    }
  }

  checkWin();
}

function flagCell(index) {
  const cell = cells[index];
  if (cell.revealed || gameOver) return;

  cell.flagged = !cell.flagged;
  cell.element.classList.toggle("flag");
  cell.element.textContent = cell.flagged ? "🚩" : "";
}

function revealAllMines() {
  for (let cell of cells) {
    if (cell.mine) {
      cell.element.textContent = "💣";
      cell.element.classList.add("mine");
    }
  }
}

function checkWin() {
  const unrevealed = cells.filter(cell => !cell.revealed);
  if (unrevealed.length === mineCount) {
    statusDisplay.textContent = "🎉 You Win!";
    gameOver = true;
  }
}

initGame();

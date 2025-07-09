const gridSize = 7;
const game = document.getElementById("game");
const message = document.getElementById("message");
const endScreen = document.getElementById("endScreen");

const levels = [
  { player: { x: 0, y: 0 }, ghost: { x: 3, y: 3, direction: 0 }, exit: { x: 6, y: 6 } },
  { player: { x: 6, y: 0 }, ghost: { x: 2, y: 2, direction: 1 }, exit: { x: 0, y: 6 } },
  { player: { x: 3, y: 6 }, ghost: { x: 3, y: 3, direction: 2 }, exit: { x: 3, y: 0 } },
  { player: { x: 0, y: 6 }, ghost: { x: 6, y: 0, direction: 3 }, exit: { x: 6, y: 6 } },
  { player: { x: 0, y: 3 }, ghost: { x: 3, y: 3, direction: 0 }, exit: { x: 6, y: 3 } }
];

let currentLevel = 0;
let player, ghost, exit;

function drawGrid() {
  game.innerHTML = "";
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      if (x === player.x && y === player.y) {
        cell.classList.add("player");
        cell.textContent = "🧍";
      } else if (x === ghost.x && y === ghost.y) {
        cell.classList.add("ghost");
        cell.textContent = "👻";
      } else if (x === exit.x && y === exit.y) {
        cell.classList.add("exit");
        cell.textContent = "🚪";
      }

      const vision = getGhostVision();
      if (vision.some(v => v.x === x && v.y === y)) {
        cell.classList.add("vision");
      }

      game.appendChild(cell);
    }
  }

  const levelDisplay = document.getElementById("levelDisplay");
  if (levelDisplay) {
    levelDisplay.textContent = `Level: ${currentLevel + 1}`;
  }
}

function getGhostVision() {
  const vision = [];
  const { x, y, direction } = ghost;
  for (let i = 1; i < 3; i++) {
    if (direction === 0 && y - i >= 0) vision.push({ x, y: y - i });
    if (direction === 1 && x + i < gridSize) vision.push({ x: x + i, y });
    if (direction === 2 && y + i < gridSize) vision.push({ x, y: y + i });
    if (direction === 3 && x - i >= 0) vision.push({ x: x - i, y });
  }
  return vision;
}

function isPlayerInVision() {
  const vision = getGhostVision();
  return vision.some(v => v.x === player.x && v.y === player.y);
}

function handleMove(dx, dy) {
  if (message.textContent !== "") return;

  // Check BEFORE move – is player already being watched?
  if (isPlayerInVision()) {
    gameOverScreen.classList.remove("hidden");
    return;
  }

  const newX = player.x + dx;
  const newY = player.y + dy;

  if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
    player.x = newX;
    player.y = newY;

   
    if (isPlayerInVision()) {
      drawGrid(); 
      gameOverScreen.classList.remove("hidden");
      return;
    }

    // Check win condition
    if (player.x === exit.x && player.y === exit.y) {
      drawGrid(); // Draw final position
      if (currentLevel < levels.length - 1) {
        message.textContent = " Level Cleared! Next Level...";
        setTimeout(() => {
          currentLevel++;
          loadLevel(currentLevel);
        }, 1500);
      } else {
        message.textContent = "";
        setTimeout(() => {
          endScreen.classList.remove("hidden");
        }, 500);
      }
    } else {
      drawGrid();
    }
  }
}


function rotateGhost() {
  ghost.direction = (ghost.direction + 1) % 4;
  drawGrid();
}

function restartGame() {
  loadLevel(currentLevel);
}

function restartFullGame() {
  currentLevel = 0;
  endScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  loadLevel(currentLevel);
}


function quitGame() {
  
  window.location.href = "../home page/home.html";
}

function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  player = { ...level.player };
  ghost = { ...level.ghost };
  exit = { ...level.exit };
  message.textContent = "";
  endScreen.classList.add("hidden");
  drawGrid();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") handleMove(0, -1);
  if (e.key === "ArrowDown") handleMove(0, 1);
  if (e.key === "ArrowLeft") handleMove(-1, 0);
  if (e.key === "ArrowRight") handleMove(1, 0);
});

loadLevel(0);
setInterval(rotateGhost, 2000);

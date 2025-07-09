let boardSize = 8;
let board = [];
let queenPositions = [];
let timer = 0;
let timerInterval;

function startGame() {
  boardSize = parseInt(document.getElementById("boardSize").value);
  board = [];
  queenPositions = [];
  document.getElementById("board").classList.remove("hidden");
  document.getElementById("controls").classList.remove("hidden");
  document.getElementById("status").textContent = "";
  document.getElementById("timer").textContent = "⏱ Time: 0s";

  clearInterval(timerInterval);
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = `⏱ Time: ${timer}s`;
  }, 1000);

  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  boardDiv.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;

  for (let row = 0; row < boardSize; row++) {
    board[row] = Array(boardSize).fill(0);
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.onclick = () => toggleQueen(row, col, cell);
      boardDiv.appendChild(cell);
    }
  }
}

function toggleQueen(row, col, cell) {
  if (board[row][col] === 1) {
    board[row][col] = 0;
    queenPositions = queenPositions.filter(pos => !(pos[0] === row && pos[1] === col));
    cell.textContent = "";
    cell.classList.remove("queen");
    document.getElementById("status").textContent = "";
    return;
  }

  if (hasConflict(row, col)) {
    document.getElementById("status").textContent = "⚠️ Queen conflicts with another!";
    return;
  }

  board[row][col] = 1;
  queenPositions.push([row, col]);
  cell.textContent = "♛";
  cell.classList.add("queen");

  if (queenPositions.length === boardSize) {
    document.getElementById("status").textContent = "🎉 Success! All queens placed!";
    clearInterval(timerInterval);
  }
}

function hasConflict(r, c) {
  for (let [row, col] of queenPositions) {
    if (
      row === r || col === c || Math.abs(row - r) === Math.abs(col - c)
    ) {
      return true;
    }
  }
  return false;
}

function restartGame() {
  clearInterval(timerInterval);
  startGame();
}

function quitGame() {
  window.location.href = "../home page/home.html";
}

function autoSolve() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  queenPositions = [];
  const boardDiv = document.getElementById("board");
  const cells = boardDiv.querySelectorAll(".cell");

  if (solveNQueens(0)) {
    cells.forEach(cell => {
      cell.textContent = "";
      cell.classList.remove("queen");
    });

    queenPositions.forEach(([row, col]) => {
      const index = row * boardSize + col;
      cells[index].textContent = "♛";
      cells[index].classList.add("queen");
    });

    document.getElementById("status").textContent = "👾 Auto-solved!";
    clearInterval(timerInterval);
  } else {
    document.getElementById("status").textContent = "❌ No solution found!";
  }
}

function solveNQueens(row) {
  if (row === boardSize) return true;

  for (let col = 0; col < boardSize; col++) {
    if (!hasConflict(row, col)) {
      board[row][col] = 1;
      queenPositions.push([row, col]);
      if (solveNQueens(row + 1)) return true;
      board[row][col] = 0;
      queenPositions.pop();
    }
  }
  return false;
}

// 🧠 Step-by-step solver with animation
async function stepByStepSolve() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  queenPositions = [];
  const boardDiv = document.getElementById("board");
  const cells = boardDiv.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("queen");
  });

  document.getElementById("status").textContent = "🧠 Solving step-by-step...";
  clearInterval(timerInterval); // stop timer while solving

  const success = await solveWithAnimation(0, cells);

  if (success) {
    document.getElementById("status").textContent = "✅ Step-by-step solved!";
  } else {
    document.getElementById("status").textContent = "❌ No solution found!";
  }
}

async function solveWithAnimation(row, cells) {
  if (row === boardSize) return true;

  for (let col = 0; col < boardSize; col++) {
    if (!hasConflict(row, col)) {
      board[row][col] = 1;
      queenPositions.push([row, col]);

      const index = row * boardSize + col;
      cells[index].textContent = "♛";
      cells[index].classList.add("queen");

      await sleep(400); // delay for animation

      if (await solveWithAnimation(row + 1, cells)) return true;

      // backtrack
      board[row][col] = 0;
      queenPositions.pop();
      cells[index].textContent = "";
      cells[index].classList.remove("queen");

      await sleep(200); 
    }
  }
  return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

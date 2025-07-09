let currentPlayer = "X";
let board = Array(9).fill(null);
let gameActive = true;

const statusDisplay = document.getElementById("status");

function makeMove(cell, index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWinner()) {
    statusDisplay.textContent = `🎉 Player ${currentPlayer} wins!`;
    gameActive = false;
  } else if (board.every(cell => cell !== null)) {
    statusDisplay.textContent = "😐 It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return wins.some(combo => {
    const [a,b,c] = combo;
    return board[a] && board[a] === board[b] && board[b] === board[c];
  });
}

function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
  statusDisplay.textContent = "Player X's turn";
}

function quitGame() {
  window.location.href = "../home page/home.html"; 
}

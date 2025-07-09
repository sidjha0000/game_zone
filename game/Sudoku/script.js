const grid = document.getElementById("sudoku-grid");

const initialBoard = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9]
];

let inputs = [];

function createBoard() {
  inputs = [];
  grid.innerHTML = "";
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.max = 9;
      if (initialBoard[row][col] !== null) {
        input.value = initialBoard[row][col];
        input.disabled = true;
      }
      grid.appendChild(input);
      inputs.push(input);
    }
  }
}

function getBoardValues() {
  const values = [];
  for (let r = 0; r < 9; r++) {
    values.push([]);
    for (let c = 0; c < 9; c++) {
      const val = parseInt(inputs[r * 9 + c].value);
      values[r].push(isNaN(val) ? null : val);
    }
  }
  return values;
}

function isValidSudoku(board) {
  for (let i = 0; i < 9; i++) {
    const rowSet = new Set();
    const colSet = new Set();
    const boxSet = new Set();

    for (let j = 0; j < 9; j++) {
      const rowVal = board[i][j];
      const colVal = board[j][i];
      const boxVal = board[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + j % 3];

      if (!rowVal || !colVal || !boxVal) return false;

      if (rowSet.has(rowVal) || colSet.has(colVal) || boxSet.has(boxVal)) {
        return false;
      }

      rowSet.add(rowVal);
      colSet.add(colVal);
      boxSet.add(boxVal);
    }
  }
  return true;
}


function checkSolution() {
  const board = getBoardValues();

  if (board.flat().includes(null)) {
    alert("⚠️ Please fill all cells before checking.");
    return;
  }

  if (isValidSudoku(board)) {
    alert("✅ Congratulations! The Sudoku is correctly solved.");
  } else {
    alert("❌ Incorrect solution. Try again.");
  }
}

function resetBoard() {
  createBoard();
}

createBoard();

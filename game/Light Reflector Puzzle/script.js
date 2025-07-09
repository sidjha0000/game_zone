const grid = document.getElementById('grid');
const startBtn = document.getElementById('startBtn');
const modal = document.getElementById('gameOverModal');
const restartBtn = document.getElementById('restartBtn');
const quitBtn = document.getElementById('quitBtn');

let currentLevel = 0;
const gridSize = 7;
const cells = [];
let laserPath = [];

const levels = [
  {
    emitter: 21,
    target: 27,
    direction: 'right',
    obstacles: [16, 17, 24, 25]
  },
  {
    emitter: 0,
    target: 48,
    direction: 'down',
    obstacles: [8, 22, 29, 36, 43]
  },
  {
    emitter: 6,
    target: 42,
    direction: 'left',
    obstacles: [13, 20, 27, 34]
  }
];


function createGrid() {
  grid.innerHTML = '';
  cells.length = 0;

  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', () => toggleMirror(cell));
    grid.appendChild(cell);
    cells.push(cell);
  }

  applyLevel(currentLevel);
}

function applyLevel(levelIndex) {
  const level = levels[levelIndex];

  cells.forEach(cell => {
    cell.classList.remove('emitter', 'target', 'obstacle', 'mirror', 'laser');
    cell.removeAttribute('data-type');
  });

  cells[level.emitter].classList.add('emitter');
  cells[level.target].classList.add('target');
  level.obstacles.forEach(i => cells[i].classList.add('obstacle'));
}

function toggleMirror(cell) {
  if (cell.classList.contains('emitter') || cell.classList.contains('target') || cell.classList.contains('obstacle')) return;

  if (!cell.classList.contains('mirror')) {
    cell.classList.add('mirror');
    cell.dataset.type = '/';
  } else {
    cell.dataset.type = cell.dataset.type === '/' ? '\\' : '/';
  }
}

function getNextDirection(direction, mirrorType) {
  const reflectionMap = {
    '/': {
      right: 'up',
      left: 'down',
      up: 'right',
      down: 'left',
    },
    '\\': {
      right: 'down',
      left: 'up',
      up: 'left',
      down: 'right',
    }
  };
  return reflectionMap[mirrorType][direction];
}

function traceLaser() {
  laserPath.forEach(i => cells[i].classList.remove('laser'));
  laserPath = [];

  const level = levels[currentLevel];
  let index = level.emitter;
  let direction = level.direction;


  const getNextIndex = (i, dir) => {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    switch (dir) {
      case 'right': return col < gridSize - 1 ? i + 1 : -1;
      case 'left': return col > 0 ? i - 1 : -1;
      case 'up': return row > 0 ? i - gridSize : -1;
      case 'down': return row < gridSize - 1 ? i + gridSize : -1;
    }
  };

  while (index !== -1) {
    index = getNextIndex(index, direction);
    if (index === -1) break;

    const cell = cells[index];
    if (cell.classList.contains('obstacle')) break;

    laserPath.push(index);
    cell.classList.add('laser');

    if (cell.classList.contains('mirror')) {
      direction = getNextDirection(direction, cell.dataset.type);
    }

    if (cell.classList.contains('target')) {
      showGameOverModal();
      break;
    }
  }
}

function showGameOverModal() {
  modal.classList.remove('hidden');

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next Level';
  nextBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    currentLevel++;
    if (currentLevel >= levels.length) {
      alert("🎉 You've completed all levels!");
      currentLevel = 0;
    }
    createGrid();
  });

  // Avoid duplicate buttons
  const modalContent = modal.querySelector('.modal-content');
  const existingNext = modal.querySelector('#nextBtn');
  if (!existingNext) {
    nextBtn.id = 'nextBtn';
    modalContent.insertBefore(nextBtn, restartBtn);
  }
}

restartBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  createGrid();
});

quitBtn.addEventListener('click', () => {
  window.location.href = "../home page/home.html"; 
});

startBtn.addEventListener('click', traceLaser);

createGrid();

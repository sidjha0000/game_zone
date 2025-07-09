const cube = document.getElementById("cube");
const gameArea = document.getElementById("gameArea");
const gameOverText = document.getElementById("gameOver");
const scoreDisplay = document.getElementById("score");

let gravity = 0.5;
let cubeVelocity = 0;
let isGameOver = false;
let cubeBottom = 200;
let poleInterval;
let animationFrame;
let poleSpeed = 10;
let poleDelay = 500;
let score = 0;

function resetGame() {
  cubeBottom = 200;
  cubeVelocity = 0;
  cube.style.bottom = cubeBottom + "px";
  gameOverText.style.display = "none";
  isGameOver = false;
  score = 0;
  scoreDisplay.textContent = "Score: 0";

  document.querySelectorAll(".pole").forEach(p => p.remove());

  startGame();
}

function jump() {
  if (isGameOver) return;
  cubeVelocity = 7;
}
function crouch() {
    if (isGameOver) return;
    cubeVelocity = -4;
  }
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    jump();
  }
  else if(e.code === "ArrowDown") {
   // crouch();
  }
});

function updateCubePosition() {
  cubeVelocity -= gravity;
  cubeBottom += cubeVelocity;

  if (cubeBottom < 0) {
    cubeBottom = 0;
    cubeVelocity = 0;
  }

  cube.style.bottom = cubeBottom + "px";
}

function animate() {
  if (!isGameOver) {
    updateCubePosition();
    checkCollision();
    animationFrame = requestAnimationFrame(animate);
  }
}

function createPole() {
  const poleTop = document.createElement("div");
  const poleBottom = document.createElement("div");
  const gap = 220;

  const totalHeight = gameArea.offsetHeight;
  const topHeight = Math.floor(Math.random() * (totalHeight - gap - 100)) + 50;
  const bottomHeight = totalHeight - gap - topHeight;

  poleTop.classList.add("pole");
  poleTop.style.height = topHeight + "px";
  poleTop.style.top = "0px";

  poleBottom.classList.add("pole");
  poleBottom.style.height = bottomHeight + "px";
  poleBottom.style.bottom = "0px";

  gameArea.appendChild(poleTop);
  gameArea.appendChild(poleBottom);

  let polePosition = -60;
  let passed = false;

  const move = setInterval(() => {
    if (isGameOver) {
      clearInterval(move);
      poleTop.remove();
      poleBottom.remove();
      return;
    }

    polePosition += poleSpeed;
    poleTop.style.right = polePosition + "px";
    poleBottom.style.right = polePosition + "px";

    const cubeLeft = cube.getBoundingClientRect().left;
    const poleRight = window.innerWidth - polePosition;

    if (!passed && poleRight < cubeLeft) {
      score++;
      scoreDisplay.textContent = "Score: " + score;
      passed = true;
    }

    if (polePosition > window.innerWidth + 60) {
      poleTop.remove();
      poleBottom.remove();
      clearInterval(move);
    }
  }, 20);
}

function checkCollision() {
  const cubeRect = cube.getBoundingClientRect();
  const poles = document.querySelectorAll(".pole");

  for (let pole of poles) {
    const poleRect = pole.getBoundingClientRect();

    if (
      cubeRect.right > poleRect.left &&
      cubeRect.left < poleRect.right &&
      (
        (pole.style.top === "0px" && cubeRect.top < poleRect.bottom) ||
        (pole.style.bottom === "0px" && cubeRect.bottom > poleRect.top)
      )
    ) {
      endGame();
      break;
    }
  }
}

function startGame() {
  animate();
  poleInterval = setInterval(() => {
    if (!isGameOver) createPole();
  }, poleDelay);
}

function endGame() {
  isGameOver = true;
  cancelAnimationFrame(animationFrame);
  clearInterval(poleInterval);
  gameOverText.style.display = "block";

  setTimeout(() => {
    resetGame();
  }, 2000);
}

startGame();

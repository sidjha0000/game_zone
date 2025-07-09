const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
let score = 0;
let direction = "RIGHT";

let snake = [
  { x: 9 * box, y: 10 * box }
];

let food = {
  x: Math.floor(Math.random() * (canvasSize / box)) * box,
  y: Math.floor(Math.random() * (canvasSize / box)) * box,
};

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.key.toLowerCase();

  if ((key === "a" || key === "arrowleft") && direction !== "RIGHT") {
    direction = "LEFT";
  } else if ((key === "w" || key === "arrowup") && direction !== "DOWN") {
    direction = "UP";
  } else if ((key === "d" || key === "arrowright") && direction !== "LEFT") {
    direction = "RIGHT";
  } else if ((key === "s" || key === "arrowdown") && direction !== "UP") {
    direction = "DOWN";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Get head position
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  // Check Game Over
  if (
    headX < 0 || headY < 0 || headX >= canvasSize || headY >= canvasSize ||
    snake.some(segment => segment.x === headX && segment.y === headY)
  ) {
    clearInterval(game); 
    document.getElementById("finalScore").innerText = "Your Score: " + score;
    document.getElementById("gameOverScreen").classList.remove("hidden");
    return;
  }

  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    food = {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box,
    };
  } else {
    snake.pop();
  }

  snake.unshift({ x: headX, y: headY });
}

let game = setInterval(draw, 100);

function startAgain() {
  document.location.reload();
}

function quitGame() {
  window.location.href = "../home page/home.html"; 
}


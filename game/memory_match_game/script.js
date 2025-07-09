const board = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const statusDisplay = document.getElementById("status");

let moves = 0;
let flippedCards = [];
let matchedPairs = 0;

const emojis = ['🐶','🐱','🐭','🐹','🦊','🐻','🐼','🐨'];
let cardValues = [...emojis, ...emojis]; 

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  shuffle(cardValues);
  board.innerHTML = "";
  matchedPairs = 0;
  moves = 0;
  movesDisplay.textContent = "Moves: 0";
  statusDisplay.textContent = "";

  cardValues.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;
    card.dataset.value = emoji;
    card.textContent = "";
    card.onclick = () => flipCard(card);
    board.appendChild(card);
  });
}

function flipCard(card) {
  if (card.classList.contains("flipped") || card.classList.contains("matched") || flippedCards.length === 2) {
    return;
  }

  card.classList.add("flipped");
  card.textContent = card.dataset.value;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;

    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchedPairs++;

      if (matchedPairs === cardValues.length / 2) {
        statusDisplay.textContent = "🎉 You won in " + moves + " moves!";
      }

      flippedCards = [];
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.textContent = "";
        card2.textContent = "";
        flippedCards = [];
      }, 800);
    }
  }
}

function restartGame() {
  cardValues = [...emojis, ...emojis];
  createBoard();
}

createBoard();

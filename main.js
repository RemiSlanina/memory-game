// ****************** VARIABLES ******************
const gridContainer = document.querySelector(".grid-container");
const thankYouMessage = document.querySelector(".thank-you-message");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

document.querySelector(".score").textContent = score;

// ****************** FETCH DATA ******************
fetch("./data/cards.json") //fetch data
  .then((res) => res.json()) //convert json
  .then((data) => {
    cards = [...data, ...data]; //we need each
    //card twice
    shuffleCards();
    generateCards();
  });

// ****************** SHUFFLE CARDS ******************
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    //24
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // switch values
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}
// ****************** GENERATE CARDS ******************
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
    <div class="front">
        <img class="front-image" src=${card.image} /> 
    </div>
    <div class="back"></div> `;
    gridContainer.appendChild(cardElement); // get element by id????????
    cardElement.addEventListener("click", flipCard);
  }
}
// ****************** FLIP CARDS ******************
function flipCard() {
  if (lockBoard) return;
  if (this == firstCard) return;

  this.classList.add("flipped");

  // if this is the first card, set firstCard
  if (!firstCard) {
    firstCard = this;
    return;
  }

  // if we are here, this is the second card
  secondCard = this;

  lockBoard = true; // lock to check for match

  result = checkForMatch();

  if (result) score++;
  console.log(`score: ${score}`);
  document.querySelector(".score").textContent = score;
  printThankYouMessage();
}
// ****************** CHECK FOR MATCH ******************
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
  return isMatch;
}
// ****************** DISABLE CARDS ******************
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  // empty first and second card and unlock board:
  resetBoard();
}

// ****************** UNFLIP CARDS ******************
//unflip cards and reset board
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}
// ****************** RESET BOARD ******************
// empty the first and second card and unlock board
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}
// ****************** RESTART ******************
function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}
function printThankYouMessage() {
  console.log(`score: ${score}`);
  console.log(`((cards.length ) / 2): ${cards.length / 2}`);
  if (score !== cards.length / 2) return;
  document.querySelector(
    ".thank-you-message"
  ).textContent = `Thank you for playing.`;
}

const playboard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocidadeX = 2, velocidadeY = -2;
let snakeBody = [];
let setIntervalid;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  snakeBody.push([snakeBody]);
  clearInterval(setIntervalid);
  alert("GAME OVER! PRESSIONE OK OU JOGAR NOVAMENTE");
  location.reload();
};

const changeDirection = (direction) => {
  if (!startGame) {
    startGame = true;
    setIntervalid = setInterval(initGame, 100);
  }
  
  if (direction === "up" && velocidadeY !== 1) {
    velocidadeX = 0;
    velocidadeY = -1;
  } else if (direction === "down" && velocidadeY !== 1) {
    velocidadeX = 0;
    velocidadeY = 1;
  } else if (direction === "left" && velocidadeX !== -1) {
    velocidadeX = -1;
    velocidadeY = 0;
  } else if (direction === "right" && velocidadeX !== -1) {
    velocidadeX = 1;
    velocidadeY = 0;
  }
};

Array.from(controls).forEach((button) => {
  button.addEventListener("click", () =>
    changeDirection(button.dataset.key)
  );
});

const initGame = () => {
  if (!startGame || gameOver) return;
  let html = `<article class="food" style="grid-area: ${foodY} / ${foodX}"></article>`;

  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodY, foodX]);
    score++;
    highScore = score > highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  snakeX += velocidadeX;
  snakeY += velocidadeY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
    handleGameOver();
    return;
  }

  html += `<article class="head" style="grid-area: ${snakeBody[0][1]} / ${snakeBody[0][0]}"></article>`;

  for (let i = 1; i < snakeBody.length; i++) {
    html += `<article class="body" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></article>`;

    if (
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
      handleGameOver();
      return;
    }
  }

  playboard.innerHTML = html;
};

updateFoodPosition();


let startGame = false;

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    changeDirection("up");
  } else if (event.key === "ArrowDown") {
    changeDirection("down");
  } else if (event.key === "ArrowLeft") {
    changeDirection("left");
  } else if (event.key === "ArrowRight") {
    changeDirection("right");
  }
});

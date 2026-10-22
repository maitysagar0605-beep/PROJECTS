const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const gameOverMenu = document.getElementById('gameOverMenu');
const restartBtn = document.getElementById('restartBtn');

let CANVAS_WIDTH = 0;
let CANVAS_HEIGHT = 0;
let GROUND_Y = 0;
const BIRDS_START_SCORE = 250;

let gameSpeed = 5;
let score = 0;
let highScore = Number(localStorage.getItem('dino_high_score')) || 0;
let isGameOver = false;
let animationFrameId;
let obstacleTimer = 0;
let nextObstacleInterval = 80;
let sceneryOffset = 0;
let worldScale = 1;
let pixelRatio = 1;

function resizeCanvas() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  worldScale = Math.max(1, viewportWidth / 800, viewportHeight / 450);

  canvas.width = Math.round(viewportWidth * pixelRatio);
  canvas.height = Math.round(viewportHeight * pixelRatio);
  canvas.style.width = `${viewportWidth}px`;
  canvas.style.height = `${viewportHeight}px`;
  ctx.setTransform(pixelRatio * worldScale, 0, 0, pixelRatio * worldScale, 0, 0);

  CANVAS_WIDTH = viewportWidth / worldScale;
  CANVAS_HEIGHT = viewportHeight / worldScale;
  GROUND_Y = CANVAS_HEIGHT - 40;

  dino.x = Math.max(24, CANVAS_WIDTH * 0.09);
  dino.y = GROUND_Y - dino.height;
}

window.addEventListener('resize', resizeCanvas);

highScoreDisplay.textContent = String(Math.floor(highScore)).padStart(5, '0');

const dino = {
  x: 50,
  y: GROUND_Y - 50.4,
  width: 43.2,
  height: 50.4,
  velocityY: 0,
  gravity: 0.6,
  jumpPower: -12,
  isGrounded: true,
  isCrouching: false,
  runFrame: 0,

  jump() {
    if (this.isGrounded) {
      this.isCrouching = false;
      this.velocityY = this.jumpPower;
      this.isGrounded = false;
    }
  },

  update() {
    if (!this.isGrounded) {
      this.velocityY += this.gravity;
      this.y += this.velocityY;
    }

    if (this.y >= GROUND_Y - this.height) {
      this.y = GROUND_Y - this.height;
      this.velocityY = 0;
      this.isGrounded = true;
    }

    if (this.isGrounded) {
      this.runFrame += gameSpeed * 0.12;
    }
  },

  getCollisionBox() {
    if (this.isCrouching && this.isGrounded) {
      return { x: this.x + 1.8, y: GROUND_Y - 18, width: 39.6, height: 18 };
    }
    return { x: this.x + 2.4, y: this.y + 2.4, width: 40.8, height: this.height - 4.8 };
  },

  draw() {
    const color = document.body.classList.contains('dark-mode') ? '#e8eaed' : '#535353';
    const cell = 2.28;
    const rows = this.isCrouching && this.isGrounded
      ? [
          [[5, 16]], [[3, 17]], [[1, 17]], [[0, 16]], [[1, 18]],
          [[3, 19]], [[5, 19]], [[7, 18]], [[9, 17]]
        ]
      : [
          [[11, 17]], [[10, 17]], [[10, 18]], [[10, 18]], [[10, 18]],
          [[10, 18]], [[10, 18]], [[10, 14], [16, 18]], [[9, 15]],
          [[8, 14]], [[7, 13]], [[6, 13]], [[5, 13], [0, 1]],
          [[4, 14], [0, 2]], [[3, 14], [1, 3]], [[2, 14], [2, 4]],
          [[2, 13], [3, 5]], [[3, 12], [4, 6]], [[4, 11], [5, 8]],
          [[5, 10], [6, 8]], [[6, 9], [6, 8]], [[6, 8], [6, 8]]
        ];

    ctx.fillStyle = color;
    rows.forEach((spans, row) => {
      spans.forEach(([start, end]) => {
        ctx.fillRect(this.x + start * cell, this.isCrouching ? GROUND_Y - 45 + row * cell : this.y + row * cell, (end - start + 1) * cell, cell);
      });
    });

    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#202124' : '#ffffff';
    if (this.isCrouching && this.isGrounded) {
      ctx.fillRect(this.x + 14 * cell, GROUND_Y - 35, cell, cell);
    } else {
      ctx.fillRect(this.x + 12 * cell, this.y + 2 * cell, cell, cell);
    }
  }
};

resizeCanvas();

let obstacles = [];

class Cactus {
  constructor() {
    this.width = Math.random() < 0.5 ? 30 : 45;
    this.height = 40 + Math.random() * 15;
    this.x = CANVAS_WIDTH;
    this.y = GROUND_Y - this.height;
  }

  update() {
    this.x -= gameSpeed;
  }

  draw() {
    const color = document.body.classList.contains('dark-mode') ? '#111111' : '#49824b';
    ctx.fillStyle = color;
    ctx.fillRect(this.x + 10, this.y, 12, this.height);
    ctx.fillRect(this.x + 2, this.y + this.height * 0.42, 10, 7);
    ctx.fillRect(this.x + 2, this.y + this.height * 0.28, 6, this.height * 0.16);

    if (this.width > 30) {
      ctx.fillRect(this.x + 22, this.y + this.height * 0.58, 11, 7);
      ctx.fillRect(this.x + 27, this.y + this.height * 0.4, 6, this.height * 0.2);
    }
  }
}

class Bird {
  constructor() {
    this.width = 58;
    this.height = 34;
    this.x = CANVAS_WIDTH;
    this.lane = Math.random() < 0.5 ? 'low' : 'high';
    this.y = this.lane === 'low' ? GROUND_Y - 39 : GROUND_Y - dino.height - 20;
    this.flapFrame = 0;
  }

  update() {
    this.x -= gameSpeed + 1;
    this.flapFrame += 0.35;
  }

  draw() {
    const color = document.body.classList.contains('dark-mode') ? '#e8eaed' : '#535353';
    const wingUp = Math.sin(this.flapFrame) > 0;
    const bodyRows = [
      null, null, null, null, [5, 10], [0, 12], [3, 16],
      [5, 17], [6, 16], [8, 14], [10, 12], null
    ];
    const wingRows = wingUp
      ? [[5, 6], [4, 7], [3, 8], [2, 9], [1, 10], [2, 8], null, null, null, null, null, null]
      : [null, null, null, null, null, [2, 8], [1, 9], [2, 10], [3, 10], [4, 9], [5, 7], null];
    const pixelSize = 3;

    ctx.fillStyle = color;
    bodyRows.forEach((span, row) => {
      const wing = wingRows[row];
      [span, wing].forEach((part) => {
        if (part) {
          ctx.fillRect(this.x + part[0] * pixelSize, this.y + row * pixelSize, (part[1] - part[0] + 1) * pixelSize, pixelSize);
        }
      });
    });

    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#202124' : '#ffffff';
    ctx.fillRect(this.x + 6 * pixelSize, this.y + 5 * pixelSize, 2, 2);
  }
}

function drawBackground() {
  const isNight = document.body.classList.contains('dark-mode');
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  if (isNight) {
    sky.addColorStop(0, '#101a38');
    sky.addColorStop(1, '#465b7a');
  } else {
    sky.addColorStop(0, '#91d8f4');
    sky.addColorStop(1, '#eaf8dc');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);

  if (isNight) {
    ctx.fillStyle = 'rgba(255, 255, 220, 0.8)';
    for (let i = 0; i < 24; i++) {
      const x = (i * 113 + 31) % CANVAS_WIDTH;
      const y = 18 + (i * 47) % 105;
      ctx.fillRect(x, y, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1);
    }
    ctx.fillStyle = '#f5edc5';
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 110, CANVAS_HEIGHT * 0.15, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#283752';
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 101, CANVAS_HEIGHT * 0.13, 17, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#ffe28a';
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 110, CANVAS_HEIGHT * 0.15, 21, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 4; i++) {
      const x = ((i * 230 + 40 - sceneryOffset * (0.18 + i * 0.025)) % (CANVAS_WIDTH + 110) + CANVAS_WIDTH + 110) % (CANVAS_WIDTH + 110) - 55;
      const y = CANVAS_HEIGHT * (0.15 + (i % 2) * 0.08);
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.arc(x + 13, y - 5, 15, 0, Math.PI * 2);
      ctx.arc(x + 29, y, 11, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = isNight ? '#344b5b' : '#a8d6a0';
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  for (let x = 0; x <= CANVAS_WIDTH; x += 80) {
    const hillY = GROUND_Y - 48 + Math.sin((x + sceneryOffset * 0.18) / 100) * 10;
    ctx.lineTo(x, hillY);
  }
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
  ctx.closePath();
  ctx.fill();

  const groundColor = isNight ? '#c1c8d0' : '#6b8057';
  ctx.fillStyle = isNight ? '#253241' : '#d9c89d';
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
  ctx.fillStyle = groundColor;
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 2);
  ctx.fillStyle = isNight ? '#73808b' : '#aa9a73';
  for (let i = 0; i < 16; i++) {
    const x = ((i * 67 - sceneryOffset) % CANVAS_WIDTH + CANVAS_WIDTH) % CANVAS_WIDTH;
    if (i % 3 === 0) {
      const grassColor = isNight ? '#60765f' : '#587747';
      ctx.strokeStyle = grassColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y + 10);
      ctx.lineTo(x - 2, GROUND_Y + 5);
      ctx.moveTo(x, GROUND_Y + 10);
      ctx.lineTo(x + 1, GROUND_Y + 4);
      ctx.moveTo(x, GROUND_Y + 10);
      ctx.lineTo(x + 4, GROUND_Y + 6);
      ctx.stroke();
    } else {
      const pebbleColor = isNight ? '#59616b' : '#aa9a73';
      ctx.fillStyle = pebbleColor;
      ctx.beginPath();
      ctx.ellipse(x, GROUND_Y + 13 + (i % 3) * 6, 3 + (i % 2), 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function intersects(first, second) {
  return first.x < second.x + second.width &&
    first.x + first.width > second.x &&
    first.y < second.y + second.height &&
    first.y + first.height > second.y;
}

function handleObstacles() {
  obstacleTimer++;
  if (obstacleTimer >= nextObstacleInterval) {
    if (score >= BIRDS_START_SCORE && Math.random() < 0.38) {
      obstacles.push(new Bird());
    } else {
      obstacles.push(new Cactus());
    }
    obstacleTimer = 0;
    nextObstacleInterval = Math.floor(65 + Math.random() * 55);
  }

  const dinoBox = dino.getCollisionBox();
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacles[i];
    obstacle.update();
    obstacle.draw();

    const obstacleBox = obstacle instanceof Bird
      ? { x: obstacle.x + 3, y: obstacle.y + 12, width: 51, height: 18 }
      : { x: obstacle.x + 2, y: obstacle.y, width: obstacle.width - 4, height: obstacle.height };
    if (intersects(dinoBox, obstacleBox)) {
      endGame();
    }

    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(i, 1);
    }
  }
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    e.preventDefault();
  }

  if (isGameOver) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      restartGame();
    }
    return;
  }

  if (e.code === 'Space' || e.code === 'ArrowUp') {
    dino.jump();
  } else if (e.code === 'ArrowDown' && dino.isGrounded) {
    dino.isCrouching = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowDown') {
    dino.isCrouching = false;
  }
});

window.addEventListener('blur', () => {
  dino.isCrouching = false;
});

window.addEventListener('touchstart', () => {
  if (isGameOver) {
    restartGame();
  } else {
    dino.jump();
  }
});

restartBtn.addEventListener('click', restartGame);

function gameLoop() {
  if (Math.floor(score) % 1000 >= 500) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  drawBackground();
  dino.update();
  dino.draw();
  handleObstacles();
  sceneryOffset += gameSpeed * 0.35;

  score += 0.15;
  gameSpeed += 0.001;
  scoreDisplay.textContent = String(Math.floor(score)).padStart(5, '0');

  if (!isGameOver) {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  if (isGameOver) {
    return;
  }
  isGameOver = true;
  cancelAnimationFrame(animationFrameId);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('dino_high_score', highScore);
    highScoreDisplay.textContent = String(Math.floor(highScore)).padStart(5, '0');
  }

  gameOverMenu.style.display = 'block';
}

function restartGame() {
  isGameOver = false;
  score = 0;
  gameSpeed = 5;
  obstacles = [];
  obstacleTimer = 0;
  nextObstacleInterval = 80;
  sceneryOffset = 0;
  dino.y = GROUND_Y - dino.height;
  dino.velocityY = 0;
  dino.isGrounded = true;
  dino.isCrouching = false;
  gameOverMenu.style.display = 'none';

  cancelAnimationFrame(animationFrameId);
  gameLoop();
}

gameLoop();

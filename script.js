// SELECTORS
let startPage = document.querySelector('.start-page');
let gameOverPage = document.querySelector('.game-over-page');
let winPage = document.querySelector('.win-page');
let btn = document.querySelectorAll('.btn');
let canvasPage = document.querySelector('.canvas');

// VARIABLE DECLARATION
let bulletsMain = [];
let bulletsEnemy = [];
let mainPlayer = 0;
let enemies = [];
let score = 0;
let lives = 0;
let intevalId = 0;
let isUpArrow = false;
let isDownArrow = false;
//img declaration
let imgPlayer = 'img/6530353_preview-removebg-preview.png';
let imgEnemy =
  'img/99-996087_star-wars-ship-png-star-wars-fighter-png-removebg-preview (1).png';
//sound declaration
let winSound = new Audio();
winSound.src = 'audio/start.mp3';
let crashSound = new Audio();
crashSound.src = 'audio/crashenemy.mp3';
let shootSound = new Audio();
shootSound.src = 'audio/shoot.mp3';
let gameOverSound = new Audio();
gameOverSound.src = 'audio/gameover.mp3';

//BUILDING CANVAS
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let gameBcK = new Image();
gameBcK.src = 'img/game.jpg';

// CLASS DECLARATION
class Player {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.width = 60;
    this.height = 60;
  }
  drawPlayer() {
    let playerImg = new Image();
    playerImg.src = this.img;
    ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
  }
}
class Bullet {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radious = 5;
  }

  drawBullet() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radious, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

//EVENT LISTENER DECLARATION
document.addEventListener('keydown', event => {
  if (event.key == 'ArrowDown') {
    isUpArrow = false;
    isDownArrow = true;
  } else if (event.key == 'ArrowUp') {
    isUpArrow = true;
    isDownArrow = false;
  } else if (event.keyCode == '32') {
    shootSound.play();
    bulletsMain.push(new Bullet(mainPlayer.x + 60, mainPlayer.y + 25, 'green'));
  }
});
document.addEventListener('keyup', event => {
  isUpArrow = false;
  isDownArrow = false;
});
btn.forEach(e => {
  e.addEventListener('click', () => {
    // settting values
    score = 2;
    lives = 2;
    intevalId = 0;
    mainPlayer = new Player(75, 350, imgPlayer);
    enemies = [new Player(1200, 150, imgEnemy)];
    bulletsMain = [];
    bulletsEnemy = [];
    //display page
    startPage.style.display = 'none';
    gameOverPage.style.display = 'none';
    winPage.style.display = 'none';
    canvasPage.style.display = 'block';
    winSound.pause();
    //start interval again
    intervialId = setInterval(() => {
      requestAnimationFrame(draw);
      collision();
    }, 7);
  });
});

//FUNCTION DECLARATIOn
//collisions
function collision() {
  //bullet-bullet
  bulletsMain.forEach((e, i) => {
    bulletsEnemy.forEach((el, j) => {
      let dx = e.x - el.x;
      let dy = e.y - el.y;
      let distance = Math.sqrt(dx ** 2 + dy ** 2);
      if (distance < e.radious + el.radious) {
        bulletsMain.splice(i, 1);
        bulletsEnemy.splice(j, 1);
      }
    });
  });
  //player-enemy
  enemies.forEach(e => {
    if (
      mainPlayer.x < e.x + e.width &&
      mainPlayer.x + mainPlayer.width > e.x &&
      mainPlayer.y - 8 < e.y - 8 + e.height - 8 &&
      mainPlayer.y - 8 + mainPlayer.height - 8 > e.y - 8
    ) {
      gameOverPage.style.display = 'block';
      gameOverSound.play();
      canvasPage.style.display = 'none';
      clearInterval(intervialId);
    }
  });
  //bullet-enemy
  bulletsMain.forEach((e, i) => {
    enemies.forEach((el, j) => {
      if (
        e.x + e.radious >= el.x &&
        e.x + e.radious <= el.x + el.width &&
        e.y + e.radious >= el.y + 8 &&
        e.y - e.radious <= el.y + 8 + el.height - 8
      ) {
        crashSound.play();
        score -= 1;
        bulletsMain.splice(i, 1);
        enemies.splice(j, 1);
        if (score <= 0) {
          canvasPage.style.display = 'none';
          winPage.style.display = 'block';
          winSound.play();
          clearInterval(intervialId);
        }
        if (lives <= 0) {
          canvasPage.style.display = 'none';
          gameOverPage.style.display = 'block';
          clearInterval(intervialId);
        }
      }
    });
  });
  //bullet-player
  bulletsEnemy.forEach((e, i) => {
    if (
      e.x - e.radious <= mainPlayer.x + mainPlayer.width &&
      e.x - e.radious >= mainPlayer.x &&
      e.y - e.radious <= mainPlayer.y + 8 + mainPlayer.height - 8 &&
      e.y + e.radious >= mainPlayer.y + 8
    ) {
      lives -= 1;
      bulletsEnemy.splice(i, 1);
      if (lives == 0) {
        canvasPage.style.display = 'none';
        gameOverPage.style.display = 'block';
        gameOverSound.play();
        clearInterval(intervialId);
      }
    }
  });
}
//game
function draw() {
  let enemyY = Math.floor(Math.random() * (canvas.height - 130));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //canvas definition
  ctx.drawImage(gameBcK, 0, 0);
  ctx.beginPath();
  ctx.fillStyle = 'rgba(175, 182, 189, 0.6)';
  ctx.fillRect(0, canvas.height - 80, canvas.width, canvas.height);
  ctx.closePath();
  ctx.beginPath();
  ctx.font = '30px Big Shoulders Stencil Display';
  ctx.fillStyle = 'white';
  ctx.fillText(`Lives: ${lives}`, 40, canvas.height - 30);
  ctx.fillText(`Enemies: ${score}`, canvas.width - 160, canvas.height - 30);
  ctx.closePath();
  //Player
  mainPlayer.drawPlayer();
  if (isUpArrow && mainPlayer.y > -8) {
    mainPlayer.y -= 2;
  }
  if (isDownArrow && mainPlayer.y < canvas.height - 130) {
    mainPlayer.y += 2;
  }
  // bullets player
  bulletsMain.forEach((e, i) => {
    e.drawBullet();
    e.x += 2;
    if (e.x >= canvas.width) {
      bulletsMain.splice(i, 1);
    }
  });
  //Enemies
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].drawPlayer();
    enemies[i].x -= 1;
    if (enemies[i].x == 0) {
      if (lives == 1) {
        canvasPage.style.display = 'none';
        gameOverPage.style.display = 'block';
        gameOverSound.play();
        clearInterval(intervialId);
      } else {
        lives -= 1;
      }
    }
    if (enemies[i].x == 1100) {
      enemies.push(new Player(1300, enemyY, imgEnemy));
    } else if (enemies[i].x == 800) {
      bulletsEnemy.push(new Bullet(790, enemies[i].y + 25, 'red'));
    }
  }
  //bullets enemy
  bulletsEnemy.forEach(e => {
    e.drawBullet();
    e.x -= 2;
  });
}

// RUN GAME
window.addEventListener('load', () => {
  startPage.style.display = 'block';
});

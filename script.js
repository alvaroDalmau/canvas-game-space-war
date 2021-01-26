//BUILDING CANVAS
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

// CLASS DECLARATION
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
  }
  drawPlayer() {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.closePath();
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
class Bullet {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radious = 10;
  }

  drawBullet() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radious, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

// VARIABLE DECLARATION
canvas.style.backgroundColor = 'grey';
let score = 50;
let lives = 3;

let isUpArrow = false;
let isDownArrow = false;

let mainPlayer = new Player(75, 350);
let enemies = [new Player(1100, 150)];
let bulletsMain = [];
let bulletsEnemy = [];

//EVENT LISTENER DECLARATION
document.addEventListener('keydown', event => {
  if (event.key == 'ArrowDown') {
    isUpArrow = false;
    isDownArrow = true;
  } else if (event.key == 'ArrowUp') {
    isUpArrow = true;
    isDownArrow = false;
  } else if (event.keyCode == '32') {
    bulletsMain.push(new Bullet(mainPlayer.x + 60, mainPlayer.y + 25, 'green'));
  }
});
document.addEventListener('keyup', event => {
  isUpArrow = false;
  isDownArrow = false;
});

//FUNCTION DECLARATION
function information() {
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.fillRect(0, canvas.height - 80, canvas.width, canvas.height);
  ctx.closePath();

  ctx.beginPath();
  ctx.font = '15px Verdana';
  ctx.fillStyle = 'white';
  ctx.fillText(`Enemies alive: ${score}`, 30, canvas.height - 40);
  ctx.closePath();
}
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
      mainPlayer.y < e.y + e.height &&
      mainPlayer.y + mainPlayer.height > e.y
    ) {
      //colision detected!! GAME OVER
    }
  });
  //bullet-enemy NOT WORKING
  bulletsMain.forEach((e, i) => {
    enemies.forEach((el, j) => {
      let distX = Math.abs(e.x - (el.x + el.width) / 2);
      let distY = Math.abs(e.y - (el.y + el.height) / 2);
      if (distX <= e.radious && distY <= e.radious) {
        bulletsMain.splice(i, 1);
        enemies.splice(j, 1);
      }
      // if (distY <= el.height / 2) {
      //   bulletsMain.splice(i, 1);
      //   enemies.splice(j, 1);
      // }
    });
  });

  //bullet-main  (life -1)
}

function draw() {
  let enemyY = Math.floor(Math.random() * (canvas.height - 130));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  information();
  mainPlayer.drawPlayer();
  if (isUpArrow && mainPlayer.y > 0) {
    mainPlayer.y -= 2;
  }
  if (isDownArrow && mainPlayer.y < canvas.height - 130) {
    mainPlayer.y += 2;
  }
  bulletsMain.forEach(e => {
    e.drawBullet();
    e.x += 2;
  });

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].drawPlayer();
    enemies[i].x -= 2;
    if (enemies[i].x == 0) {
      lives -= 1;
    }
    if (lives == 0) {
      //GAME OVER
    }
    if (enemies[i].x == 720) {
      enemies.push(new Player(1100, enemyY));
    } else if (enemies[i].x == 800) {
      bulletsEnemy.push(new Bullet(790, enemies[i].y + 25, 'red'));
    }
  }
  bulletsEnemy.forEach(e => {
    e.drawBullet();
    e.x -= 3;
  });
}

// RUN GAME
let intervialId = setInterval(() => {
  requestAnimationFrame(draw);
  collision();
}, 10);

// window.addEventListener('load', () => {

// })

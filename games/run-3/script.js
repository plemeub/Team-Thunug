const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 30,
  dx: 0,
  dy: 0,
  speed: 6,
  gravity: 0.4,
  jump: -10,
  onGround: false
};

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  // Horizontal movement
  if (keys["ArrowLeft"]) player.dx = -player.speed;
  else if (keys["ArrowRight"]) player.dx = player.speed;
  else player.dx = 0;

  // Jump
  if (keys["ArrowUp"] && player.onGround) {
    player.dy = player.jump;
    player.onGround = false;
  }

  // Gravity
  player.dy += player.gravity;

  // Apply movement
  player.x += player.dx;
  player.y += player.dy;

  // Floor collision
  if (player.y + player.size > canvas.height) {
    player.y = canvas.height - player.size;
    player.dy = 0;
    player.onGround = true;
  }

  // Wrap left/right edges
  if (player.x < -player.size) player.x = canvas.width;
  if (player.x > canvas.width + player.size) player.x = -player.size;

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

update();

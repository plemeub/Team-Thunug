const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
let player = {
  x: 0,
  y: 0,
  size: 22,
  vx: 0,
  vy: 0,
  speed: 0.12,
  jump: 0.35,
  gravity: 0.002,
  grounded: false
};

// Controls
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Tunnel tiles
let tiles = [];
const tileRadius = 180;
const tileWidth = 50;
const tileHeight = 20;
const tileCount = 24;

// Rotation + gravity
let rotation = 0;
let gravityAngle = Math.PI / 2;

// Level
let level = 1;

function createLevel() {
  tiles = [];

  for (let i = 0; i < tileCount; i++) {
    const angle = (i / tileCount) * Math.PI * 2;
    tiles.push({
      angle,
      hole: Math.random() < 0.2,
      falling: Math.random() < 0.15,
      active: true
    });
  }

  const start = tiles[0];
  const px = Math.cos(start.angle) * tileRadius;
  const py = Math.sin(start.angle) * tileRadius;

  player.x = px;
  player.y = py;
  player.vx = 0;
  player.vy = 0;

  gravityAngle = start.angle + Math.PI / 2;
}

createLevel();

function update() {
  rotation += 0.01;

  const tangent = gravityAngle - Math.PI / 2;
  const tx = Math.cos(tangent);
  const ty = Math.sin(tangent);

  if (keys["ArrowLeft"]) {
    player.vx -= tx * player.speed;
    player.vy -= ty * player.speed;
  }
  if (keys["ArrowRight"]) {
    player.vx += tx * player.speed;
    player.vy += ty * player.speed;
  }

  if (keys["ArrowUp"] && player.grounded) {
    player.vx -= Math.cos(gravityAngle) * player.jump;
    player.vy -= Math.sin(gravityAngle) * player.jump;
    player.grounded = false;
  }

  player.vx += Math.cos(gravityAngle) * player.gravity;
  player.vy += Math.sin(gravityAngle) * player.gravity;

  player.x += player.vx;
  player.y += player.vy;

  player.grounded = false;
  let closest = null;
  let closestDist = Infinity;

  tiles.forEach(tile => {
    if (!tile.active || tile.hole) return;

    const angle = tile.angle + rotation;
    const tx = Math.cos(angle) * tileRadius;
    const ty = Math.sin(angle) * tileRadius;

    const dx = player.x - tx;
    const dy = player.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < tileWidth && dist < closestDist) {
      closestDist = dist;
      closest = tile;
    }
  });

  if (closest) {
    const angle = closest.angle + rotation;
    const tx = Math.cos(angle) * tileRadius;
    const ty = Math.sin(angle) * tileRadius;

    const dx = player.x - tx;
    const dy = player.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    const nx = dx / dist;
    const ny = dy / dist;

    const targetDist = tileHeight;
    player.x = tx + nx * targetDist;
    player.y = ty + ny * targetDist;

    gravityAngle = Math.atan2(ny, nx);

    player.vx *= 0.8;
    player.vy *= 0.8;

    player.grounded = true;

    if (closest.falling) {
      closest.active = false;
    }
  }

  const centerDist = Math.sqrt(player.x * player.x + player.y * player.y);
  if (centerDist > 600) {
    level++;
    createLevel();
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  tiles.forEach(tile => {
    const angle = tile.angle + rotation;
    const tx = Math.cos(angle) * tileRadius;
    const ty = Math.sin(angle) * tileRadius;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(angle + Math.PI / 2);

    if (!tile.active) ctx.fillStyle = "rgba(255,255,255,0.1)";
    else if (tile.hole) ctx.fillStyle = "black";
    else if (tile.falling) ctx.fillStyle = "#ff8800";
    else ctx.fillStyle = "white";

    ctx.fillRect(-tileWidth / 2, -tileHeight / 2, tileWidth, tileHeight);
    ctx.restore();
  });

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.fillStyle = "#00ffff";
  ctx.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);
  ctx.restore();

  ctx.restore();

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Level " + level, 20, 30);
}

update();

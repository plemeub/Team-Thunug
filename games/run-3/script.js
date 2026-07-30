const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
let player = {
  x: 0,
  y: 0,
  size: 20,
  vx: 0,
  vy: 0,
  speed: 4,
  gravity: 0.4,
  jumpStrength: 8,
  onGround: false
};

// Controls
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Tunnel + level
let tiles = [];
const tileSize = 40;
let level = 1;
let rotation = 0;          // global tunnel rotation
let gravityAngle = Math.PI / 2; // default: down

function createLevel() {
  tiles = [];
  const radius = 150;
  const segments = 24;

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const hole = Math.random() < 0.2; // 20% chance of hole
    tiles.push({
      angle,
      radius,
      hole,
      falling: Math.random() < 0.15, // 15% chance of falling tile
      active: true
    });
  }

  // Place player on one tile
  const startTile = tiles[0];
  const px = Math.cos(startTile.angle) * startTile.radius;
  const py = Math.sin(startTile.angle) * startTile.radius;
  player.x = px;
  player.y = py;
  player.vx = 0;
  player.vy = 0;
  gravityAngle = startTile.angle + Math.PI / 2;
}

createLevel();

function rotateVector(x, y, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  };
}

function update() {
  // Rotate tunnel slowly
  rotation += 0.01;

  // Movement relative to gravity
  const moveDir = gravityAngle - Math.PI / 2; // tangent direction
  let moveX = Math.cos(moveDir);
  let moveY = Math.sin(moveDir);

  player.vx *= 0.9;
  player.vy *= 0.9;

  if (keys["ArrowLeft"]) {
    player.vx -= moveX * player.speed * 0.2;
    player.vy -= moveY * player.speed * 0.2;
  }
  if (keys["ArrowRight"]) {
    player.vx += moveX * player.speed * 0.2;
    player.vy += moveY * player.speed * 0.2;
  }

  // Jump
  if (keys["ArrowUp"] && player.onGround) {
    player.vx -= Math.cos(gravityAngle) * player.jumpStrength;
    player.vy -= Math.sin(gravityAngle) * player.jumpStrength;
    player.onGround = false;
  }

  // Gravity
  player.vx += Math.cos(gravityAngle) * player.gravity;
  player.vy += Math.sin(gravityAngle) * player.gravity;

  // Apply movement
  player.x += player.vx;
  player.y += player.vy;

  // Check tiles
  player.onGround = false;
  let closestTile = null;
  let closestDist = Infinity;

  tiles.forEach(tile => {
    if (!tile.active || tile.hole) return;

    const tx = Math.cos(tile.angle + rotation) * tile.radius;
    const ty = Math.sin(tile.angle + rotation) * tile.radius;

    const dx = player.x - tx;
    const dy = player.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < tileSize && dist < closestDist) {
      closestDist = dist;
      closestTile = tile;
    }
  });

  if (closestTile) {
    // Snap player to tile surface
    const tx = Math.cos(closestTile.angle + rotation) * closestTile.radius;
    const ty = Math.sin(closestTile.angle + rotation) * closestTile.radius;

    const nx = player.x - tx;
    const ny = player.y - ty;
    const nd = Math.sqrt(nx * nx + ny * ny) || 1;
    const ux = nx / nd;
    const uy = ny / nd;

    const targetDist = tileSize / 2;
    player.x = tx + ux * targetDist;
    player.y = ty + uy * targetDist;

    // Align gravity to tile normal
    gravityAngle = Math.atan2(uy, ux);

    // Grounded
    player.onGround = true;

    // Falling tile
    if (closestTile.falling) {
      closestTile.active = false;
    }
  }

  // If player falls too far from center, reset level
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

  // Draw tunnel tiles
  tiles.forEach(tile => {
    const angle = tile.angle + rotation;
    const tx = Math.cos(angle) * tile.radius;
    const ty = Math.sin(angle) * tile.radius;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(angle + Math.PI / 2);

    if (!tile.active) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    } else if (tile.hole) {
      ctx.fillStyle = "black";
    } else if (tile.falling) {
      ctx.fillStyle = "#ff8800";
    } else {
      ctx.fillStyle = "#ffffff";
    }

    ctx.fillRect(-tileSize / 2, -tileSize / 4, tileSize, tileSize / 2);
    ctx.restore();
  });

  // Draw player
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.fillStyle = "#00ffff";
  ctx.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);
  ctx.restore();

  // HUD
  ctx.restore();
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Level: " + level, 20, 30);
}

update();

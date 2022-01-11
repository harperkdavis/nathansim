let nathans = {
  'standard': {
    'image': undefined
  }
}

let GRAVITY = 0.2;
let PLAYER_SPEED = 5;
let JUMP_HEIGHT = 7;

let keys = [];
let walls = [];

let currentNathan = 'standard';

let nathanHeight = 1, nathanHeightTarget = 1;
let velX = 0, velY = 0;

let position, correction;
let camera;
let cameraShake = 0;

let aim = 0;

let isGrounded = false;

function setup() {
  createCanvas(innerWidth, innerHeight);

  walls = [
    new Wall(-20000, 100, 40000, 10000),
    new Wall(400, -100, 400, 600),
  ]

  nathans['standard']['image'] = loadImage("https://i.imgur.com/qNRBIvl.png");

  position = createVector(0, 0);
  correction = createVector(0, 0);
  camera = createVector(0, 0);
}

function update() {
  nathanHeight = lerp(nathanHeight, nathanHeightTarget, 0.1);
  camera = createVector(lerp(camera.x, position.x, 0.1), lerp(camera.y, position.y, 0.1));
  correction = createVector(lerp(correction.x, 0, 0.2), lerp(correction.y, 0, 0.2));
  cameraShake = lerp(cameraShake, 0, 0.1);

  let hasLanded = isGrounded;
  isGrounded = false;
  let groundedWall;
  walls.forEach(wall => {
    if (wall.within(position.x + 16 * (1 / nathanHeight), position.y + 2) || wall.within(position.x - 16 * (1 / nathanHeight), position.y + 2)) {
      isGrounded = true;
      groundedWall = wall;
    }
  });

  if (!hasLanded && isGrounded) {
    nathanHeight -= abs(velY) * 0.06;
  }

  if (isGrounded) {
    position.y = groundedWall.y - 1;
    velY = 0;
    if (keys[' ']) {
      velY = -JUMP_HEIGHT - (1 - nathanHeight) * 8;
      position.y -= 4;
      isGrounded = false;
    }
    if (keys['s']) {
      nathanHeightTarget = 0.8;
    } else if (keys['w']) {
      nathanHeightTarget = 1.2;
    } else {
      nathanHeightTarget = 1;
    }
  } else {
    velY += GRAVITY * (keys['s'] ? 1.5 : keys['w'] ? 0.9 : 1);
    nathanHeightTarget = 1;
    nathanHeight += abs(velY) * 0.002;
  }

  velX = lerp(velX, ((keys['a'] ? -1 : 0) + (keys['d'] ? 1 : 0)) * PLAYER_SPEED, 0.2);

  position.x += velX;
  position.y += velY;

  walls.forEach(wall => {
    if (wall.within(position.x + 32 * (1 / nathanHeight), position.y - 32 * nathanHeight)) {
      correction = position;
      position.x = wall.x - 32 * (1 / nathanHeight) - 0.1;
      let difference = createVector(position.x - correction.x, position.y - correction.y);
      position = correction;
      correction = difference;
    }
    if (wall.within(position.x - 32 * (1 / nathanHeight), position.y - 32 * nathanHeight)) {
      correction = position;
      position.x = wall.x + wall.w + 32 * (1 / nathanHeight) + 0.1;
      let difference = createVector(position.x - correction.x, position.y - correction.y);
      position = correction;
      correction = difference;
    }
  });

  if (nathanHeight < 0.001) {
    nathanHeight = 0.001;
  }
}

function keyPressed() {
  keys[key] = true;
}

function keyReleased() {
  keys[key] = false;
}

function draw() {
  update();
  background(250);
  
  push();
  translate(width / 2 - camera.x + random(cameraShake, -cameraShake), height / 2 - camera.y + random(cameraShake, -cameraShake));

  stroke(0);
  strokeWeight(1);
  fill(255);

  rectMode(CORNERS);
  rect(-32.5 * (1 / nathanHeight) + position.x + correction.x, position.y + correction.y, 32.5 * (1 / nathanHeight) + position.x + correction.x, -65 * nathanHeight + position.y + correction.y);

  imageMode(CORNERS);
  image(nathans[currentNathan]['image'], -32 * (1 / nathanHeight) + position.x + correction.x, position.y + correction.y, 33 * (1 / nathanHeight) + position.x + correction.x, -64 * nathanHeight + position.y + correction.y);

  walls.forEach(wall => {
    wall.draw();
  });

  pop();
}

function isWithin(x, y, x1, y1, w, h) {
  return x >= x1 && x <= x1 + w && y >= y1 && y <= y1 + h;
}

class Wall {

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    rectMode(CORNER);
    fill(200);
    stroke(0);
    rect(this.x, this.y, this.w, this.h);
  }

  within(x, y) {
    return isWithin(x, y, this.x, this.y, this.w, this.h);
  }
      
}
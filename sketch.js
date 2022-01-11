let nathans = {
  'standard': {
    'image': undefined
  }
}

let GRAVITY = 0.2;
let PLAYER_SPEED = 5;
let JUMP_HEIGHT = 7;

let CRIT_CHANCE = 0.05;
let CRIT_MULTIPLIER = 2;

let money = 1000;

let keys = [];
let walls = [];
let bullets = [];
let particles = [];

let lastShot = -100000;
let ammo = 12;
let ammoAnim = 1;

let reloadTime = 0;


let guns = {
  'pistol': {
    'mode': 'single',
    'fireRate': 14,
    'maxAmmo': 12,
    'reload': 100,
    'range': 70,
    'damage': 10,
    'speed': 40,
    'power': 5,
  },
  'rifle': {
    'mode': 'auto',
    'fireRate': 8,
    'maxAmmo': 30,
    'reload': 150,
    'range': 100,
    'damage': 20,
    'speed': 50,
    'power': 3,
  },
  'sniper': {
    'mode': 'single',
    'fireRate': 40,
    'maxAmmo': 6,
    'reload': 300,
    'range': 200,
    'damage': 200,
    'speed': 100,
    'power': 20,
  },
  'supergun': {
    'mode': 'auto',
    'fireRate': 0,
    'maxAmmo': 1000,
    'reload': 200,
    'range': 30,
    'damage': 1,
    'speed': 60,
    'power': 20,
  }
}

let currentGun = 'rifle';
let currentNathan = 'standard';

let nathanHeight = 1, nathanHeightTarget = 1;
let velX = 0, velY = 0;

let position, correction;
let camera;
let cameraShake = 0;

let aim = 0;

let isGrounded = false;

let shopOpen = false;
let shopPage = 0;
let shopPos = -1000;

let shop = {};

function setup() {
  createCanvas(innerWidth, innerHeight);

  walls = [
    new Wall(-20000, 100, 40000, 10000),
    new Wall(400, -100, 400, 600),
    new Wall(-400, 0, 100, 20)
  ]

  nathans['standard']['image'] = loadImage("https://i.imgur.com/qNRBIvl.png");

  shop['navButtons'] = [
    new ShopButton(0, 150, 200, 40, "Upgrades", () => {
  
    })
  ]

  position = createVector(0, 0);
  correction = createVector(0, 0);
  camera = createVector(0, 0);
}

function update() {
  nathanHeight = lerp(nathanHeight, nathanHeightTarget, 0.1);
  camera = createVector(lerp(camera.x, position.x, 0.1), lerp(camera.y, position.y, 0.1));
  correction = createVector(lerp(correction.x, 0, 0.2), lerp(correction.y, 0, 0.2));
  cameraShake = lerp(cameraShake, 0, 0.1);

  shopPos = lerp(shopPos, shopOpen ? 0 : -1000, 0.1);
  ammoAnim = lerp(ammoAnim, ammo / guns[currentGun]['maxAmmo'], 0.2);

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
    if (wall.within(position.x + 16 * (1 / nathanHeight), position.y - 64 * nathanHeight) || wall.within(position.x - 16 * (1 / nathanHeight), position.y - 64 * nathanHeight)) {
      velY = -velY / 2;
      position.y = wall.y + wall.h + 64 * nathanHeight;
    }
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

  aim = atan2(mouseX - width / 2 + (camera.x - position.x), mouseY + 32 - height / 2 + (camera.y - position.y));

  if (reloadTime >= 0) {
    reloadTime -= 1;
    if (reloadTime <= 0) {
      ammo = guns[currentGun]['maxAmmo'];
    }
  }

  if (guns[currentGun]['mode'] == 'auto' && mouseIsPressed) {
    if (reloadTime <= 0) {
      if (ammo > 0) {
        if (frameCount > lastShot + guns[currentGun]['fireRate']) {
          shoot();
        }
      }
    }
  }

  bullets.forEach(bullet => {
    bullet['time'] -= 1;
    bullet['x'] += sin(bullet['dir']) * bullet['speed'];
    bullet['y'] += cos(bullet['dir']) * bullet['speed'];
  });

  bullets = bullets.filter(function(bullet) {
    if (bullet['time'] <= 0) {
      return false;
    }
    let isInAWall = false;
    walls.forEach(wall => {
      if (wall.within(bullet['x'], bullet['y'])) {
        isInAWall = true;
        addParticles(bullet['damage'] * 0.1 + 4, 5, bullet['x'], bullet['y'], -4, 4, -4, 4);
      }
    });
    return !isInAWall;
  });

  particles.forEach(particle => {
    if (particle['time'] > 0) {
      particle['time'] -= 0.2;
      particle['x'] += particle['xv'];
      particle['y'] += particle['yv'];
      particle['yv'] += GRAVITY;
    }
  });

  particles = particles.filter(particle => particle['time'] > 0);
  
}

function keyPressed() {
  keys[key] = true;
  if (key == 'q') {
    shopOpen = !shopOpen;
  } else if (key == 'r') {
    reloadTime = guns[currentGun]['reload'];
  }
}

function keyReleased() {
  keys[key] = false;
}

function mousePressed() {
  if (guns[currentGun]['mode'] == 'single') {
    if (reloadTime <= 0) {
      if (ammo > 0) {
        if (frameCount > lastShot + guns[currentGun]['fireRate']) {
          shoot();
        }
      }
    }
  }
}

function shoot() {
  bullets.push({
    'x': position.x + sin(aim) * 40,
    'y': position.y + cos(aim) * 40 - 32,
    'dir': aim,
    'damage': guns[currentGun]['damage'],
    'time': guns[currentGun]['range'],
    'speed': guns[currentGun]['speed']
  });
  addParticles(guns[currentGun]['power'], 4, position.x + sin(aim) * 40, position.y + cos(aim) * 40 - 32, -2, 2, -2, 2);
  ammo -= 1;
  cameraShake += guns[currentGun]['power'];
  lastShot = frameCount;
}

function addParticles(count, size, x, y, xv, xvm, yv, yvm) {
  for (let i = 0; i < count; i++) {
    particles.push({
      'time': size,
      'x': x,
      'y': y,
      'xv': random(xv, xvm),
      'yv': random(yv, yvm)
    })
  }
}

function draw() {
  noCursor();
  
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

  bullets.forEach(bullet => {
    strokeWeight(2);
    line(bullet['x'], bullet['y'], bullet['x'] + sin(bullet['dir']) * (20 + bullet['damage'] * 0.2), bullet['y'] + cos(bullet['dir']) * (20 + bullet['damage'] * 0.2))
  })

  strokeWeight(1);
  stroke(0, 100);
  line(position.x + sin(aim) * 40, position.y - 32 * nathanHeight + cos(aim) * 40, position.x + sin(aim) * 1000, position.y - 32 + cos(aim) * 1000);

  fill(0);
  noStroke();
  particles.forEach(particle => {
    ellipse(particle['x'], particle['y'], particle['time'], particle['size']);
  })

  pop();

  textSize(100);
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);

  textSize(86);
  text("$" + money.toLocaleString("en-US"), 8, 50);

  textSize(24);
  text("Nathan Simulator", 8, 4);

  textSize(12);
  text("Version 1.0", 8, 30);
  text("Press [Q] to open the Shop", 8, 135);

  
  textAlign(RIGHT, BOTTOM);

  textSize(64);
  if (reloadTime > 0) {
    fill(100);
  } else if (ammo == 0) {
    fill(255, 0, 0);
  } else {
    fill(0);
  }
  text(ammo, width - 30, height - 8);

  textSize(20);
  text(currentGun.toUpperCase(), width - 30, height - 70);

  stroke(0);
  rect(width - 24, height - 100, 10, 80);
  fill(255);
  rect(width - 24, height - 100 + (1 - ammoAnim) * 80, 10, 80 * ammoAnim);

  fill(0);

  push();
  translate(shopPos, 0);

  fill(255);
  stroke(0);
  rect(-1, 150, 700, height - 200);
  rect(-1, 150, 700, 40);

  shop['navButtons'].forEach(btn => {
    btn.draw();
  })

  pop();

  stroke(0);
  noFill();
  ellipse(mouseX + 0.5, mouseY + 0.5, 10, 10);
  line(mouseX - 7, mouseY, mouseX + 7, mouseY);
  line(mouseX, mouseY - 7, mouseX, mouseY + 7);
}

function isWithin(x, y, x1, y1, w, h) {
  return x >= x1 && x <= x1 + w && y >= y1 && y <= y1 + h;
}

class ShopButton {
  constructor(x, y, w, h, text, fnc) {
    this.x = x;
    this.y = y; 
    this.w = w; 
    this.h = h;
    this.text = text;
    this.fnc = fnc;
    this.mouseDelay = 0;
  }

  draw() {
    stroke(0);
    if (isWithin(mouseX, mouseY, this.x + shopPos, this.y, this.w, this.h)) {
      fill(250);
      if (mouseIsPressed && this.mouseDelay <= 0) { 
        this.fnc();
        this.mouseDelay = 10;
      }
    } else {
      fill(255);
    }
    rect(this.x, this.y, this.w, this.h);

    noStroke();
    if (this.mouseDelay > 0) {
      this.mouseDelay -= 1;
    }

    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    noStroke();
    text(this.text, this.x + this.w / 2, this.y + this.h / 2);

    
  }
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
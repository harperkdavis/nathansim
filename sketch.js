let nathans = {
  'standard': {
    'image': undefined,
    'waterbottle': undefined
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

let enemies = [];

let lastShot = -100000;
let ammo = 12;
let ammoAnim = 1;

let reloadTime = 0;
let invincibility = 0;


let guns = {
  'pistol': {
    'mode': 'single',
    'fireRate': 14,
    'maxAmmo': 18,
    'reload': 40,
    'range': 70,
    'damage': 10,
    'speed': 40,
    'power': 5,
    'spread': 10,
    'recoil': 2,
  },
  'rifle': {
    'mode': 'auto',
    'fireRate': 8,
    'maxAmmo': 45,
    'reload': 50,
    'range': 100,
    'damage': 20,
    'speed': 50,
    'power': 3,
    'spread': 2,
    'recoil': 2
  },
  'sniper': {
    'mode': 'single',
    'fireRate': 40,
    'maxAmmo': 10,
    'reload': 80,
    'range': 200,
    'damage': 200,
    'speed': 100,
    'power': 20,
    'spread': 0.1,
    'recoil': 20
  },
  'supergun': {
    'mode': 'auto',
    'fireRate': 0,
    'maxAmmo': 1000,
    'reload': 200,
    'range': 30,
    'damage': 10,
    'speed': 60,
    'power': 20,
    'spread': 20,
    'recoil': 2,
  }
}

let currentGun = 'pistol';
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
  nathans['standard']['waterbottle'] = loadImage("https://i.imgur.com/FVKJteN.png");

  shop['navButtons'] = [
    new ShopButton(0, 150, 200, 40, "Upgrades", () => {
      shopPage = 0;
    }),
    new ShopButton(200, 150, 200, 40, "Guns", () => {
      shopPage = 1;
    }),
    new ShopButton(400, 150, 200, 40, "Stocks", () => {
      shopPage = 2;
    }),
    new ShopButton(600, 150, 99, 40, "Close", () => {
      shopOpen = false;
    })
  ]

  enemies = [];
  for (let i = 0; i < 20; i++) {
    enemies.push(new Enemy(1000 + 200 * i, -200, 0));
  }

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
    if (wall.within(position.x + 16 * (1 / nathanHeight), position.y - 64 * nathanHeight) || wall.within(position.x - 16 * (1 / nathanHeight), position.y - 64 * nathanHeight)) {
      velY = -velY / 2;
      position.y = wall.y + wall.h + 64 * nathanHeight;
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
    if (!shopOpen) {
      if (reloadTime <= 0) {
        if (ammo > 0) {
          if (frameCount > lastShot + guns[currentGun]['fireRate']) {
            shoot();
          }
        }
      }
    }
  }

  bullets.forEach(bullet => {
    bullet['time'] -= 1;
    enemies.forEach(enemy => {
      let hit = inteceptCircleLineSeg({
        radius: 100, 
        center: createVector(enemy.x, enemy.y)
      }, {
        p1: createVector(bullet['x'], bullet['y']),
        p2: createVector(bullet['x'] + sin(bullet['dir']) * bullet['speed'], bullet['y'] + cos(bullet['dir']) * bullet['speed'])
      });
      if (hit.length > 0) {
        enemy.health -= bullet['damage'];
        bullet['time'] = 0;

        addParticles(bullet['damage'] * 0.1 + 4, 5, bullet['x'], bullet['y'], -4, 4, -4, 4);
      }
    });
    

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

  enemies.forEach(enemy => {
    enemy.update();
    if (invincibility <= 0 && dist(position.x, position.y, enemy.x, enemy.y) < 40) {
      money -= floor(random(20, 40));
      isGrounded = false;
      velX = enemy.xv * 4;
      nathanHeight = 0.8;
      velY = -random(5, 10);
      position.y -= 4;
      invincibility = 20;
      cameraShake = 10;
    }
  });
  invincibility--;
  
  enemies = enemies.filter(enemy => {
    if (enemy.health < 0) {
      enemy.die();
      return false;
    }
    return true;
  });

  
}

function keyPressed() {
  keys[key] = true;
  if (key == 'q') {
    shopOpen = !shopOpen;
  } else if (key == 'r') {
    reloadTime = guns[currentGun]['reload'];
  } else if (key == 'p') {
    for (let i = 0; i < 20; i++) {
      enemies.push(new Enemy(1000 + 200 * i, -200, 0));
    }
  }

  if (key == '1') {
    currentGun = 'pistol';
    ammo = guns[currentGun]['maxAmmo'];
  } else if (key == '2') {
    currentGun = 'rifle';
    ammo = guns[currentGun]['maxAmmo'];
  } else if (key == '3') {
    currentGun = 'sniper';
    ammo = guns[currentGun]['maxAmmo'];
  } else if (key == '4') {
    currentGun = 'supergun';
    ammo = guns[currentGun]['maxAmmo'];
  }

}

function keyReleased() {
  keys[key] = false;
}

function mousePressed() {
  if (guns[currentGun]['mode'] == 'single') {
    if (!shopOpen) {
      if (reloadTime <= 0) {
        if (ammo > 0) {
          if (frameCount > lastShot + guns[currentGun]['fireRate']) {
            shoot();
          }
        }
      }
    }
  }
  if (ammo == 0) {
    reloadTime = guns[currentGun]['reload'];
  }
}

function shoot() {
  bullets.push({
    'x': position.x + sin(aim) * 40,
    'y': position.y + cos(aim) * 40 - 32,
    'dir': aim + random(-1, 1) * guns[currentGun]['spread'] * 0.01,
    'damage': guns[currentGun]['damage'],
    'time': guns[currentGun]['range'],
    'speed': guns[currentGun]['speed']
  });
  addParticles(guns[currentGun]['power'], 4, position.x + sin(aim) * 40, position.y + cos(aim) * 40 - 32, -2, 2, -2, 2);
  ammo -= 1;
  cameraShake += guns[currentGun]['power'] / 2;
  lastShot = frameCount;
  velX += sin(aim + Math.PI) * guns[currentGun]['recoil'];
  velY += cos(aim + Math.PI) * guns[currentGun]['recoil'] * 0.3;

  nathanHeight -= random(0.5, 1) * 0.04 * guns[currentGun]['recoil'];
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

  if (invincibility > 0) {
    fill(255, 0, 0, 100);
    rect(-32.5 * (1 / nathanHeight) + position.x + correction.x, position.y + correction.y, 32.5 * (1 / nathanHeight) + position.x + correction.x, -65 * nathanHeight + position.y + correction.y);
  }

  walls.forEach(wall => {
    wall.draw();
  });
  
  enemies.forEach(enemy => {
    enemy.draw();
  })

  bullets.forEach(bullet => {
    strokeWeight(2);
    line(bullet['x'], bullet['y'], bullet['x'] + sin(bullet['dir']) * (40 + bullet['damage'] * 0.2), bullet['y'] + cos(bullet['dir']) * (40 + bullet['damage'] * 0.2))
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
  text("Press [Q] to open the Shop, [1-4] to switch guns, [P] to respawn enemies", 8, 135);

  
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
  rect(width - 24, height - 200, 10, 180);
  fill(255);
  rect(width - 24, height - 200 + (1 - ammoAnim) * 180, 10, 180 * ammoAnim);

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

// https://stackoverflow.com/questions/37224912/circle-line-segment-collision/37225895
function inteceptCircleLineSeg(circle, line){
  var a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
  v1 = {};
  v2 = {};
  v1.x = line.p2.x - line.p1.x;
  v1.y = line.p2.y - line.p1.y;
  v2.x = line.p1.x - circle.center.x;
  v2.y = line.p1.y - circle.center.y;
  b = (v1.x * v2.x + v1.y * v2.y);
  c = 2 * (v1.x * v1.x + v1.y * v1.y);
  b *= -2;
  d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
  if(isNaN(d)){ // no intercept
      return [];
  }
  u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
  u2 = (b + d) / c;    
  retP1 = {};   // return points
  retP2 = {}  
  ret = []; // return array
  if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
      retP1.x = line.p1.x + v1.x * u1;
      retP1.y = line.p1.y + v1.y * u1;
      ret[0] = retP1;
  }
  if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
      retP2.x = line.p1.x + v1.x * u2;
      retP2.y = line.p1.y + v1.y * u2;
      ret[ret.length] = retP2;
  }       
  return ret;
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

class Enemy {

  constructor(x, y, t) {
    this.x = x;
    this.y = y;
    this.t = t;
    this.xv = 0;
    this.yv = 0;
    this.movedelay = 30;
    this.health = 100;
    this.maxHealth = 100;
    this.hLerp = 1;
  }

  update() {
    if (this.movedelay < 0) {
      if (position.x < this.x) {
        this.xv = (random(0, 10) < 1 ? -1 : 1) * random(-5, -15);
      } else {
        this.xv = (random(0, 10) < 1 ? -1 : 1) * random(5, 15);
      }
      this.yv = random(2, 10);
      this.movedelay = 60 + random(0, 30);
    } else {
      this.movedelay -= 1;
    }
    this.yv += GRAVITY * 2;

    walls.forEach(wall => {
      if (wall.within(this.x + this.xv + 32, this.y)) {
        this.xv = -abs(this.xv / 2);
      }
      if (wall.within(this.x + this.xv - 32, this.y)) {
        this.xv = abs(this.xv / 2);
      }
      if (wall.within(this.x + this.xv, this.y + this.yv)) {
        this.yv = -abs(this.yv);
      }
    });

    this.x += this.xv;
    this.y += this.yv;

    this.hLerp = lerp(this.hLerp, this.health / this.maxHealth, 0.1);
  }

  draw() {
    stroke(0);
    fill(255);
    ellipse(this.x, this.y - 32, 64, 64);

    imageMode(CENTER);
    image(nathans[currentNathan]['waterbottle'], this.x, this.y - 32, 20, 50);

    stroke(0);
    fill(0);
    rect(this.x - 50, this.y - 110, 100, 10);

    fill(255 * (1 - this.hLerp), 255 * this.hLerp, 0);
    rect(this.x - 50, this.y - 110, 100 * this.hLerp, 10);
  }

  die() {
    money += 50 + floor(random(0, 100));
    addParticles(20, 10, this.x, this.y, -8, 8, -8, 8);
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
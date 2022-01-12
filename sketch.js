const MAJOR_VERSION = 0, MINOR_VERSION = 1, PATCH_VERSION = 6;

let sfx = {
  'shoot': undefined,
  'damage': undefined,
}

let nathans = {
  'standard': {
    'image': undefined,
  }
}

let GRAVITY = 0.2;
let PLAYER_SPEED = 5;
let JUMP_HEIGHT = 7;

let CRIT_CHANCE = 0.05;
let CRIT_MULTIPLIER = 2;

let AUTOAIM_RADIUS = 400;
let AUTOAIM_ENABLED = false;

let autoaimOffset;

let money = 1000;
let multiplier = 1;

let comboAnim = 0, multAnim = 0;

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
    'shots': 1,
    'fireRate': 14,
    'maxAmmo': 18,
    'reload': 10,
    'range': 70,
    'damage': 10,
    'speed': 40,
    'pen': 0.6,
    'power': 5,
    'spread': 10,
    'recoil': 8,
  },
  'rifle': {
    'mode': 'auto',
    'shots': 1,
    'fireRate': 8,
    'maxAmmo': 45,
    'reload': 25,
    'range': 100,
    'damage': 20,
    'speed': 50,
    'pen': 0.4,
    'power': 3,
    'spread': 2,
    'recoil': 6
  },
  'smg': {
    'mode': 'auto',
    'shots': 1,
    'fireRate': 2,
    'maxAmmo': 60,
    'reload': 20,
    'range': 50,
    'damage': 10,
    'speed': 50,
    'pen': 0.1,
    'power': 3,
    'spread': 8,
    'recoil': 4,
  },
  'sniper': {
    'mode': 'single',
    'shots': 1,
    'fireRate': 35,
    'maxAmmo': 10,
    'reload': 40,
    'range': 200,
    'damage': 200,
    'speed': 100,
    'pen': 1,
    'power': 20,
    'spread': 0.1,
    'recoil': 35
  },
  'shotgun': {
    'mode': 'single',
    'shots': 5,
    'fireRate': 15,
    'maxAmmo': 12,
    'reload': 20,
    'range': 20,
    'damage': 10,
    'speed': 40,
    'pen': 0.2,
    'power': 20,
    'spread': 10,
    'recoil': 25
  },
  'supergun': {
    'mode': 'auto',
    'shots': 1,
    'fireRate': 0,
    'maxAmmo': 1000,
    'reload': 1,
    'range': 30,
    'damage': 100,
    'speed': 60,
    'pen': 2,
    'power': 20,
    'spread': 20,
    'recoil': 2,
  }
}

let enem = {
  'waterbottle': {
    'image': undefined
  }
}

let currentGun = 'pistol';
let currentNathan = 'standard';

let nathanHeight = 1, nathanHeightTarget = 1;
let velX = 0, velY = 0;

let position;
let camera;
let cameraShake = 0;

let aim = 0;
let aimX = 0;
let aimY = 0;

let isGrounded = false;

let shopOpen = false;
let shopPage = 2;
let shopPos = -1000;

let shop = {};

let stocks = [
  {
    'name': 'CHNM',
    'longname': "The Chenmeister Company",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'NATH',
    'longname': "Nathan Incorporated",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'WTBT',
    'longname': "Waterbottle United",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'LESP',
    'longname': "Lester's Pencil Emporium",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'CONC',
    'longname': "Concave Caves Co.",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'DEVN',
    'longname': "Devon Inc.",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'ESQR',
    'longname': "The Esquire Union",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'LTTY',
    'longname': "LITTY!",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'CHEN',
    'longname': "The Meisterchen Company",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'GBAN',
    'longname': "Gorban Group",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'SORP',
    'longname': "SORPA Computer Company",
    'seed': 0,
    'data': [],
  },
  {
    'name': 'NVCN',
    'longname': "Nikolai Vulkan Technology",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'LOCK',
    'longname': "Lockers United",
    'seed': 0,
    'data': [],
  },
  {
    'name': 'WATR',
    'longname': "National Water Company",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'BTTL',
    'longname': "National Bottle Company",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
  {
    'name': 'PINA',
    'longname': "Pineapple Allergy Medication",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
]

let stockOpen = 0;

function setup() {
  createCanvas(innerWidth, innerHeight);

  walls = [
    new Wall(-10000, 0, 40000, 10000),
    new Wall(-10000, -40000, 9000, 50000),
    new Wall(-1000, -1000, 2000, 1000)
  ]

  nathans['standard']['image'] = loadImage("https://i.imgur.com/qNRBIvl.png");
  enem['waterbottle']['image'] = loadImage("https://i.imgur.com/FVKJteN.png");

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

  shop['stockButtons'] = []

  for (let i = 0; i < 16; i++) {
    shop['stockButtons'].push(new ShopButton(0, 220 + 30 * i, 300, 30, stocks[i]['name'], () => {
      stockOpen = i;
    }));
  }

  shop['stockPurchase'] = [
    new ShopButton(400, 578, 30, 22, "1", () => {
      buyStock(stockOpen, 1);
    }),
    new ShopButton(400, 608, 30, 22, "1", () => {
      sellStock(stockOpen, 1);
    }),
    new ShopButton(440, 578, 30, 22, "10", () => {
      buyStock(stockOpen, 10);
    }),
    new ShopButton(440, 608, 30, 22, "10", () => {
      sellStock(stockOpen, 10);
    }),
    new ShopButton(480, 578, 40, 22, "100", () => {
      buyStock(stockOpen, 100);
    }),
    new ShopButton(480, 608, 40, 22, "100", () => {
      sellStock(stockOpen, 100);
    }),
    new ShopButton(530, 578, 50, 22, "1000", () => {
      buyStock(stockOpen, 1000);
    }),
    new ShopButton(530, 608, 50, 22, "1000", () => {
      sellStock(stockOpen, 1000);
    }),
  ]

  enemies = [];
  for (let i = 0; i < 20; i++) {
    enemies.push(new Enemy(1000 + 200 * i, -200, 0, 1));
  }

  position = createVector(0, -1200);
  camera = createVector(0, 0);
  autoaimOffset = createVector(0, 0);

  stocks.forEach(stock => {
    stock['seed'] = floor(random(0, 1000000));
    stock['data'] = new Array(100).fill(0);
  });

  for (let i = 0; i < 101; i++) {
    calcStock((100 - i) * -60);
  }
}

function update() {

  if (!AUTOAIM_ENABLED) {
    aimX = mouseX - width / 2 + camera.x + (camera.x - position.x);
    aimY = mouseY - height / 2 + camera.y + (camera.y - position.y);
  } else {
    aimX = lerp(aimX, mouseX - width / 2 + camera.x + autoaimOffset.x, 0.5);
    aimY = lerp(aimY, mouseY - height / 2 + camera.y + autoaimOffset.y, 0.5);
  }

  nathanHeight = lerp(nathanHeight, nathanHeightTarget, 0.1);
  camera = createVector(lerp(camera.x, position.x, 0.1), lerp(camera.y, position.y, 0.1));
  cameraShake = lerp(cameraShake, 0, 0.1);

  comboAnim = lerp(comboAnim, 0, 0.1);
  multAnim = lerp(multAnim, isGrounded ? 0 : 1, 0.1);

  shopPos = lerp(shopPos, shopOpen ? 0 : -1000, 0.1);
  ammoAnim = lerp(ammoAnim, ammo / guns[currentGun]['maxAmmo'], 0.2);

  let hasLanded = isGrounded;
  isGrounded = false;
  let groundedWall;
  walls.forEach(wall => {
    if (abs(velX) < PLAYER_SPEED + 1 && wall.within(position.x + 16 * (1 / nathanHeight), position.y + 2) || wall.within(position.x - 16 * (1 / nathanHeight), position.y + 2)) {
      isGrounded = true;
      groundedWall = wall;
    }
  });

  if (!hasLanded && isGrounded) {
    nathanHeight -= abs(velY) * 0.06;
  }

  if (isGrounded) {
    multiplier = 1;
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
    if (position.x < wall.x && wall.within(position.x + 32 * (1 / nathanHeight), position.y - 32 * nathanHeight)) {
      let correction = position;
      position.x = wall.x - 32 * (1 / nathanHeight) - 0.1;
      if (mag(position.x - correction.x, position.y - correction.y) > 80) {
        position = correction;
      }
    }
    if (position.x > wall.x + wall.w && wall.within(position.x - 32 * (1 / nathanHeight), position.y - 32 * nathanHeight)) {
      let correction = position;
      position.x = wall.x + wall.w + 32 * (1 / nathanHeight) + 0.1;
      if (mag(position.x - correction.x, position.y - correction.y) > 80) {
        position = correction;
      }
    }
    if (position.y < wall.y + wall.h && wall.within(position.x + 16 * (1 / nathanHeight), position.y - 64 * nathanHeight) || wall.within(position.x - 16 * (1 / nathanHeight), position.y - 64 * nathanHeight)) {
      velY = -velY / 2;
      position.y = wall.y + wall.h + 64 * nathanHeight;
    }
  });

  if (nathanHeight < 0.001) {
    nathanHeight = 0.001;
  }

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
        bullet['time'] *= bullet['pen'];
        bullet['time'] -= 1;

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

  let autoaimed = false;
  enemies.forEach(enemy => {
    enemy.update();
    if (!autoaimed) {
      let distToAim = dist(enemy.x, enemy.y, aimX, aimY)
      if (distToAim <= AUTOAIM_RADIUS) {
        autoaimOffset = createVector(enemy.x - aimX, enemy.y - aimY + 32);
        autoaimed = true;
      }
    }
    if (invincibility <= 0 && dist(position.x, position.y, enemy.x, enemy.y) < 40) {
      money -= floor(random(20, 40));
      isGrounded = false;
      velX = enemy.xv * 4;
      nathanHeight = 0.8;
      velY = -random(5, 10);
      position.y -= 4;
      invincibility = 20;
      cameraShake = 10;
      
      if (!isGrounded) {
        multiplier = ((multiplier - 1) / 2) + 1;
        multAnim = 0.5;
      }
      
    }
  });
  if (!autoaimed) {
    autoaimOffset = createVector(0, 0);
  }
  invincibility--;
  
  enemies = enemies.filter(enemy => {
    if (enemy.health < 0) {
      enemy.die();
      return false;
    }
    return true;
  });

  aim = atan2(aimX - camera.x, aimY - camera.y + 32);
  
  if (frameCount % 60 == 0) {
    calcStock(frameCount);
  }
}

function calcStock(frCount) {
  stocks.forEach(stock => {
    noiseSeed(stock.seed);
    stock['data'].shift();
    let newData = frCount / 1000.0 + noise(frCount / 20000.0, 0) * 1000 + noise(frCount / 5000.0, 200) * 200 + noise(frCount / 2000.0, 400) * 50 + noise(frCount / 200.0) * 20 + noise(frCount);
    newData = max(1, newData);
    stock['data'].push(newData);
  });
}

function buyStock(index, count) {
  let stock = stocks[index];
  if (money >= stock['data'][99] * count) {
    stock['shares'] += count;
    money -= floor(stock['data'][99] * count); 
  }
}

function sellStock(index, count) {
  let stock = stocks[index];
  if (stock['shares'] >= count) {
    stock['shares'] -= count;
    money += ceil(stock['data'][99] * count); 
  }
}

function keyPressed() {
  keys[key] = true;
  if (key == 'q') {
    shopOpen = !shopOpen;
  } else if (key == 'r') {
    reloadTime = guns[currentGun]['reload'];
  } else if (key == 'p') {
    for (let i = 0; i < 20; i++) {
      enemies.push(new Enemy(1000 + 200 * i, -200, 0, 1));
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
    currentGun = 'smg';
    ammo = guns[currentGun]['maxAmmo'];
  } else if (key == '5') {
    currentGun = 'shotgun';
    ammo = guns[currentGun]['maxAmmo'];
  } else if (key == '6') {
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
  for (let i = 0; i < guns[currentGun]['shots']; i++) {
    bullets.push({
      'x': position.x + sin(aim) * 40,
      'y': position.y + cos(aim) * 40 - 32,
      'dir': aim + random(-1, 1) * guns[currentGun]['spread'] * 0.02,
      'damage': floor(guns[currentGun]['damage'] * random(0.9, 1.1)),
      'time': guns[currentGun]['range'],
      'speed': guns[currentGun]['speed'],
      'pen': guns[currentGun]['pen']
    });
  }
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

function addTextParticle(count, size, x, y, xv, xvm, yv, yvm, text, r, g, b) {
  for (let i = 0; i < count; i++) {
    particles.push({
      'time': size,
      'x': x,
      'y': y,
      'xv': random(xv, xvm),
      'yv': random(yv, yvm),
      'text': text,
      'col': [r, g, b]
    })
  }
}

function draw() {
  noCursor();
  
  update();
  background(250);

  let offset = createVector(width / 2 - camera.x + random(cameraShake, -cameraShake), height / 2 - camera.y + random(cameraShake, -cameraShake));

  stroke(200);
  let offX = offset.x % 100;
  for (let i = -2; i < width / 100 + 2; i++) {
    line(offX + i * 100, 0, offX + i * 100, height);
  }

  let offY = offset.y % 100;
  for (let i = -2; i < height / 100 + 2; i++) {
    line(0, offY + i * 100, width, offY + i * 100);
  }
  
  
  push();
  translate(offset.x, offset.y);

  stroke(0);
  strokeWeight(1);
  fill(255);

  rectMode(CORNERS);
  rect(-32.5 * (1 / nathanHeight) + position.x, position.y , 32.5 * (1 / nathanHeight) + position.x , -65 * nathanHeight + position.y);

  imageMode(CORNERS);
  image(nathans[currentNathan]['image'], -32 * (1 / nathanHeight) + position.x, position.y, 33 * (1 / nathanHeight) + position.x, -64 * nathanHeight + position.y);

  if (invincibility > 0) {
    fill(255, 0, 0, 100);
    rect(-32.5 * (1 / nathanHeight) + position.x, position.y, 32.5 * (1 / nathanHeight) + position.x, -65 * nathanHeight + position.y);
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

  if (AUTOAIM_ENABLED) {
    strokeWeight(3);
    stroke(255, 0, 0);
    noFill();
    ellipse(aimX + 0.5, aimY + 0.5, 30, 30);
    line(aimX - 20, aimY, aimX + 20, aimY);
    line(aimX, aimY - 20, aimX, aimY + 20);
  }

  fill(0);
  noStroke();
  particles.forEach(particle => {
    if (particle['text'] === undefined) {
      ellipse(particle['x'], particle['y'], particle['time'], particle['time']);
    } else {
      let col = particle['col'];
      fill(col[0], col[1], col[2]);
      textSize(particle['time'] * 4);
      textAlign(CENTER, CENTER);
      text(particle['text'], particle['x'], particle['y']);
      console.log(particle['text']);
    }
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
  text("Version " + MAJOR_VERSION + "." + MINOR_VERSION + "." + PATCH_VERSION, 8, 30);
  text("Press [Q] to open the Shop, [1-6] to switch guns, [P] to respawn enemies", 8, 135);

  textSize(64 * multAnim + comboAnim * 32 + multiplier);
  textAlign(CENTER, TOP);
  text(nf(multiplier, 1, 1) + "x", width / 2, 40);


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
  });

  if (shopPage == 0) {

  } else if (shopPage == 1) {

  } else if (shopPage == 2) {
    fill(0);
    textSize(20);
    noStroke();
    textAlign(LEFT, TOP);
    text("Stocks", 5, 195);

    for (let i = 0; i < 16; i++) { 
      let btn = shop['stockButtons'][i];
      let stk = stocks[i];
      btn.draw();

      let chg = stk['data'][99] - stk['data'][98];
      btn.text = stk['name'] + "  $" + nf(stk['data'][99], 0, 2) + "  (" + (chg > 0 ? "+" : "") + "$" + nf(chg, 0, 2) + ")";
    }

    let stock = stocks[stockOpen];
    let localMin = 100000000, localMax = 0;

    fill(255);
    stroke(0);
    rect(350, 200, 300, 300);

    for (let i = 0; i < 100; i++) {
      if (stock['data'][i] == 0) {
        continue;
      }
      localMin = min(localMin, stock['data'][i]);
      localMax = max(localMax, stock['data'][i]);
    }

    for (let i = 1; i < 100; i++) {
      if (stock['data'][i] == 0) {
        continue;
      }
      let change = stock['data'][i] - stock['data'][i - 1];
      if (change > 0) {
        stroke(0, 255, 0);
      } else {
        stroke(255, 0, 0);
      }
      let prev = map(stock['data'][i - 1], localMin, localMax, 0, 1);
      let curr = map(stock['data'][i], localMin, localMax, 0, 1);
      line(350 + (i - 1) * 3, 500 - prev * 300, 350 + i * 3, 500 - curr * 300);
    }

    fill(0, 100);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(40);
    text(stock['name'], 355, 205);

    textSize(20);
    fill(0);
    textStyle(BOLD);
    text(stock['longname'], 350, 510);
    textStyle(NORMAL);
    text("Price: $" + nf(stock['data'][99], 0, 2), 350, 535);
    text("Shares Owned: " + stock['shares'], 350, 555);

    text("Buy", 350, 580);
    text("Sell", 350, 610);

    shop['stockPurchase'].forEach(btn => {
      btn.draw();
    });

  }

  pop();

  stroke(0);
  noFill();
  ellipse(mouseX + 0.5, mouseY + 0.5, 30, 30);
  line(mouseX - 20, mouseY, mouseX + 20, mouseY);
  line(mouseX, mouseY - 20, mouseX, mouseY + 20);
  
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
    textSize(16);
    fill(0);
    noStroke();
    text(this.text, this.x + this.w / 2, this.y + this.h / 2);

    
  }
}

class Enemy {

  constructor(x, y, t, l) {
    this.x = x;
    this.y = y;
    this.t = t;
    this.l = l;
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
    image(enem['waterbottle']['image'], this.x, this.y - 32, 20, 50);

    stroke(0);
    fill(0);
    rect(this.x - 50, this.y - 100, 100, 5);

    fill(255 * (1 - this.hLerp), 255 * this.hLerp, 0);
    rect(this.x - 50, this.y - 100, 100 * this.hLerp, 5);
  }

  die() {
    money += floor((50 + random(0, 100)) * multiplier);
    multiplier += 0.1 + random(0, 0.2) * log(multiplier);
    addParticles(20, 10, this.x, this.y, -8, 8, -8, 8);

    comboAnim += 1;
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
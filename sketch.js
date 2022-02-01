const MAJOR_VERSION = 0, MINOR_VERSION = 5, PATCH_VERSION = 7;
const PATCH_NAME = "The World Generation Update";

let inMainMenu = true;

let sfx = {
  'shoot': undefined,
  'damage': undefined,
}

let nathans = {
  'standard': {
    'image': undefined,
  },
  'rufus': {  
    'image': undefined,
  }
}

let upgrades = {
  "speed": {
    value: 6,
    baseval: 6,
    incr: 0.5,
    level: 0,
    price: 1000,
    baseprice: 1000,
    factor: 0.3,
  },
  "jump height": {    
    value: 7,
    baseval: 7,
    incr: 0.5,
    level: 0,
    price: 2000,
    baseprice: 2000,
    factor: 0.4,
  },
  "jumps": {    
    value: 1,
    baseval: 1,
    incr: 1,
    level: 0,
    price: 100000,
    baseprice: 100000,
    factor: 1,
  },
  "air control": {    
    value: 1,
    baseval: 1,
    incr: 0.1,
    level: 0,
    price: 500,
    baseprice: 500,
    factor: 0.3,
  },
  "damage": {    
    value: 0.5,
    baseval: 0.5,
    incr: 0.25,
    level: 0,
    price: 100,
    baseprice: 100,
    factor: 0.4,
  },
  "penetration": {    
    value: 1,
    baseval: 1,
    incr: 0.3,
    level: 0,
    price: 20000,
    baseprice: 20000,
    factor: 0.5,
  },
  "precision": {    
    value: 1,
    baseval: 1,
    incr: 0.25,
    level: 0,
    price: 4000,
    baseprice: 4000,
    factor: 0.4,
  },
  "reload": {    
    value: 0.5,
    baseval: 0.5,
    incr: 0.25,
    level: 0,
    price: 4000,
    baseprice: 4000,
    factor: 0.2,
  },
  "recoil": {    
    value: 0.5,
    baseval: 0.5,
    incr: 0.25,
    level: 0,
    price: 2000,
    baseprice: 2000,
    factor: 0.6,
  },
  "ammo": {    
    value: 1,
    baseval: 1,
    incr: 0.2,
    level: 0,
    price: 10000,
    baseprice: 10000,
    factor: 0.4,
  },
  "luck": {    
    value: 1,
    baseval: 1,
    incr: 0.1,
    level: 0,
    price: 1000,
    baseprice: 1000,
    factor: 0.7,
  },
  "money": {    
    value: 1.2,
    baseval: 1.2,
    incr: 0.2,
    level: 0,
    price: 1000,
    baseprice: 1000,
    factor: 0.3,
  },
  "camera shake": {    
    value: 1,
    baseval: 1,
    incr: 100,
    level: 0,
    price: 1,
    baseprice: 1,
    factor: 0.001,
  },
}

let GRAVITY = 0.2;

let DAMAGE_MULTIPLIER = 1;

let AUTOAIM_RADIUS = 400;
let AUTOAIM_ENABLED = false;

let autoaimOffset;

let money = 1000;
let multiplier = 1;

let comboAnim = 0, multAnim = 0;

let keys = [];
let keylogger = [];
let walls = [];
let localWalls = [];

let bullets = [];
let particles = [];

let enemies = [];
let enemyBullets = [];

let lastShot = -100000;
let ammo = 12;
let ammoAnim = 1;

let reloadTime = 0;
let invincibility = 0;

let startFrame = 0;


let guns = {
  'pistol': {
    'mode': 'single',
    'shots': 1,
    'fireRate': 18,
    'maxAmmo': 16,
    'reload': 45,
    'range': 20,
    'damage': 6,
    'speed': 40,
    'pen': 0.001,
    'power': 5,
    'spread': 7,
    'recoil': 12,
    'price': 0
  },
  'double barrel': {
    'mode': 'single',
    'shots': 4,
    'fireRate': 5,
    'maxAmmo': 2,
    'reload': 25,
    'range': 8,
    'damage': 15,
    'speed': 40,
    'pen': 0.2,
    'power': 20,
    'spread': 15,
    'recoil': 20,
    'price': 2000
  },
  'auto pistol': {
    'mode': 'auto',
    'shots': 1,
    'fireRate': 18,
    'maxAmmo': 16,
    'reload': 45,
    'range': 20,
    'damage': 4,
    'speed': 40,
    'pen': 0.001,
    'power': 10,
    'spread': 12,
    'recoil': 10,
    'price': 6000
  },
  'submachine gun': {
    'mode': 'auto',
    'shots': 1,
    'fireRate': 3,
    'maxAmmo': 40,
    'reload': 40,
    'range': 20,
    'damage': 8,
    'speed': 50,
    'pen': 0.1,
    'power': 3,
    'spread': 12,
    'recoil': 3,
    'price': 20000
  },
  'automatic rifle': {
    'mode': 'auto',
    'shots': 1,
    'fireRate': 8,
    'maxAmmo': 30,
    'reload': 25,
    'range': 50,
    'damage': 30,
    'speed': 50,
    'pen': 0.6,
    'power': 3,
    'spread': 2,
    'recoil': 12,
    'price': 60000
  },
  'shotgun': {
    'mode': 'single',
    'shots': 6,
    'fireRate': 15,
    'maxAmmo': 12,
    'reload': 20,
    'range': 10,
    'damage': 12,
    'speed': 40,
    'pen': 0.2,
    'power': 20,
    'spread': 10,
    'recoil': 25,
    'price': 120000
  },
  'triple shot': {
    'mode': 'auto',
    'shots': 3,
    'fireRate': 8,
    'maxAmmo': 30,
    'reload': 25,
    'range': 50,
    'damage': 20,
    'speed': 50,
    'pen': 0.4,
    'power': 2,
    'spread': 4,
    'recoil': 14,
    'price': 400000
  },
  'sniper': {
    'mode': 'single',
    'shots': 1,
    'fireRate': 35,
    'maxAmmo': 12,
    'reload': 40,
    'range': 100,
    'damage': 200,
    'speed': 100,
    'pen': 0.99,
    'power': 20,
    'spread': 0.1,
    'recoil': 32,
    'price': 1000000
  },
  'double sniper': {
    'mode': 'single',
    'shots': 2,
    'fireRate': 35,
    'maxAmmo': 12,
    'reload': 40,
    'range': 100,
    'damage': 400,
    'speed': 100,
    'pen': 0.99,
    'power': 20,
    'spread': 2,
    'recoil': 40,
    'price': 12000000
  },
  'supernova': {
    'mode': 'single',
    'shots': 12,
    'fireRate': 12,
    'maxAmmo': 18,
    'reload': 20,
    'range': 10,
    'damage': 24,
    'speed': 40,
    'pen': 0.2,
    'power': 24,
    'spread': 6,
    'recoil': 32,
    'price': 40000000
  },
  'penta shot': {
    'mode': 'auto',
    'shots': 5,
    'fireRate': 14,
    'maxAmmo': 50,
    'reload': 25,
    'range': 50,
    'damage': 40,
    'speed': 50,
    'pen': 0.4,
    'power': 2,
    'spread': 6,
    'recoil': 14,
    'price': 100000000
  },
  'nathan killer': {
    'mode': 'auto',
    'shots': 5,
    'fireRate': 6,
    'maxAmmo': 100,
    'reload': 20,
    'range': 50,
    'damage': 100,
    'speed': 50,
    'pen': 0.8,
    'power': 2,
    'spread': 3,
    'recoil': 12,
    'price': 500000000
  },
  'supergun': {
    'mode': 'auto',
    'shots': 10,
    'fireRate': 0,
    'maxAmmo': 1000000,
    'reload': 1,
    'range': 30,
    'damage': 1000,
    'speed': 60,
    'pen': 0.99,
    'power': 0,
    'spread': 20,
    'recoil': 2,
    'price': 1000000000
  }
}

let ownedGuns = ['pistol'];
let currentGunSlot = 0;
let equippedGuns = [{name:'pistol', ammo: 16}, {name:'', ammo: 0}, {name:'', ammo: 0}, {name:'', ammo: 0}, {name:'', ammo: 0}];

let enem = {
  'waterbottle': {
    'image': undefined
  },
  'backpack': {
    'image': undefined
  },
  'nathan': {
    'image': undefined
  },
  'lock': {
    'image': undefined
  }
}

let d5340dbe53de7c8912916a41d074ea92 = false;

let currentGun = 'pistol';
let currentNathan = 'standard';

let nathanHeight = 1, nathanHeightTarget = 1;
let velX = 0, velY = 0;

let position;
let camera;
let cameraShake = 0;

let jumps = 1;

let aim = 0;
let aimX = 0;
let aimY = 0;

let isGrounded = false;

let shopOpen = false;
let shopPage = 0;
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
    'shares': 0,
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
    'shares': 0,
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
    'name': 'ALEX',
    'longname': "Johnston Video Editing Suite",
    'seed': 0,
    'data': [],
    'shares': 0,
  },
]

let stockOpen = 0;

let lastLoadedLevel = 0;
let GENERATOR_SEED = 10;
let gens = [];

function setup() {
  GENERATOR_SEED = random(0, 10000000);
  randomSeed(GENERATOR_SEED);
  createCanvas(innerWidth, innerHeight);

  walls = [
    new Wall(-10000, 0, 1000000, 10000),
    new Wall(-10000, -40000, 6500, 50000),
    new Wall(-3500, -3000, 2000, 1000),
    new Wall(-3500, -40000, 3000, 37000),
    new Wall(-1500, -3000, 1000, 1800),
    new Wall(-3500, -1000, 4500, 1000),
    new Wall(1000, -900, 200, 900),
    new Wall(1200, -800, 200, 800),
    new Wall(1400, -700, 200, 700),
    new Wall(1600, -600, 200, 600),
    new Wall(1800, -500, 200, 500),
    new Wall(2000, -400, 200, 400),
    new Wall(2200, -300, 200, 300),
    new Wall(2400, -200, 200, 200),
    new Wall(2600, -100, 200, 100),
  ]

  nathans['standard']['image'] = loadImage("https://i.imgur.com/qNRBIvl.png");
  nathans['rufus']['image'] = loadImage("https://i.imgur.com/ehb9nsw.png");
  enem['waterbottle']['image'] = loadImage("https://i.imgur.com/FVKJteN.png");
  enem['backpack']['image'] = loadImage("https://i.imgur.com/ldrErrs.png");
  enem['lock']['image'] = loadImage("https://i.imgur.com/njvhkEa.png");
  enem['nathan']['image'] = loadImage("https://i.imgur.com/e7cvRyz.png");

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
    new ShopButton(590, 578, 60, 22, "10000", () => {
      buyStock(stockOpen, 10000);
    }),
    new ShopButton(590, 608, 60, 22, "10000", () => {
      sellStock(stockOpen, 10000);
    }),
    new ShopButton(660, 578, 30, 22, "M", () => {
      buyStock(stockOpen, floor(money / stocks[stockOpen]['data'][99]));
    }),
    new ShopButton(660, 608, 30, 22, "M", () => {
      sellStock(stockOpen, stocks[stockOpen]['shares']);
    }),
  ]

  shop['upgradePurchase'] = [];

  let i = 0;
  Object.keys(upgrades).forEach(key => {
    let upg = upgrades[key];
    shop['upgradePurchase'].push(new ShopButton(10, 220 + 35 * i, 140, 30, toTitleCase(key), () => {
      if (money >= upg['price']) {
        money -= floor(upg['price']);
        upg['level'] += 1;
        upg['value'] = upg['baseval'] + upg['incr'] * upg['level'];
        upg['price'] = floor(upg['baseprice'] * exp(upg['level'] * upg['factor']));
      }
    }));
    shop['upgradePurchase'][i]['upgkey'] = key;
    i++;
  });

  shop['gunPurchase'] = [];
  shop['gunEquip'] = [];
  let j = 0;
  Object.keys(guns).forEach(key => {
    let gun = guns[key];
    shop['gunPurchase'].push(new ShopButton(10, 220 + 35 * j, 500, 30, toTitleCase(key) + " ($" + gun['price'].toLocaleString() + ")", () => {
      if (money >= gun['price']) {
        money -= gun['price'];
        ownedGuns.push(key);
      }
    }));
    for (let k = 0; k < 5; k++) {
      shop['gunEquip'].push(new ShopButton(515 + 35 * k, 220 + 35 * j, 30, 30, k + 1, () => {
        if (ownedGuns.includes(key)) {
          if (equippedGuns[k]['name'] != key) {
            equippedGuns.forEach(eqp => {
              if (eqp['name'] == key) {
                eqp['name'] = '';
                eqp['ammo'] = 0;
              }
            });
            
            equippedGuns[k]['name'] = key;
            equippedGuns[k]['ammo'] = gun['maxAmmo'];
            ammo = equippedGuns[k]['ammo'];
            currentGunSlot = k;
            currentGun = key;
          }
        }
      }));
      shop['gunEquip'][j * 5 + k]['gunkey'] = key;
      shop['gunEquip'][j * 5 + k]['slot'] = k;
    }
    shop['gunPurchase'][j]['gunkey'] = key;
    j++;
  });
  

  enemies = [];

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
  randomSeed(GENERATOR_SEED);
  for (let i = 0; i < 16; i++) {
    let gen = {};
    let genWalls = [];
    let genSpawns = [];

    let wallCount = floor(random(2, 8));
    for (let j = 0; j < wallCount; j++) {
      let x = floor(random(0, 12));
      let y = floor(random(0, 20));
      let w = floor(random(1, 12 - x));
      let h = floor(random(1, 21 - y));
      genWalls.push([x, y, w, h]);
    }

    for (let j = 0; j < wallCount; j++) {
      let wall = genWalls[j];
      let x = 24 - wall[0] - wall[2];
      let y = wall[1];
      let w = wall[2];
      let h = wall[3];
      genWalls.push([x, y, w, h]);
    }
    genSpawns.push([12, 18, floor(random(0, 2)), 1]);
    
    for (let i = 0; i < random(1, 4); i++) {
      let spX = floor(random(0, 12)) + 0.5;
      let spY = floor(random(0, 20)) + 0.5;
      while(testWalls(genWalls, spX, spY)) {
        spX = floor(random(0, 12)) + 0.5;
        spY = floor(random(0, 20)) + 0.5;
      }

      genSpawns.push([spX, spY, floor(random(0, 3)), random(0.8, 1.2)]);
      genSpawns.push([24 - spX, spY, floor(random(0, 3)), random(0.8, 1.2)]);
    }

    gen['spawns'] = genSpawns;
    gen['walls'] = genWalls;

    gens.push(gen);
  }

}

function testWalls(walls, x, y) {
  walls.forEach(wall => {
    if (isWithin(x, y, wall[0], wall[1], wall[2], wall[3])) {
      return true;
    }
  });
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
  camera = createVector(lerp(camera.x, position.x, 0.2), lerp(camera.y, position.y, 0.2));
  cameraShake = lerp(cameraShake, 0, 0.1 / (1 + getValue('camera shake') * 0.01));

  comboAnim = lerp(comboAnim, 0, 0.1);
  multAnim = lerp(multAnim, isGrounded ? 0 : 1, 0.1);

  shopPos = lerp(shopPos, shopOpen ? 0 : -1000, 0.1);
  ammoAnim = lerp(ammoAnim, ammo / floor(guns[currentGun]['maxAmmo'] * getValue('ammo')), 0.2);

  equippedGuns[currentGunSlot]['ammo'] = ammo;

  if (isGrounded) {
    multiplier = 1;
  }

  if (keys['s']) {
    nathanHeightTarget = 0.8;
  } else if (keys['w']) {
    nathanHeightTarget = 1.2;
  } else {
    nathanHeightTarget = 1;
  }
  if (currentNathan == 'rufus') {
    nathanHeightTarget *= 2;
  }
  nathanHeight += abs(velY) * 0.001;

  velY += GRAVITY * (keys['s'] ? 1.5 * getValue("air control") : keys['w'] ? 0.9 / getValue("air control"): 1);
  
  if (abs(velX) < getValue("speed") || Math.sign(velX) != Math.sign(((keys['a'] ? -1 : 0) + (keys['d'] ? 1 : 0)))) {
    velX += ((keys['a'] ? -1 : 0) + (keys['d'] ? 1 : 0)) * getValue("speed") * (isGrounded ? 0.2 : 0.1);
  } else if (isGrounded && abs(velX) > getValue("speed") && Math.sign(velX) == Math.sign(((keys['a'] ? -1 : 0) + (keys['d'] ? 1 : 0)))) {
    velX = Math.sign(((keys['a'] ? -1 : 0) + (keys['d'] ? 1 : 0))) * getValue("speed");
  }
  if (!keys['a'] && !keys['d']) {
    if (isGrounded) {
      velX = lerp(velX, 0, 0.2);
    } else {
      velX = lerp(velX, 0, 0.01);
    }
  }

  let newX = position.x + velX;
  let newY = position.y + velY;

  localWalls = [];

  walls.forEach(wall => {
    if (!(wall.x > width * 2 && wall.x + wall.w < -width && wall.y > height * 2 && wall.y + wall.h < -height)) {
      localWalls.push(wall);
    }
  });
  
  let prevGrounded = isGrounded;
  isGrounded = false;
  localWalls.forEach(wall => {
    {
      let left = intersectPoint(position.x - 32, position.y, newX - 32, newY, wall.x, wall.y, wall.x + wall.w, wall.y);
      let right = intersectPoint(position.x + 32, position.y, newX + 32, newY, wall.x, wall.y, wall.x + wall.w, wall.y);

      if (left != false) {
        newY = left.y - 0.1;
        isGrounded = true;
        jumps = getValue("jumps");
        if (!prevGrounded) {
          nathanHeight -= velY * 0.04;
        }
        velY = 0;
      } else if (right != false) {
        newY = right.y - 0.1;
        isGrounded = false;
        jumps = getValue("jumps");
        if (!prevGrounded) {
          nathanHeight -= velY * 0.04;
        } 
        velY = 0;
      }
    }
    {
      let left = intersectPoint(position.x - 32, position.y - 64, newX - 32, newY - 64, wall.x, wall.y + wall.h, wall.x + wall.w, wall.y + wall.h);
      let right = intersectPoint(position.x + 32, position.y - 64, newX + 32, newY - 64, wall.x, wall.y + wall.h, wall.x + wall.w, wall.y + wall.h);

      if (left != false) {
        newY = left.y + 64.1;
        velY = -abs(velY / 2);
      } else if (right != false) {
        newY = right.y + 64.1;
        velY = -abs(velY / 2);
      }
    }
    {
      let right = intersectPoint(position.x + 32, position.y, newX + 32, newY, wall.x, wall.y, wall.x, wall.y + wall.h);
      let top = intersectPoint(position.x + 32, position.y - 64, newX + 32, newY - 64, wall.x, wall.y, wall.x, wall.y + wall.h);

      if (right != false) {
        newX = right.x - 32.1;
        velX = 0;
        jumps = getValue("jumps");
      } else if (top != false) {
        newX = top.x - 32.1;
        velX = 0;
        jumps = getValue("jumps");
      }
    }
    {
      let left = intersectPoint(position.x - 32, position.y, newX - 32, newY, wall.x + wall.w, wall.y, wall.x + wall.w, wall.y + wall.h);
      let top = intersectPoint(position.x - 32, position.y - 64, newX - 32, newY - 64, wall.x + wall.w, wall.y, wall.x + wall.w, wall.y + wall.h);

      if (left != false) {
        newX = left.x + 32.1;
        velX = 0;
        jumps = getValue("jumps");
      } else if (top != false) {
        newX = top.x + 32.1;
        velX = 0;
        jumps = getValue("jumps");
      }
    }
    
  });

  position.x = newX;
  position.y = newY;  

  if (position.x < -500 && money < 1000000000) {
    position.x = -500;
  }

  if (nathanHeight < 0.001) {
    nathanHeight = 0.001;
  }

  if (reloadTime >= 0) {
    reloadTime -= 1;
    if (reloadTime <= 0) {
      ammo = floor(guns[currentGun]['maxAmmo'] * getValue('ammo'));
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

  if (keys['l'] && d5340dbe53de7c8912916a41d074ea92) {
    for(let i = 0; i < 50; i++) {
      enemies.push(new Enemy(3000 + 2 * i, -200, 0, 10));
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
        enemy.health -= floor(bullet['damage'] * getValue("damage"));
        bullet['time'] *= bullet['pen'] * getValue("penetration");
        bullet['time'] -= 1;

        addParticles(4, 5, bullet['x'], bullet['y'], -4, 4, -4, 4);
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
    localWalls.forEach(wall => {
      if (wall.within(bullet['x'], bullet['y'])) {
        isInAWall = true;
        addParticles(4, 5, bullet['x'], bullet['y'], -4, 4, -4, 4);
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
    if (invincibility <= 0 && dist(position.x, position.y, enemy.x, enemy.y) < 60) {
      money -= floor((randomBias(20, 40, 1 - getValue('luck') / 2, 1) * pow(3, enemy.l) * (enemy.t == 1 ? 2 : 1)) / getValue("money"));
      velX = enemy.xv;
      nathanHeight = 0.8;
      velY = -random(5, 10);
      position.y -= 4;
      invincibility = 20;
      cameraShake = 10 * getValue('camera shake');
      
      multiplier = ((multiplier - 1) / 2) + 1;
      multAnim = 0.5;
      
    }
  });
  if (!autoaimed) {
    autoaimOffset = createVector(0, 0);
  }
  invincibility--;

  enemyBullets.forEach(bullet => {
    bullet['x'] += bullet['xv'];
    bullet['y'] += bullet['yv'];
    localWalls.forEach(wall => {
      if (wall.within(bullet['x'], bullet['y'])) {
        addParticles(4, 6, bullet['x'], bullet['y'], -4, 4, 2, 4);
        bullet['t'] = -1;
      }
    });
    bullets.forEach(plbullet => {
      if (dist(plbullet['x'], plbullet['y'], bullet['x'], bullet['y']) < 50) {
        bullet['t'] = -1;
        plbullet['t'] = -1;
        addParticles(6, 8, bullet['x'], bullet['y'], -4, 4, -2, -4);
      }
    });
    addParticles(2, 4, bullet['x'], bullet['y'], -4, 4, 2, 4);
    if (invincibility <= 0 && dist(position.x, position.y, bullet['x'], bullet['y']) < 60) {
      money -= floor((randomBias(20, 40, 1 - getValue('luck') / 2, 1) * pow(3, bullet['l'])) / getValue("money"));
      velX = bullet['xv'];
      nathanHeight = 0.8;
      velY = -random(5, 10);
      position.y -= 4;
      invincibility = 20;
      cameraShake = 10 * getValue('camera shake');
      
      multiplier = ((multiplier - 1) / 2) + 1;
      multAnim = 0.5;
      bullet['t'] = 0;
    }
    bullet['t'] -= 1;
  });

  enemyBullets = enemyBullets.filter(bullet => {
    if (bullet['t'] <= 0) {
      return false;
    }
    return true;
  });
  
  enemies = enemies.filter(enemy => {
    if (enemy.health <= 0) {
      enemy.die();
      jumps = getValue('jumps');
      return false;
    }
    return true;
  });

  aim = atan2(aimX - camera.x, aimY - camera.y + 32);
  
  if (frameCount - startFrame % 60 == 0) {
    calcStock(frameCount - startFrame);
  }


  let level = floor(position.x / 2500);
  if (level + 1 > lastLoadedLevel) {
    loadLevel(level + 1);
    lastLoadedLevel = level + 1;
  }
}

function loadLevel(l) {
  randomSeed(GENERATOR_SEED + l * 1000);
  let gen = gens[floor(random(0, gens.length))];
  console.log(gens.length);
  gen['walls'].forEach(rectArr => {
    walls.push(new Wall(l * 2500 + 300 + rectArr[0] * 100, -2000 + rectArr[1] * 100, rectArr[2] * 100, rectArr[3] * 100))
  });

  for (let i = 0; i < floor((pow(2, l / 24) + 10 + l / 12) * random(1, 2)); i++) {
    let spawn = gen['spawns'][floor(random(0, gen['spawns'].length))];
    let type = spawn[2];
    let level = floor(max(min(exp(l / 32) * spawn[3] + pow(random(-1.2, 1.2), 2), 10), 1));
    let newEnemy = new Enemy(l * 2500 + 300 + spawn[0] * 100, -2000 + spawn[1] * 100, type, level);
    
    localWalls.forEach(wall => {
      if (wall.within(newEnemy.x, newEnemy.y)) {
        newEnemy.y = wall.y - 10;
      }
    });
    enemies.push(newEnemy);
  }
}

function calcStock(frCount) {
  stocks.forEach(stock => {
    noiseSeed(stock.seed);
    stock['data'].shift();
    let newData = (frCount / 400.0) * getValue('luck') + noise(frCount / 20000.0, 0) * 1000 + noise(frCount / 5000.0, 200) * 200 + noise(frCount / 2000.0, 400) * 50 + noise(frCount / 200.0) * 20 + noise(frCount);
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

function getValue(val) {
  return upgrades[val]['value'];
}

function keyPressed() {
  keys[key] = true;
  console.log(keys);

  keylogger.push(key);

  if (keylogger.length >= 5) {
    if (keylogger[keylogger.length - 5] == 'r' &&
      keylogger[keylogger.length - 4] == 'u' &&
      keylogger[keylogger.length - 3] == 'f' &&
      keylogger[keylogger.length - 2] == 'u' &&
      keylogger[keylogger.length - 1] == 's') {
        currentNathan = 'rufus';
      }
  }

  if (jumps > 0 && keys[' ']) {
    position.y -= 4;
    let wallJumping = false;
    localWalls.forEach(wall => {
      if (wall.within(position.x - 34, position.y - 32)) {
        velX = getValue('speed');
        position.x += 4;
        wallJumping = true;
      }
      if (wall.within(position.x + 34, position.y - 32)) {
        velX = -getValue('speed');
        position.x -= 4;
        wallJumping = true;
      }
    });
    velY = (-getValue('jump height') - (1 - nathanHeight) * 8);
    
    jumps--;
  }

  if (key == 'q') {
    shopOpen = !shopOpen;
  } else if (key == 'r' && reloadTime <= 0) {
    reloadTime = floor(guns[currentGun]['reload'] / getValue("reload"));
  }

  if (key == '1') {
    if (equippedGuns[0]['name'] != '') {
      currentGunSlot = 0;
      currentGun = equippedGuns[0]['name'];
      ammo = equippedGuns[0]['ammo'];
    }
  } else if (key == '2') {
    if (equippedGuns[1]['name'] != '') {
      currentGunSlot = 1;
      currentGun = equippedGuns[1]['name'];
      ammo = equippedGuns[1]['ammo'];
    }
  } else if (key == '3') {
    if (equippedGuns[2]['name'] != '') {
      currentGunSlot = 2;
      currentGun = equippedGuns[2]['name'];
      ammo = equippedGuns[2]['ammo'];
    }
  } else if (key == '4') {
    if (equippedGuns[3]['name'] != '') {
      currentGunSlot = 3;
      currentGun = equippedGuns[3]['name'];
      ammo = equippedGuns[3]['ammo'];
    }
  } else if (key == '5') {
    if (equippedGuns[4]['name'] != '') {
      currentGunSlot = 4;
      currentGun = equippedGuns[4]['name'];
      ammo = equippedGuns[4]['ammo'];
    }
  } else if (key == 'j') {
    d5340dbe53de7c8912916a41d074ea92 = true;
    currentGun = 'supergun';
    money = Infinity;
    ammo = floor(guns[currentGun]['maxAmmo'] * getValue('ammo'));
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
  if (ammo == 0 && reloadTime <= 0) {
    reloadTime = floor(guns[currentGun]['reload'] / getValue('reload'));
  }
}

function shoot() {
  for (let i = 0; i < guns[currentGun]['shots']; i++) {
    bullets.push({
      'x': position.x + sin(aim) * 40,
      'y': position.y + cos(aim) * 40 - 32,
      'dir': aim + (random(-1, 1) * guns[currentGun]['spread'] * 0.02) / getValue('precision'),
      'damage': floor(guns[currentGun]['damage'] * randomBias(0.9, 1.1, getValue('luck') / 2, 1)),
      'time': guns[currentGun]['range'],
      'speed': guns[currentGun]['speed'],
      'pen': guns[currentGun]['pen']
    });
  }
  addParticles(guns[currentGun]['power'] * 0.5 + 1, 4, position.x + sin(aim) * 40, position.y + cos(aim) * 40 - 32, -2, 2, -2, 2);
  ammo -= 1;
  cameraShake += (guns[currentGun]['power'] / 2) * getValue('camera shake');
  lastShot = frameCount;
  velX += sin(aim + Math.PI) * guns[currentGun]['recoil'] * 0.1 * getValue('recoil');
  velY += cos(aim + Math.PI) * guns[currentGun]['recoil'] * 0.3 * getValue('recoil');

  nathanHeight -= random(0.5, 1) * 0.04 * guns[currentGun]['recoil'];
}

function addParticles(count, size, x, y, xv, xvm, yv, yvm) {
  if (particles.length + count > 100) {
    return;
  }
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

function startGame() {
  startFrame = frameCount;
}

function draw() {
  background(250);
  if (inMainMenu) {

    textAlign(CENTER, CENTER);
    textSize(64);
    text("Nathan Simulator", width / 2, height / 2 - 200);

    textSize(16);
    text("game of the year edition", width / 2, height / 2 - 160);

    imageMode(CENTER);
    image(nathans[currentNathan]['standard'], width / 2, height / 2);
    text(titleCase(currentNathan), width / 2, height / 2 + 100);

    return;
  }


  noCursor();
  
  update();

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

  fill(0);
  textAlign(CENTER, CENTER);
  noStroke();
  textSize(400);
  text(floor((position.x - 200) / 2500), floor((position.x - 200) / 2500) * 2500 + 1500, -250);

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

  localWalls.forEach(wall => {
    wall.draw();
  });

  fill(0);
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Nathan's Lair", -700, -1300);

  textSize(16);
  text("$" + money.toLocaleString() + " / $1,000,000,000 (" + nf((money / 10000000), 0, 2) + "%)", -700, -1250);

  if (money < 1000000000) {
    stroke(0, 255, 255)
    for (let i = 0; i <  5; i++) {
      line(-532 + random(-5, 5), -1199, -532 + random(-5, 5), -1001);
    }
  }

  stroke(0);
  fill(0);
  rect(-800, -1280, 200, 10);
  fill(255);
  rect(-800, -1280, min((money / 1000000000), 1) * 200, 10);

  enemies.forEach(enemy => {
    enemy.draw();
  });

  fill(255);
  stroke(0);
  enemyBullets.forEach(bullet => {
    ellipse(bullet['x'], bullet['y'], 20, 20);
  });

  stroke(0);
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
  text("Version " + MAJOR_VERSION + "." + MINOR_VERSION + "." + PATCH_VERSION + " - \"" + PATCH_NAME + "\"", 8, 30);
  text("Press [Q] to open the Shop, [1-6] to switch guns, [P] to respawn enemies", 8, 135);

  textSize(min(64 * multAnim + comboAnim * 2 + multiplier * 0.2, 128));
  textAlign(CENTER, TOP);
  text(nf(multiplier, 1, 1) + "x", width / 2, 40);

  if (!isGrounded) {
    textSize(64);
    textAlign(LEFT, TOP);
    fill(0, 100);
    text(".".repeat(getValue('jumps')), width / 2 - textWidth(".".repeat(getValue('jumps'))) / 2, -20);

    fill(0);
    text(".".repeat(jumps), width / 2 - textWidth(".".repeat(getValue('jumps'))) / 2, -20);
  }

  if (d5340dbe53de7c8912916a41d074ea92) {
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(255, 0, 0);
    text("Cheater Mode", width / 2, 100);
  }

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

  fill(0, 100);
  noStroke();

  textSize(12);
  textAlign(RIGHT, TOP);
  for (let i = 0; i < 5; i++) {
    let gn = equippedGuns[i];
    if (gn[i] == '') {
      fill(0, 100);
    } else if (i == currentGunSlot) {
      fill(0);
    } else {
      fill(0, 150);
    }
    let txt = "[" + (i + 1) + "] " + (gn['name'] == '' ? 'empty' : gn['name']);
    text(txt, width - 5, height - 400 + 20 * i);
  }

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
    let i = 0;
    shop['upgradePurchase'].forEach(btn => {
      btn.draw();

      let upg = upgrades[btn['upgkey']];
      
      textAlign(LEFT, TOP);
      fill(0);
      noStroke();
      if (money < upg['price']) {
        fill(255, 0, 0);
      }
      textSize(18);
      text("$" + upg['price'].toLocaleString(), 160, 234 + 35 * i);

      textSize(12);
      text("Price", 160, 220 + 35 * i);

      textAlign(RIGHT, TOP);

      textSize(18);
      text(upg['level'], 330, 232 + 35 * i);
      
      textSize(12);
      text("Level", 330, 220 + 35 * i);

      i++;
    });
  } else if (shopPage == 1) {
    let i = 0;
    shop['gunPurchase'].forEach(btn => {
      btn.draw();
      if (ownedGuns.includes(btn['gunkey'])) {
        fill(0, 0, 255, 50);
        rect(btn.x, btn.y, btn.w, btn.h);
      }
      i++;
    });
    shop['gunEquip'].forEach(btn => {
      btn.draw();
      if (equippedGuns[btn['slot']]['name'] == btn['gunkey']) {
        fill(0, 0, 255, 50);
        rect(btn.x, btn.y, btn.w, btn.h);
      }
      i++;
    });
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

function randomBias(min, max, bias, inf) {
  let b = lerp(min, max, bias);
  let rnd = random(min, max);
  let mix = random() * inf;
  return rnd * (1 - mix) + b * mix;
}

function isWithin(x, y, x1, y1, w, h) {
  return x >= x1 && x <= x1 + w && y >= y1 && y <= y1 + h;
}

// https://stackoverflow.com/questions/37224912/circle-line-segment-collision/37225895
function inteceptCircleLineSeg(circle, line){
  let a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
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

// https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
function intersects(a, b, c, d, p, q, r, s) {
  let det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};

// https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
function intersectPoint(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

  // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return {x, y}
}

// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
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
        this.mouseDelay = keys['m'] ? 0 : 10;
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
    this.speed = 160 - 10 * l * (this.t == 1 ? 0.5 : ((this.t == 2) ? 2 : 1));
    this.bulletspeed = (300 - 16 * l * (this.t == 1 ? 1.5 : ((this.t == 2) ? 2 : 1))) * random(1, 1.4);
    this.movedelay = this.speed;
    this.shootdelay = this.bulletspeed;
    this.maxHealth = floor(10 * exp(l - 1) * (this.t == 1 ? 2 : (this.t == 2 ? 0.5 : 1)));
    this.health = this.maxHealth;
    
    this.hLerp = 1;
    this.nomoney = false;
  }

  update() {
    if (this.movedelay <= 0) {
      if (position.x < this.x) {
        this.xv = ((random(0, 10) < 1 ? 1 : -1) * random(5, 15)) * 0.1 * this.l * (this.t == 2 ? 2: 1);
      } else {
        this.xv = ((random(0, 10) < 1 ? -1 : 1) * random(5, 15)) * 0.1 * this.l * (this.t == 2 ? 2: 1);
      }
      this.yv = random(2, 5) * (this.l + 2) * 0.5 * (this.t == 1 ? 0.5 : (this.t == 2 ? -2 : 1));;
      this.movedelay = this.speed + random(0, 30);
    } else {
      this.movedelay -= 1;
    }
    this.yv += GRAVITY * 2;

    if (this.shootdelay <= 0 && this.l < 4) {
      let angle = atan2(position.x - this.x, position.y - 32 - this.y);
      enemyBullets.push({
        'x': this.x,
        'y': this.y,
        'xv': sin(angle) * 10,
        'yv': cos(angle) * 10,
        'l': this.l,
        't': 200,
      });
      this.shootdelay = this.bulletspeed;
    } else {
      this.shootdelay -= 1;
    }

    walls.forEach(wall => {
      if (wall.within(this.x + this.xv + 32, this.y)) {
        this.xv = -abs(this.xv / 2);
      }
      if (wall.within(this.x + this.xv - 32, this.y)) {
        this.xv = abs(this.xv / 2);
      }
      if (wall.within(this.x + this.xv, this.y + this.yv)) {
        this.yv = -abs(this.yv * 0.8);
      }
      if (wall.within(this.x, this.y + this.yv - 32)) {
        this.yv = abs(this.yv * 0.8);
      }
    });

    if (dist(this.x, this.y, position.x, position.y) > 6000) {
      this.health = -1;
      this.nomoney = true;
    }

    this.x += this.xv;
    this.y += this.yv;

    this.hLerp = lerp(this.hLerp, this.health / this.maxHealth, 0.1);
  }

  draw() {
    stroke(0);
    strokeWeight(1 + this.l / 4);
    fill(255);
    ellipse(this.x, this.y - 32, 64, 64);

    imageMode(CENTER);
    if (this.t == 0) {
      image(enem['waterbottle']['image'], this.x, this.y - 32, 20, 50);
    } else if (this.t == 1) {
      image(enem['backpack']['image'], this.x, this.y - 32, 40, 40);
    } else if (this.t == 2) {
      image(enem['lock']['image'], this.x, this.y - 32, 40, 40);
    }
    

    strokeWeight(1);
    stroke(0);
    fill(100);
    rect(this.x - 50, this.y - 100, 100, 10);

    fill(255 * (1 - this.hLerp), 255 * this.hLerp, 0);
    rect(this.x - 50, this.y - 100, 100 * this.hLerp, 10);

    textSize(10);
    fill(0);
    noStroke();

    textAlign(LEFT, TOP);
    text(this.health + " / " + this.maxHealth, this.x - 48, this.y - 99.5);
    
    text("Lv. " + this.l, this.x - 48, this.y - 110);
  }

  die() {
    if (!this.nomoney) {
      money += floor(((50 + randomBias(0, 100, getValue('luck'), 1)) * multiplier) * pow(2, this.l) * getValue("money") * (this.t == 1 ? 0.8 : (this.t == 2 ? 1.5 : 1)));
      multiplier += 0.1 + randomBias(0, 0.2, getValue('luck') / 2, 1) * log(multiplier);
      addParticles(10, 10, this.x, this.y, -8, 8, -8, 8);

      comboAnim += 1;
    }
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
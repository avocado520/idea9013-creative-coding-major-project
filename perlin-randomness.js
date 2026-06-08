// perlin-randomness.js
// This file contains all randomness and Perlin noise helpers.
// It controls natural variation for tree branches, flowers, petals, and falling leaves.

// ------------------------------
// Tree branch randomness
// ------------------------------

function getRandomBranchAngles(depth) {
  let leftAngle;
  let rightAngle;

  if (depth < 2) {
    leftAngle = -0.20 + random(-0.08, 0.06);
    rightAngle = 0.18 + random(-0.06, 0.08);
  } else if (depth < 5) {
    leftAngle = -0.34 + random(-0.12, 0.10);
    rightAngle = 0.30 + random(-0.10, 0.12);
  } else {
    leftAngle = -0.48 + random(-0.16, 0.14);
    rightAngle = 0.42 + random(-0.14, 0.16);
  }

  return {
    leftAngle: leftAngle,
    rightAngle: rightAngle
  };
}

function getRandomLeftBranchLength() {
  return random(0.6, 0.8);
}

function getRandomRightBranchLength() {
  return random(0.7, 0.9);
}

// ------------------------------
// Flower randomness
// ------------------------------

function getRandomFlowerData() {
  return {
    flowerSize: random(0.85, 1.05),
    flowerAngle: random(TWO_PI),
    flowerOffsetX: random(-10, 10),
    flowerOffsetY: random(-8, 8),
    petalTimer: int(random(30, 120))
  };
}

function getRandomFallingFlowerSize() {
  return random(0.8, 1.2);
}

// ------------------------------
// Falling petal randomness
// ------------------------------

function getRandomPetalData() {
  return {
    size: random(6, 14),
    speedY: random(0.6, 1.8),
    speedX: random(-0.5, 0.5),
    angle: random(TWO_PI),
    rotateSpeed: random(-0.04, 0.04),
    noiseOffset: random(1000),
    type: int(random(4)),
    r: random(245, 255),
    g: random(150, 190),
    b: random(180, 220),
    alpha: random(170, 230)
  };
}

function resetPetalRandomData(petal) {
  let data = getRandomPetalData();

  petal.size = data.size;
  petal.speedY = data.speedY;
  petal.speedX = data.speedX;
  petal.angle = data.angle;
  petal.rotateSpeed = data.rotateSpeed;
  petal.noiseOffset = data.noiseOffset;
  petal.type = data.type;
  petal.r = data.r;
  petal.g = data.g;
  petal.b = data.b;
  petal.alpha = data.alpha;
}

// ------------------------------
// Falling leaf randomness
// ------------------------------

function getRandomLeafData() {
  return {
    rotateSpeed: random(-0.03, 0.03),
    speedY: random(0.7, 1.5),
    speedX: random(-0.4, 0.4),
    noiseOffset: random(1000)
  };
}


// ------------------------------
// Perlin noise movement
// ------------------------------

function getSoftNoiseDrift(noiseOffset) {
  return map(noise(noiseOffset), 0, 1, -1, 1);
}

function getSmallNoiseDrift(noiseOffset) {
  return map(noise(noiseOffset), 0, 1, -0.7, 0.7);
}

function updateFastNoiseOffset(noiseOffset) {
  return noiseOffset + 0.01;
}

function updateSlowNoiseOffset(noiseOffset) {
  return noiseOffset + 0.005;
}

// ------------------------------
// General random positions
// ------------------------------

function getRandomCanvasX() {
  return random(width);
}

function getRandomStartY() {
  return random(-100, 0);
}
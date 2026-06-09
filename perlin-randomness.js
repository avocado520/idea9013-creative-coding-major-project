// perlin-randomness.js
// This file stores all helper functions related to randomness and Perlin noise.
// It separates procedural variation from the drawing code, making the tree system easier to read and adjust.
// These functions are used to create natural variation in branches, flowers, petals, and falling leaves.

// ------------------------------
// Tree branch randomness
// ------------------------------

// This function returns different left and right branch angles based on branch depth.
// Depth controls how far the branch is from the trunk:
// - shallow branches form the main structure,
// - deeper branches form smaller canopy details.
function getRandomBranchAngles(depth) {
  let leftAngle;
  let rightAngle;

  // Main branches: small angle variation keeps the trunk and large branches stable.
  if (depth < 2) {
    leftAngle = -0.20 + random(-0.08, 0.06);
    rightAngle = 0.18 + random(-0.06, 0.08);

  // Middle branches: wider angles help the tree spread outward.
  } else if (depth < 5) {
    leftAngle = -0.34 + random(-0.12, 0.10);
    rightAngle = 0.30 + random(-0.10, 0.12);

  // Small outer branches: largest variation creates a more detailed and organic canopy.
  } else {
    leftAngle = -0.48 + random(-0.16, 0.14);
    rightAngle = 0.42 + random(-0.14, 0.16);
  }

  // Return both angles as an object so tree.js can apply them to child branches.
  return {
    leftAngle: leftAngle,
    rightAngle: rightAngle
  };
}

// Random length ratio for the left child branch.
// This prevents repeated branches from having identical proportions.
function getRandomLeftBranchLength() {
  return random(0.6, 0.8);
}

// Random length ratio for the right child branch.
// The range is slightly different from the left branch to avoid perfect symmetry.
function getRandomRightBranchLength() {
  return random(0.7, 0.9);
}

// ------------------------------
// Flower randomness
// ------------------------------

// This function creates random visual and timing data for each flower.
// It helps flowers appear naturally around branch tips instead of looking copied and pasted.
function getRandomFlowerData() {
  return {
    // Slight size variation makes each flower look individual.
    flowerSize: random(0.85, 1.05),

    // Random rotation prevents all flowers from facing the same direction.
    flowerAngle: random(TWO_PI),

    // Position offsets place flowers near the branch tip, but not on the exact same point.
    flowerOffsetX: random(-10, 10),
    flowerOffsetY: random(-8, 8),

    // Random timer staggers petal behaviour so flowers do not all react at once.
    petalTimer: int(random(30, 120))
  };
}

// Random scale for flowers after they become falling elements.
// This keeps fallen flowers from appearing identical.
function getRandomFallingFlowerSize() {
  return random(0.8, 1.2);
}

// ------------------------------
// Falling petal randomness
// ------------------------------

// This function gives each petal its own movement and visual properties.
// These values create variation in falling speed, drifting, rotation, colour, and transparency.
function getRandomPetalData() {
  return {
    // Different petal sizes create depth and visual variety.
    size: random(6, 14),

    // Vertical falling speed: some petals fall slowly, others fall faster.
    speedY: random(0.6, 1.8),

    // Basic horizontal movement before Perlin noise drift is added.
    speedX: random(-0.5, 0.5),

    // Starting rotation angle.
    angle: random(TWO_PI),

    // Rotation speed while falling; negative and positive values allow both directions.
    rotateSpeed: random(-0.04, 0.04),

    // Each petal receives a different noise offset so they do not drift in the same pattern.
    noiseOffset: random(1000),

    // Movement type allows petals to use several falling behaviours.
    type: int(random(4)),

    // Subtle colour variation within a pink petal palette.
    r: random(245, 255),
    g: random(150, 190),
    b: random(180, 220),

    // Transparency variation helps create a softer layered atmosphere.
    alpha: random(170, 230)
  };
}

// This function refreshes an existing petal with new random data.
// It is useful when reusing petal objects instead of creating completely new ones.
function resetPetalRandomData(petal) {
  let data = getRandomPetalData();

  // Copy the new random values onto the existing petal object.
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

// This function provides movement data for leaves after they start falling.
// It works similarly to petal data, but uses slightly different speed ranges.
function getRandomLeafData() {
  return {
    // Leaves rotate gently while falling.
    rotateSpeed: random(-0.03, 0.03),

    // Vertical falling speed for leaf movement.
    speedY: random(0.7, 1.5),

    // Horizontal movement before noise drift is applied.
    speedX: random(-0.4, 0.4),

    // Unique Perlin noise starting point for each leaf.
    noiseOffset: random(1000)
  };
}

// This function creates a group of leaves attached to a branch tip.
// Each leaf receives its own position, angle, size, and falling probability.
function getRandomAttachedLeaves() {
  let leaves = [];

  // Random leaf count changes canopy density across different branches.
  let leafCount = int(random(8, 14));

  for (let i = 0; i < leafCount; i++) {
    leaves.push({
      // Random offsets spread leaves around the branch tip instead of stacking them together.
      offsetX: random(-11, 11),
      offsetY: random(-10, 10),

      // Random angle gives each leaf a different direction.
      angle: random(-0.8, 0.8),

      // Random scale avoids repeated identical leaf shapes.
      size: random(0.75, 1.15),

      // 45% chance for this leaf to fall during the seasonal transition.
      // This makes the autumn effect uneven and more natural.
      shouldFall: random(1) < 0.45,

      // Tracks whether the leaf has already fallen, preventing repeated falling triggers.
      hasFallen: false
    });
  }

  return leaves;
}


// ------------------------------
// Perlin noise movement
// ------------------------------

// This function converts Perlin noise into a smooth horizontal drift value.
// The output range is from -1 to 1, suitable for soft wind-like movement.
function getSoftNoiseDrift(noiseOffset) {
  return map(noise(noiseOffset), 0, 1, -1, 1);
}

// This function creates a smaller drift range for subtler movement.
// It is useful when the motion should feel gentler or less dramatic.
function getSmallNoiseDrift(noiseOffset) {
  return map(noise(noiseOffset), 0, 1, -0.7, 0.7);
}

// Updates the noise offset faster.
// A faster update makes the drift change more actively over time.
function updateFastNoiseOffset(noiseOffset) {
  return noiseOffset + 0.01;
}

// Updates the noise offset more slowly.
// A slower update creates calmer, smoother drifting motion.
function updateSlowNoiseOffset(noiseOffset) {
  return noiseOffset + 0.005;
}

// ------------------------------
// General random positions
// ------------------------------

// Returns a random x-position across the full canvas width.
// This allows falling elements to appear from different horizontal locations.
function getRandomCanvasX() {
  return random(width);
}

// Returns a random starting y-position above the visible canvas.
// This makes petals or leaves enter naturally from above the screen.
function getRandomStartY() {
  return random(-100, 0);
}
/*
----------------------------------------------------
Changes:
- Reduced excessive randomness in branch generation
- Introduced depth-based branching structure
- Increased tree height while keeping the root position fixed
- Created a more layered and natural canopy
- Balanced crown density for future interaction design
----------------------------------------------------
*/

// tree.js
// This file contains the tree generation logic and the Branch class.
// It does not contain setup(), draw(), keyPressed(), or windowResized().
// Those p5.js lifecycle functions are kept in sketch.js.

// Tree boundary values are used when generating a new tree.
// They help measure the generated tree size so it can be scaled into the canvas.
// tree.js

let minX, maxX, minY, maxY;

let leafImage;

let minLengthRatio = 0.72;
let maxLengthRatio = 0.78;
let stopLength = 32;

// Store terminal branches for later blooming.
let flowerBranches = [];

let fallingPetals = [];
let fallingLeaves = [];

let leafFallStarted = false;

function createNewTree() {
  minX = width / 2;
  maxX = width / 2;
  minY = height;
  maxY = height;

  flowerBranches = [];
  fallingPetals = [];
  fallingLeaves = [];
  leafFallStarted = false;

  let groundY = height - 50;

  tree = new Branch(null, width / 2, groundY, PI, height * 0.20);

  let xSize = maxX - minX;
  let ySize = maxY - minY;

  let scaleValue = 1;

  let maxTreeWidth = width * 0.78;
  let maxTreeHeight = height * 0.98;

  if (xSize > maxTreeWidth) {
    scaleValue = maxTreeWidth / xSize;
  }

  if (ySize > maxTreeHeight) {
    let heightScale = maxTreeHeight / ySize;

    if (heightScale < scaleValue) {
      scaleValue = heightScale;
    }
  }

  tree.setScale(scaleValue);

  tree.x = width / 2;
  tree.y = groundY;
}

function createLeafImage() {
  let buffer = createGraphics(12, 18);

  buffer.clear();

  buffer.stroke(93, 104, 0);
  buffer.line(6, 0, 6, 6);

  buffer.noStroke();

  buffer.fill(116, 150, 0);
  buffer.beginShape();
  buffer.vertex(6, 6);
  buffer.bezierVertex(0, 12, 0, 12, 6, 18);
  buffer.bezierVertex(12, 12, 12, 12, 6, 6);
  buffer.endShape();

  buffer.fill(139, 184, 0);
  buffer.beginShape();
  buffer.vertex(6, 9);
  buffer.bezierVertex(0, 13, 0, 13, 6, 18);
  buffer.bezierVertex(12, 13, 12, 13, 6, 9);
  buffer.endShape();

  buffer.stroke(101, 144, 0);
  buffer.noFill();
  buffer.bezier(6, 9, 5, 11, 5, 12, 6, 15);

  return buffer;
}

function addFlowerOnRandomBranch() {
  let availableBranches = flowerBranches.filter(branch => {
    return !branch.hasFlower && branch.growth > 0.55;
  });

  if (availableBranches.length === 0) {
    return false;
  }

  let selectedBranch = random(availableBranches);
  selectedBranch.hasFlower = true;
  selectedBranch.flowerGrowth = 0;

  return true;
}

function bloomFromMouseHover(px, py) {
  if (isMouseHoveringTree(px, py)) {
    addFlowerOnRandomBranch();

    if (timeMechanic) {
      timeMechanic.recordUserHover();
    }

    return true;
  }

  return false;
}

function isMouseHoveringTree(px, py) {
  if (!tree) return false;
  return tree.isPointNearBranch(px, py);
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return dist(px, py, x1, y1);
  }

  let t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
  t = constrain(t, 0, 1);

  let closestX = x1 + t * dx;
  let closestY = y1 + t * dy;

  return dist(px, py, closestX, closestY);
}

class Branch {
  constructor(parent, x, y, angleOffset, length) {
    this.parent = parent;

    this.x = x;
    this.y = y;

    this.angle = 0;
    this.angleOffset = angleOffset;

    this.length = length;

    this.growth = 0;
    this.windForce = 0;
    this.blastForce = 0;

    this.branchA = null;
    this.branchB = null;

    this.hasFlower = false;

    let flowerData = getRandomFlowerData();

    this.flowerSize = flowerData.flowerSize;
    this.flowerAngle = flowerData.flowerAngle;
    this.flowerOffsetX = flowerData.flowerOffsetX;
    this.flowerOffsetY = flowerData.flowerOffsetY;
  
    this.flowerGrowth = 0;

    this.petalTimer = flowerData.petalTimer;

    this.leafHasFallen = false;
    
    this.leaves = [];
    this.leafFallCreated = false;

    let leafCount = int(random(8, 16));

    for (let i = 0; i < leafCount; i++) {
      this.leaves.push({
        offsetX: random(-12, 12),
        offsetY: random(-10, 8),

        angle: random(-0.8, 0.8),

        size: random(0.75, 1.15),

        shouldFall: random(1) < 0.45,

        hasFallen: false
      });
    }

    if (this.parent === null) {
      this.depth = 0;
    } else {
      this.depth = this.parent.depth + 1;
    }

    if (this.parent !== null) {
      this.angle = this.parent.angle + angleOffset;
      this.angleOffset = angleOffset;
    } else {
      this.angle = angleOffset;
      this.angleOffset = 0;
    }

    let xB = this.x + sin(this.angle) * this.length;
    let yB = this.y + cos(this.angle) * this.length;

    if (this.length > stopLength) {
      let leftAngle;
      let rightAngle;

      // Use different angle ranges at different depths.
      // This creates a more layered, uneven canopy instead of a perfectly symmetrical tree.
      let branchAngles = getRandomBranchAngles(this.depth);

      leftAngle = branchAngles.leftAngle;
      rightAngle = branchAngles.rightAngle;

      this.branchA = new Branch(
        this,
        xB,
        yB,
        leftAngle,
        this.length * getRandomLeftBranchLength()
      );

      this.branchB = new Branch(
        this,
        xB,
        yB,
        rightAngle,
        this.length * getRandomRightBranchLength()
      );
    } else {
      flowerBranches.push(this);
    }

    minX = min(xB, minX);
    maxX = max(xB, maxX);
    minY = min(yB, minY);
    maxY = max(yB, maxY);
  }

  setScale(scaleValue) {
    this.length *= scaleValue;

    if (this.branchA !== null) {
      this.branchA.setScale(scaleValue);

      if (this.branchB !== null) {
        this.branchB.setScale(scaleValue);
      }
    }
  }

  update(growthStep = 0.03) {
    if (this.parent !== null) {
      this.x =
        this.parent.x +
        sin(this.parent.angle) * this.parent.length * this.parent.growth;

      this.y =
        this.parent.y +
        cos(this.parent.angle) * this.parent.length * this.parent.growth;

      this.windForce =
        this.parent.windForce * (1.0 + 5.0 / this.length) + this.blastForce;

      this.blastForce =
        (this.blastForce + sin(this.x / 2 + windAngle) * 0.005 / this.length) *
        0.98;

      this.angle =
        this.parent.angle + this.angleOffset + this.windForce + this.blastForce;

      this.growth = min(this.growth + growthStep * this.parent.growth, 1);
    } else {
      this.growth = min(this.growth + growthStep, 1);
    }

    // Grow the flower after the branch has partially appeared.
    // The flower will not start blooming until the branch is at least 30% grown.
    if (this.hasFlower && this.growth > 0.3) {
      // Gradually increase flower size over time.
      // The growth speed is slightly faster than branch growth
      // to create a more noticeable blooming effect.
      this.flowerGrowth = min(
        this.flowerGrowth + growthStep * 4,
        1
      );
    }

    if (this.branchA !== null) {
      this.branchA.update(growthStep);

      if (this.branchB !== null) {
        this.branchB.update(growthStep);
      }
    }
  }

  render() {
    if (this.growth <= 0) return;

    let currentEndX = this.x + sin(this.angle) * this.length * this.growth;
    let currentEndY = this.y + cos(this.angle) * this.length * this.growth;

    let xB = this.x;
    let yB = this.y;

    if (this.parent !== null) {
      xB += (this.x - this.parent.x) * 0.4;
      yB += (this.y - this.parent.y) * 0.4;
    } else {
      xB += sin(this.angle + this.angleOffset) * this.length * 0.3 * this.growth;
      yB += cos(this.angle + this.angleOffset) * this.length * 0.3 * this.growth;
    }

    let branchColor = floor(1100 / this.length);

    stroke(branchColor);
    strokeWeight(this.length / 5);
    strokeCap(ROUND);
    noFill();

    bezier(this.x, this.y, xB, yB, xB, yB, currentEndX, currentEndY);

    if (this.branchA !== null) {
      this.branchA.render();

      if (this.branchB !== null) {
        this.branchB.render();
      }
    } else {
      if (this.growth > 0.3) {
        let leafProgress = map(this.growth, 0.3, 1, 0, 1);
        leafProgress = constrain(leafProgress, 0, 1);

        // Draw the leaf while it is still attached to the branch.
        // Once leafFallStarted becomes true,
        // this leaf will be converted into a FallingLeaf object.
      for (let i = 0; i < this.leaves.length; i++) {
        let leaf = this.leaves[i];

        if (!leaf.hasFallen) {
          push();

          translate(
            currentEndX + leaf.offsetX * leafProgress,
            currentEndY + leaf.offsetY * leafProgress
          );

          rotate(-this.angle + leaf.angle);

          scale(leafProgress * leaf.size);

          image(
            leafImage,
            -leafImage.width / 2,
            0
          );

          pop();
        }
      }

      // After the space key is pressed,
      // create one FallingLeaf for each terminal branch.
      if (
        leafFallStarted &&
        !this.leafFallCreated &&
        this.growth >= 1
      ) {
        for (let i = 0; i < this.leaves.length; i++) {
          let leaf = this.leaves[i];

          if (leaf.shouldFall) {
            fallingLeaves.push(
              new FallingLeaf(
                currentEndX + leaf.offsetX,
                currentEndY + leaf.offsetY,
                this.angle + leaf.angle,
                leaf.size
              )
            );

            leaf.hasFallen = true;
          }
        }

        this.leafFallCreated = true;
      }



      if (this.hasFlower) {
        push();

        translate(
          currentEndX + this.flowerOffsetX,
          currentEndY + this.flowerOffsetY
        );

        scale(this.flowerGrowth);

        drawFlower(
          0,
          0,
          this.flowerSize,
          this.flowerAngle
        );

        pop();
      }
    }
  }
}

  isPointNearBranch(px, py) {
    if (this.growth <= 0) return false;

    let endX = this.x + sin(this.angle) * this.length * this.growth;
    let endY = this.y + cos(this.angle) * this.length * this.growth;

    if (this.length > 25) {
      let hitDistance = max(10, this.length / 8);

      if (distanceToSegment(px, py, this.x, this.y, endX, endY) < hitDistance) {
        return true;
      }
    }

    if (this.branchA !== null && this.branchA.isPointNearBranch(px, py)) {
      return true;
    }

    if (this.branchB !== null && this.branchB.isPointNearBranch(px, py)) {
      return true;
    }

    return false;
  }
}

class FallingPetal {
  constructor(x, y) {

    this.x = x;
    this.y = y;

    let petalData = getRandomPetalData();

    this.size = petalData.size;

    this.speedY = petalData.speedY;
    this.speedX = petalData.speedX;

    this.angle = petalData.angle;
    this.rotateSpeed = petalData.rotateSpeed;

    this.noiseOffset = petalData.noiseOffset;

    this.type = petalData.type;

    this.r = petalData.r;
    this.g = petalData.g;
    this.b = petalData.b;
    this.alpha = petalData.alpha;
  }

  update() {
    // If petal already on the ground, follow the nearest audio rectangle y (if available)
    if (this.onGround) {
      if (typeof audioRects !== 'undefined' && audioRects.length > 0) {
        // find nearest audio rect by center-x distance
        let nearest = audioRects[0];
        let minDist = abs(this.x - nearest.cx);

        for (let i = 1; i < audioRects.length; i++) {
          let d = abs(this.x - audioRects[i].cx);

          if (d < minDist) {
            minDist = d;
            nearest = audioRects[i];
          }
        }

        // Smoothly move toward the rectangle's y (match top of rect)
        this.y = lerp(this.y, nearest.y, 0.18);
        this.angle += this.rotateSpeed * 0.3;
      }

      return;
    }

    // Falling motion while not on ground
    if (this.type === 0) {
      this.x += sin(frameCount * 0.03 + this.noiseOffset) * 0.8;
      this.y += this.speedY;
      this.angle += this.rotateSpeed;
    }

    if (this.type === 1) {
      this.x += getSoftNoiseDrift(this.noiseOffset);
      this.y += this.speedY * 0.9;
      this.angle += this.rotateSpeed * 2;
      this.noiseOffset = updateFastNoiseOffset(this.noiseOffset);
    }

    if (this.type === 2) {
      this.x += this.speedX + 0.8;
      this.y += this.speedY * 1.4;
      this.angle += this.rotateSpeed;
    }

    if (this.type === 3) {
      this.x += getSmallNoiseDrift(this.noiseOffset);
      this.y += this.speedY * 0.6;
      this.angle += this.rotateSpeed * 0.5;
      this.noiseOffset = updateSlowNoiseOffset(this.noiseOffset);
    }

    // Stop the petal when it reaches the ground.
    if (this.y > height - 35) {
      this.y = height - 35;
      this.onGround = true;
    }
  }

  render() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    noStroke();
    fill(this.r, this.g, this.b, this.alpha);

    beginShape();
    vertex(0, -this.size);
    bezierVertex(
      this.size * 0.8,
      -this.size * 0.5,
      this.size * 0.7,
      this.size * 0.7,
      0,
      this.size
    );
    bezierVertex(
      -this.size * 0.7,
      this.size * 0.7,
      -this.size * 0.8,
      -this.size * 0.5,
      0,
      -this.size
    );
    endShape(CLOSE);

    pop();
  }
}

class FallingLeaf {
  constructor(x, y, angle, sizeValue) {
    this.x = x;
    this.y = y;

    this.angle = angle;
    let leafData = getRandomLeafData();

    this.rotateSpeed = leafData.rotateSpeed;

    this.size = sizeValue;

    this.speedY = leafData.speedY;
    this.speedX = leafData.speedX;

    this.noiseOffset = leafData.noiseOffset;

    this.yellowAmount = 0;
    this.isFalling = false;
    this.onGround = false;
  }

  update() {
    // If leaf already on the ground, follow the nearest audio rectangle y (if available)
    if (this.onGround) {
      if (typeof audioOutlineRects !== 'undefined' && audioOutlineRects.length > 0) {
        // find nearest audio rect by center-x distance
        let nearest = audioOutlineRects[0];
        let minDist = abs(this.x - nearest.cx);
        for (let i = 1; i < audioOutlineRects.length; i++) {
          let d = abs(this.x - audioOutlineRects[i].cx);
          if (d < minDist) {
            minDist = d;
            nearest = audioOutlineRects[i];
          }
        }

        // Smoothly move toward the rectangle's y (match top of rect)
        this.y = lerp(this.y, nearest.y, 0.18);
        this.angle += this.rotateSpeed * 0.3;
      }

      return;
    }

    if (!this.isFalling) {
      this.yellowAmount += 0.015;

      if (this.yellowAmount >= 1) {
        this.yellowAmount = 1;
        this.isFalling = true;
      }
    } else {
      this.x += getSoftNoiseDrift(this.noiseOffset) + this.speedX;
      this.y += this.speedY;
      this.angle += this.rotateSpeed;
      this.noiseOffset = updateFastNoiseOffset(this.noiseOffset);

      if (this.y > height - 35) {
        this.y = height - 35;
        this.onGround = true;
      }
    }
  }

  render() {
    let r = lerp(116, 190, this.yellowAmount);
    let g = lerp(150, 125, this.yellowAmount);
    let b = lerp(0, 20, this.yellowAmount);

    push();
    translate(this.x, this.y);
    rotate(-this.angle);
    scale(this.size);

    noStroke();

    fill(r, g, b);
    beginShape();
    vertex(6, 6);
    bezierVertex(0, 12, 0, 12, 6, 18);
    bezierVertex(12, 12, 12, 12, 6, 6);
    endShape();

    fill(r + 20, g + 20, b);
    beginShape();
    vertex(6, 9);
    bezierVertex(0, 13, 0, 13, 6, 18);
    bezierVertex(12, 13, 12, 13, 6, 9);
    endShape();

    pop();
  }
}
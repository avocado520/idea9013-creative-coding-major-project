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
let maxLengthRatio = 0.86;
let stopLength = 10;

// Store terminal branches for later blooming.
let flowerBranches = [];

function createNewTree() {
  minX = width / 2;
  maxX = width / 2;
  minY = height;
  maxY = height;

  flowerBranches = [];

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
    this.flowerSize = random(0.85, 1.05);
    this.flowerAngle = random(TWO_PI);
    this.flowerOffsetX = random(-10, 10);
    this.flowerOffsetY = random(-8, 8);
    this.flowerGrowth = 0;

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

      if (this.depth < 2) {
        leftAngle = -0.16 + random(-0.05, 0.05);
        rightAngle = 0.16 + random(-0.05, 0.05);
      } else if (this.depth < 5) {
        leftAngle = -0.28 + random(-0.08, 0.08);
        rightAngle = 0.25 + random(-0.08, 0.08);
      } else {
        leftAngle = -0.38 + random(-0.10, 0.10);
        rightAngle = 0.32 + random(-0.10, 0.10);
      }

      this.branchA = new Branch(
        this,
        xB,
        yB,
        leftAngle,
        this.length * random(minLengthRatio, maxLengthRatio)
      );

      this.branchB = new Branch(
        this,
        xB,
        yB,
        rightAngle,
        this.length * random(minLengthRatio, maxLengthRatio)
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

    if (this.hasFlower && this.growth > 0.3) {
      this.flowerGrowth = min(this.flowerGrowth + growthStep * 1.2, 1);
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

        push();
        translate(currentEndX, currentEndY);
        rotate(-this.angle);
        scale(leafProgress);
        image(leafImage, -leafImage.width / 2, 0);
        pop();

        if (this.hasFlower) {
          push();

          translate(
            currentEndX + this.flowerOffsetX,
            currentEndY + this.flowerOffsetY
          );

          scale(this.flowerGrowth);
          drawFlower(0, 0, this.flowerSize, this.flowerAngle);

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
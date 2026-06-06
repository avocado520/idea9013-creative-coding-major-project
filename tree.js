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
// Those p5 lifecycle functions are kept in sketch.js.

let minX, maxX, minY, maxY;

let leafImage;

// ===== TREE STRUCTURE PARAMETERS =====
// These values control branch density and shape variation.
// The goal is to keep the tree crown large and stable
// while still allowing subtle natural differences.
let minLengthRatio = 0.72;
let maxLengthRatio = 0.86;
let stopLength = 8;

function createNewTree() {
  // Reset tree boundary values before generating a new structure.
  minX = width / 2;
  maxX = width / 2;
  minY = height;
  maxY = height;

  // Keep the tree root fixed on the ground.
  let groundY = height - 50;

  // Generate a taller tree while keeping the root position fixed.
  // This helps place the tree crown closer to the upper part of the canvas.
  tree = new Branch(null, width / 2, groundY, PI, height * 0.20);

  let xSize = maxX - minX;
  let ySize = maxY - minY;

  let scaleValue = 1;

  // Limit the final tree size inside the canvas.
  // Width is slightly restricted to avoid a flat umbrella-like canopy.
  // Height is allowed to grow more so the tree crown sits higher.
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

  // Re-center the tree after scaling.
  tree.x = width / 2;
  tree.y = groundY;
}

function createLeafImage() {
  // Create a reusable leaf image.
  // Using a graphics buffer improves performance compared with drawing each leaf manually.
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

    // Track branch depth.
    // Different depth levels use different branching angles
    // to create a more natural tree silhouette.
    if (this.parent === null) {
      this.depth = 0;
    } else {
      this.depth = this.parent.depth + 1;
    }

    if (this.parent !== null) {
      this.angle = this.parent.angle + angleOffset;
      this.angleOffset = angleOffset;
    } else {
      // Keep the main trunk stable.
      this.angle = angleOffset;
      this.angleOffset = 0;
    }

    let xB = this.x + sin(this.angle) * this.length;
    let yB = this.y + cos(this.angle) * this.length;

    // Generate child branches recursively.
    // Branch angles change based on depth level:
    //
    // Early branches grow mostly upward.
    // Middle branches expand outward to form the main crown.
    // Terminal branches add irregularity and visual complexity.
    //
    // This creates a layered canopy rather than a flat umbrella shape.
    if (this.length > stopLength) {
      let leftAngle;
      let rightAngle;

      if (this.depth < 2) {
        // Primary structure:
        // Grow upward first to increase overall tree height.
        leftAngle = -0.16 + random(-0.05, 0.05);
        rightAngle = 0.16 + random(-0.05, 0.05);
      } else if (this.depth < 5) {
        // Secondary structure:
        // Expand the crown horizontally while maintaining balance.
        leftAngle = -0.28 + random(-0.08, 0.08);
        rightAngle = 0.25 + random(-0.08, 0.08);
      } else {
        // Fine branching:
        // Add subtle randomness to create a more organic canopy edge.
        leftAngle = -0.38 + random(-0.10, 0.10);
        rightAngle = 0.32 + random(-0.10, 0.10);
      }

      this.branchA = new Branch(
        this,
        xB,
        yB,
        leftAngle,
        // Apply controlled randomness to branch length.
        // This prevents repetitive patterns while preserving the overall tree size.
        this.length * random(minLengthRatio, maxLengthRatio)
      );

      this.branchB = new Branch(
        this,
        xB,
        yB,
        rightAngle,
        // Apply controlled randomness to branch length.
        // This keeps the crown natural without causing extreme variation.
        this.length * random(minLengthRatio, maxLengthRatio)
      );
    }

    // Store the generated tree boundaries for later scaling.
    minX = min(xB, minX);
    maxX = max(xB, maxX);
    minY = min(yB, minY);
    maxY = max(yB, maxY);
  }

  setScale(scaleValue) {
    // Scale all branches recursively.
    this.length *= scaleValue;

    if (this.branchA !== null) {
      this.branchA.setScale(scaleValue);

      if (this.branchB !== null) {
        this.branchB.setScale(scaleValue);
      }
    }
  }

  update() {
    if (this.parent !== null) {
      // Update branch position based on parent growth.
      this.x =
        this.parent.x +
        sin(this.parent.angle) * this.parent.length * this.parent.growth;

      this.y =
        this.parent.y +
        cos(this.parent.angle) * this.parent.length * this.parent.growth;

      // Simulate gentle wind movement.
      // Smaller branches receive stronger movement than larger branches.
      this.windForce =
        this.parent.windForce * (1.0 + 5.0 / this.length) + this.blastForce;

      this.blastForce =
        (this.blastForce + sin(this.x / 2 + windAngle) * 0.005 / this.length) *
        0.98;

      this.angle =
        this.parent.angle + this.angleOffset + this.windForce + this.blastForce;

      this.growth = min(this.growth + 0.1 * this.parent.growth, 1);
    } else {
      // Grow the root branch first.
      this.growth = min(this.growth + 0.1, 1);
    }

    if (this.branchA !== null) {
      this.branchA.update();

      if (this.branchB !== null) {
        this.branchB.update();
      }
    }
  }

  render() {
    if (this.branchA !== null) {
      let xB = this.x;
      let yB = this.y;

      // Create a curved branch shape using Bezier control points.
      if (this.parent !== null) {
        xB += (this.x - this.parent.x) * 0.4;
        yB += (this.y - this.parent.y) * 0.4;
      } else {
        xB += sin(this.angle + this.angleOffset) * this.length * 0.3;
        yB += cos(this.angle + this.angleOffset) * this.length * 0.3;
      }

      // Shorter branches appear lighter, creating visual depth.
      let branchColor = floor(1100 / this.length);

      stroke(branchColor);
      strokeWeight(this.length / 5);
      strokeCap(ROUND);
      noFill();

      bezier(
        this.x,
        this.y,
        xB,
        yB,
        xB,
        yB,
        this.branchA.x,
        this.branchA.y
      );

      this.branchA.render();

      if (this.branchB !== null) {
        this.branchB.render();
      }
    } else {
      // Terminal branches display leaf sprites.
      push();
      translate(this.x, this.y);
      rotate(-this.angle);
      image(leafImage, -leafImage.width / 2, 0);
      pop();
    }
  }
}
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
let minX, maxX, minY, maxY;

let leafImage;

// ===== TREE STRUCTURE PARAMETERS =====
// These values control branch density and shape variation.
// The goal is to keep the tree crown large and stable
// while still allowing subtle natural differences.
let minLengthRatio = 0.72;
let maxLengthRatio = 0.78;
let stopLength = 32;

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
  tree = new Branch(null, width / 2, groundY, PI, height * 0.24);

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

    // FLOWER DISABLED:
    // These flower variables are kept here as comments only.
    // The tree will now start with branches and leaves only.
    // If flower blooming is needed later, these can be restored.
    /*
    this.hasFlower = false;
    this.flowerSize = random(0.85, 1.05);
    this.flowerAngle = random(TWO_PI);
    this.flowerOffsetX = random(-10, 10);
    this.flowerOffsetY = random(-8, 8);
    this.flowerGrowth = 0;
    */

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
        leftAngle = -0.25 + random(-0.05, 0.05);
        rightAngle = 0.25 + random(-0.05, 0.05);
      } else if (this.depth < 5) {
        // Secondary structure:
        // Expand the crown horizontally while maintaining balance.
        leftAngle = -0.45 + random(-0.08, 0.08);
        rightAngle = 0.45 + random(-0.08, 0.08);
      } else {
        // Fine branching:
        // Add subtle randomness to create a more organic canopy edge.
        leftAngle = -0.6 + random(-0.10, 0.10);
        rightAngle = 0.55 + random(-0.10, 0.10);
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

  update(growthStep = 0.03) {
    if (this.parent !== null) {
      // Keep this branch attached to the currently visible end of its parent.
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

      // Use time-based growth instead of a fixed frame step.
      this.growth = min(this.growth + growthStep * this.parent.growth, 1);
    } else {
      // Grow the root branch first.
      this.growth = min(this.growth + growthStep, 1);
    }

    // FLOWER DISABLED:
    // Flower growth is currently turned off.
    // This prevents flowers from appearing at the start.
    /*
    if (this.branchA === null && this.growth > 0.2) {
      this.flowerGrowth = min(this.flowerGrowth + growthStep * 1.5, 1);
    }
    */

    if (this.branchA !== null) {
      this.branchA.update(growthStep);

      if (this.branchB !== null) {
        this.branchB.update(growthStep);
      }
    }
  }

  render() {
    if (this.growth <= 0) return;

    // Draw only the currently grown part of this branch.
    // This makes the branch visually extend over time instead of appearing fully at once.
    let currentEndX = this.x + sin(this.angle) * this.length * this.growth;
    let currentEndY = this.y + cos(this.angle) * this.length * this.growth;

    let xB = this.x;
    let yB = this.y;

    // Create a curved branch shape using Bezier control points.
    if (this.parent !== null) {
      xB += (this.x - this.parent.x) * 0.4;
      yB += (this.y - this.parent.y) * 0.4;
    } else {
      xB += sin(this.angle + this.angleOffset) * this.length * 0.3 * this.growth;
      yB += cos(this.angle + this.angleOffset) * this.length * 0.3 * this.growth;
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
      currentEndX,
      currentEndY
    );

    if (this.branchA !== null) {
      // Child branches are rendered recursively.
      this.branchA.render();

      if (this.branchB !== null) {
        this.branchB.render();
      }
    } else {
      // Leaves start appearing once the terminal branch is visible enough.
      if (this.growth > 0.3) {
        let leafProgress = map(this.growth, 0.3, 1, 0, 1);
        leafProgress = constrain(leafProgress, 0, 1);

        push();
        translate(currentEndX, currentEndY);
        rotate(-this.angle);

        // Grow the leaf in gradually.
        scale(leafProgress);
        image(leafImage, -leafImage.width / 2, 0);

        pop();

        // FLOWER DISABLED:
        // Flower drawing is commented out so the tree begins with leaves only.
        // Restore this block later if you want flowers to bloom after the tree grows.
        /*
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
        */
      }
    }
  }
}

function keyPressed() {
  inputMechanic.handleKeyPressed(key);
}
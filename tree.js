// This file defines the shared tree system for the project.
// It focuses only on the tree structure, branch growth, and leaf growth.
// Time, input, audio, and randomness mechanics should be handled in separate files.

class Tree {
  constructor(x, y) {
    // The root position of the tree.
    // In sketch.js, this is placed near the bottom centre of the canvas.
    this.x = x;
    this.y = y;

    // Store all branches in one array so other mechanics can access them later.
    this.branches = [];

    // Flowers and petals are part of the full tree system,
    // but their detailed behaviour should be defined in flower.js and petal.js later.
    this.flowers = [];
    this.petals = [];

    // Controls how fast the tree grows.
    // This can later be changed by timeMechanic.js.
    this.growthSpeed = 0.012;

    // Shared wind value.
    // randomMechanic.js can later update this to create natural branch movement.
    this.windForce = 0;

    // This becomes true when every branch has finished growing.
    // Other mechanics can use this to decide when flowers should appear.
    this.isFullyGrown = false;

    this.createTree();
  }

  createTree() {
    // The trunk length is based on the window height so the tree scales better.
    // min() prevents the trunk from becoming too large on very tall screens.
    let trunkLength = min(height * 0.32, 230);

    // -HALF_PI makes the trunk grow upwards in p5.js.
    let trunk = new Branch(null, this.x, this.y, -HALF_PI, trunkLength);

    this.branches.push(trunk);

    // Generate the recursive branch structure.
    // Depth controls how many branch levels the tree has.
    this.generateBranches(trunk, 4);
  }

  generateBranches(parentBranch, depth) {
    // Stop recursion when the target branch depth is reached.
    if (depth <= 0) return;

    // Longer parent branches produce slightly longer child branches.
    // This helps keep the tree shape balanced.
    let leftBranch = parentBranch.addChild(
      -random(0.35, 0.75),
      random(0.62, 0.8)
    );

    let rightBranch = parentBranch.addChild(
      random(0.35, 0.75),
      random(0.62, 0.8)
    );

    this.branches.push(leftBranch);
    this.branches.push(rightBranch);

    // Continue creating smaller branches from both child branches.
    this.generateBranches(leftBranch, depth - 1);
    this.generateBranches(rightBranch, depth - 1);
  }

  update() {
    // Only update the root branch directly.
    // The root branch then recursively updates all child branches.
    // This avoids updating the same child branch multiple times.
    for (let branch of this.branches) {
      if (branch.parent === null) {
        branch.update(this.growthSpeed, this.windForce);
      }
    }

    // Check whether every branch has completed its growth animation.
    this.isFullyGrown = this.branches.every(branch => branch.growth >= 1);

    // These loops are kept here because flowers and petals belong visually to the tree.
    // Their creation and special interactions will be controlled by separate mechanic files.
    for (let flower of this.flowers) {
      flower.update();
    }

    for (let petal of this.petals) {
      petal.update();
    }
  }

  display() {
    // Draw branches first so leaves, flowers, and petals can appear on top.
    for (let branch of this.branches) {
      if (branch.parent === null) {
        branch.display();
      }
    }

    for (let flower of this.flowers) {
      flower.display();
    }

    for (let petal of this.petals) {
      petal.display();
    }
  }

  addFlower(x, y) {
    // This method is an interface for other mechanics.
    // For example, inputMechanic.js can call this when the user hovers near a branch.
    this.flowers.push(new Flower(x, y));
  }

  addFlowerOnRandomBranch() {
    // This method can be used by timeMechanic.js to create flowers over time.
    let availableBranches = this.getAvailableBranches();

    if (availableBranches.length === 0) return;

    let branch = random(availableBranches);

    this.addFlower(branch.getCurrentEndX(), branch.getCurrentEndY());
  }

  breakFlowerIntoPetals(flower) {
    // Replace a complete flower with individual petals.
    // This keeps the flower stage and petal stage clearly separated.
    for (let i = 0; i < 8; i++) {
      this.petals.push(new Petal(flower.x, flower.y));
    }

    let index = this.flowers.indexOf(flower);

    if (index !== -1) {
      this.flowers.splice(index, 1);
    }
  }

  setGrowthSpeed(value) {
    // Gives timeMechanic.js a controlled way to adjust tree growth speed.
    this.growthSpeed = value;
  }

  setWindForce(value) {
    // Gives randomMechanic.js a controlled way to apply natural swaying.
    this.windForce = value;
  }

  getAvailableBranches() {
    // Return branches that are grown enough for interaction or flower placement.
    // This prevents flowers from appearing on invisible or unfinished branches.
    return this.branches.filter(branch => branch.growth > 0.85);
  }
}


class Branch {
  constructor(parent, x, y, angle, length) {
    // The parent branch connects this branch to the tree hierarchy.
    // The trunk has no parent, so its parent value is null.
    this.parent = parent;

    // Starting position of the branch.
    this.x = x;
    this.y = y;

    // Base direction and length of the branch.
    this.angle = angle;
    this.length = length;

    // Growth controls how much of the branch is currently visible.
    // 0 means not visible yet, 1 means fully grown.
    this.growth = 0;

    // Leaf growth is separate from branch growth.
    // This lets leaves appear only after the branch has finished growing.
    this.leafGrowth = 0;

    // Child branches are stored here so the tree can be updated and drawn recursively.
    this.children = [];

    // Each terminal branch gets slightly different leaf details.
    // This avoids every leaf looking exactly the same.
    this.leafSize = random(10, 18);
    this.leafAngleOffset = random(-0.8, 0.8);

    // Store the current animated angle.
    // This allows wind movement to affect the branch direction later.
    this.currentAngle = this.angle;

    // The full target end position of the branch.
    this.endX = this.x + cos(this.currentAngle) * this.length;
    this.endY = this.y + sin(this.currentAngle) * this.length;
  }

  addChild(angleOffset, lengthScale) {
    // A child branch starts from the full target end of its parent.
    // During animation, update() will attach it to the parent's current visible end.
    let child = new Branch(
      this,
      this.endX,
      this.endY,
      this.angle + angleOffset,
      this.length * lengthScale
    );

    this.children.push(child);
    return child;
  }

  update(growthSpeed, windForce) {
    // Child branches should not start growing until the parent branch has mostly appeared.
    // This creates a clearer bottom-to-top growth sequence.
    let canGrow = this.parent === null || this.parent.growth > 0.65;

    if (canGrow) {
      this.growth = min(this.growth + growthSpeed, 1);
    }

    if (this.parent !== null) {
      // Attach child branches to the current visible end of the parent.
      // This keeps the branch system connected during the growth animation.
      this.x = this.parent.getCurrentEndX();
      this.y = this.parent.getCurrentEndY();
    }

    // Smaller branches move more than the trunk.
    // This makes future wind or Perlin noise feel more natural.
    let windStrength = map(this.length, 20, 230, 1.5, 0.15, true);
    this.currentAngle = this.angle + windForce * windStrength;

    // Recalculate the target end point after applying the animated angle.
    this.endX = this.x + cos(this.currentAngle) * this.length;
    this.endY = this.y + sin(this.currentAngle) * this.length;

    // Leaves start growing after the terminal branch is fully visible.
    if (this.children.length === 0 && this.growth >= 1) {
      this.leafGrowth = min(this.leafGrowth + growthSpeed * 1.8, 1);
    }

    // Update child branches after this branch has updated its own position.
    for (let child of this.children) {
      child.update(growthSpeed, windForce);
    }
  }

  display() {
    // Do not draw a branch before it has started growing.
    if (this.growth <= 0) return;

    let currentEndX = this.getCurrentEndX();
    let currentEndY = this.getCurrentEndY();

    // Longer branches are thicker, creating a trunk-to-twig hierarchy.
    let thickness = map(this.length, 20, 230, 2, 14, true);

    stroke(105, 75, 45);
    strokeWeight(thickness);
    strokeCap(ROUND);

    line(this.x, this.y, currentEndX, currentEndY);

    // Draw child branches from this branch outward.
    for (let child of this.children) {
      child.display();
    }

    // Only terminal branches grow leaves.
    // This makes the tree read clearly as branches first, leaves second.
    if (this.children.length === 0 && this.leafGrowth > 0) {
      this.displayLeaf();
    }
  }

  displayLeaf() {
    let leafX = this.getCurrentEndX();
    let leafY = this.getCurrentEndY();

    push();
    translate(leafX, leafY);

    // Rotate leaves based on the branch direction with a small random offset.
    // This makes leaves appear attached to the branch instead of floating randomly.
    rotate(this.currentAngle + HALF_PI + this.leafAngleOffset);

    // Scale allows the leaf to grow smoothly from the branch tip.
    scale(this.leafGrowth);

    noStroke();

    // Main leaf body.
    fill(120, 160, 75, 220);
    beginShape();
    vertex(0, -this.leafSize);
    bezierVertex(
      this.leafSize * 0.8,
      -this.leafSize * 0.5,
      this.leafSize * 0.8,
      this.leafSize * 0.5,
      0,
      this.leafSize
    );
    bezierVertex(
      -this.leafSize * 0.8,
      this.leafSize * 0.5,
      -this.leafSize * 0.8,
      -this.leafSize * 0.5,
      0,
      -this.leafSize
    );
    endShape(CLOSE);

    // Leaf vein.
    // This small detail makes the leaf look intentional rather than just a green shape.
    stroke(80, 115, 55, 180);
    strokeWeight(1);
    line(0, -this.leafSize * 0.75, 0, this.leafSize * 0.75);

    pop();
  }

  getCurrentEndX() {
    // Interpolate between the start and full end position based on growth.
    return lerp(this.x, this.endX, this.growth);
  }

  getCurrentEndY() {
    return lerp(this.y, this.endY, this.growth);
  }

  isMouseNear(mx, my, radius = 25) {
    // This helper supports inputMechanic.js later.
    // It checks whether the mouse is near a visible branch tip.
    let d = dist(mx, my, this.getCurrentEndX(), this.getCurrentEndY());

    return d < radius && this.growth > 0.85;
  }
}

// inputMechanic.js
// Handles all user input: keyboard, mouse hover, and mouse click.

class InputMechanic {
  constructor() {
    this.lastBloomTime = 0;
    this.bloomCooldown = 200; // Minimum time between each hover-triggered bloom.
    this.lastClickTime = 0;
    this.clickCooldown = 2000; // Cooldown after a click to prevent immediate re-blooming.
  }
  handleKeyPressed(keyValue) {
    if (keyValue === ' ') {
      createNewTree(); // Type space to create a new tree and
      timeMechanic.reset(); // Reset time mechanic to sync with the new tree.
    }
  }
  handleMouseMoved(mx, my) {
    if (isNearBranch(mx, my)) {
      let now = millis();
      // Skip blooming if the user just clicked, to avoid instant regrowth.
      if (now - this.lastClickTime < this.clickCooldown) return; // Prevent triggering bloom if a click was recently made.

      // Trigger a bloom at most once every bloomCooldown milliseconds.
      if (now - this.lastBloomTime > this.bloomCooldown) { // If the user has not hovered for the cooldown period, trigger a bloom.
        this.lastBloomTime = now;
        addFlowerNearMouse(mx, my); // Add a flower near the mouse position on the tree.
        timeMechanic.recordUserHover();
      }
    }
  }
  handleMouseClicked(mx, my) {
    // Record click time to pause hover-blooming briefly after a click.
    this.lastClickTime = millis(); // Record the time of the click to enforce cooldown on bloom triggering.
    triggerFlowerClick(tree, mx, my);
  }
}

let inputMechanic = new InputMechanic();

// Returns true if the mouse is close enough to any branch node.
function isNearBranch(mx, my) {
  return checkBranch(tree, mx, my);
}

// Recursively checks all branches for proximity to the mouse.
function checkBranch(branch, mx, my) {
  if (branch === null) return false;
  let d = dist(mx, my, branch.x, branch.y);
  if (d < 30) return true;
  return checkBranch(branch.branchA, mx, my) ||
         checkBranch(branch.branchB, mx, my);
}


// Removes a clicked flower and releases petals from its position.
function triggerFlowerClick(branch, mx, my) {
  if (branch === null) return;

  if (branch.branchA === null && branch.hasFlower) {
    // Calculate the flower's position based on the branch's position and angle.
    let flowerX = branch.x + sin(branch.angle) * branch.length * branch.growth + branch.flowerOffsetX;
    let flowerY = branch.y + cos(branch.angle) * branch.length * branch.growth + branch.flowerOffsetY;
    
    let d = dist(mx, my, flowerX, flowerY);
    if (d < 30) {
      branch.hasFlower = false;
      for (let i = 0; i < 5; i++) {
        fallingPetals.push(new FallingPetal(flowerX, flowerY));
      }
    }
  }

  triggerFlowerClick(branch.branchA, mx, my);
  triggerFlowerClick(branch.branchB, mx, my);
}

// Blooms the nearest terminal branch within 150px of the mouse.
function addFlowerNearMouse(mx, my) {
  // Find the closest terminal branch to the mouse
  let closest = null;
  let closestDist = Infinity;

  for (let branch of flowerBranches) {
    if (branch.hasFlower || branch.growth < 0.55) continue;
    let d = dist(mx, my, branch.x, branch.y);
    if (d < 150 && d < closestDist) { // Only consider branches within 150 pixels to prevent adding flowers too far away.
      closestDist = d;
      closest = branch;
    }
  }

  if (closest !== null) {
    closest.hasFlower = true;
    closest.flowerGrowth = 0;
  }
}
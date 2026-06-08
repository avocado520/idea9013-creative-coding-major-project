class InputMechanic {
  
  handleKeyPressed(keyValue) {
    if (keyValue === ' ') {
      createNewTree(); // Type space to create a new tree and
      timeMechanic.reset(); // Reset time mechanic to sync with the new tree.
    }
  }
  handleMouseMoved(mx, my) {
    if (isNearBranch(mx, my)) {
      timeMechanic.recordUserHover();
    }
  }
  handleMouseClicked(mx, my) {
    // after clicking, the petals will start to fall for a while.
    triggerFlowerClick(tree, mx, my);
  }
}

let inputMechanic = new InputMechanic();

function isNearBranch(mx, my) {
  return checkBranch(tree, mx, my);
}

function checkBranch(branch, mx, my) {
  if (branch === null) return false;
  
  let d = dist(mx, my, branch.x, branch.y);
  if (d < 30) return true;
  
  return checkBranch(branch.branchA, mx, my) || 
         checkBranch(branch.branchB, mx, my);
}


function triggerFlowerClick(branch, mx, my) {
  if (branch === null) return;
  
  // Check if this is a terminal branch with a flower
  if (branch.branchA === null && branch.hasFlower) {
    let d = dist(mx, my, branch.x, branch.y);
    if (d < 25) {
      branch.hasFlower = false; // flower is clicked, it will disappear and start to fall down.
      // 
    }
  }
  
  triggerFlowerClick(branch.branchA, mx, my);
  triggerFlowerClick(branch.branchB, mx, my);
}
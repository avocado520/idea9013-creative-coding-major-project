class InputMechanic {
  handleKeyPressed(keyValue) {
    if (keyValue === ' ') {
      createNewTree(); // Type space to create a new tree
    }
  }
  handleMouseMoved(mx, my) {
    if (isNearBranch(mx, my)) {
      timeMechanic.recordUserHover();
    }
  }
  handleMouseClicked(mx, my) {
    // after clicking, the petals will start to fall for a while.
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
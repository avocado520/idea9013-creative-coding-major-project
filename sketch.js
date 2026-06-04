// sketch.js
// This file works as the main controller of the sketch.
// It creates the shared Tree object and calls its update and display methods each frame.
// The detailed tree structure and branch behaviour are defined in tree.js.

let tree;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create the tree at the bottom centre of the canvas.
  // The y position is set close to the canvas height so the trunk grows upward from the bottom edge.
  tree = new Tree(width / 2, height - 5);

  // Rounded stroke caps make branch ends look softer and more organic.
  strokeCap(ROUND);
}

function draw() {
  background(20, 24, 30);

  // Update the tree's growth animation before drawing it.
  // This allows branches and leaves to gradually appear over time.
  tree.update();

  // Draw the current state of the tree after all growth values have been updated.
  tree.display();
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Recreate the tree after resizing so the root remains aligned with the new canvas size.
  // Without this, the tree could appear in the wrong position after the window changes.
  tree = new Tree(width / 2, height - 5);
}
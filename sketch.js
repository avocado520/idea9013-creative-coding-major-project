// sketch.js
// This file works as the main controller of the sketch.
// It keeps the main p5.js flow in one place:
// setup(), draw(), keyPressed(), and windowResized().
// The tree generation logic and Branch class are defined in tree.js.

let tree;
let windAngle = 0;
let timeMechanic;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  timeMechanic = new TimeMechanic();

  leafImage = createLeafImage();

  createNewTree();
}

function draw() {
  background(timeMechanic.getBackgroundColor());

  // Draw ground area.
  fill(160);
  noStroke();
  rect(0, height - 50, width, 50);

  // Create gentle wind movement over time.
  windAngle += 0.003;
  tree.windForce = sin(windAngle) * 0.02;

  tree.update();
  tree.render();
}

function keyPressed() {
  // Press space to regenerate the tree.
  // The overall tree shape stays controlled,
  // while small variations appear in branch angles and length.
  if (key === " ") {
    createNewTree();
  }
}

function windowResized() {
  // Rebuild the tree when the browser size changes.
  resizeCanvas(windowWidth, windowHeight);
  createNewTree();
}
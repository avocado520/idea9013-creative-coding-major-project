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

  // Create the time mechanic before using any time-based values.
  timeMechanic = new TimeMechanic();

  // Create reusable images once at the beginning.
  // The tree uses leafImage, and flower.js uses flowerImage.
  leafImage = createLeafImage();
  flowerImage = createFlowerImage();

  createNewTree();
}

function draw() {
  background(timeMechanic.getBackgroundColor());

  // Draw natural uneven ground.
  drawGround();

  // Create gentle wind movement over time.
  windAngle += 0.003;
  tree.windForce = sin(windAngle) * 0.02;

  // Use timeMechanic to control tree growth speed.
  let growthStep = timeMechanic.getTreeGrowthStep();
  tree.update(growthStep);

  // If the user has not hovered for 5 seconds,
  // add one flower and reset the inactivity timer.
  if (timeMechanic.shouldAutoBloom()) {
    addFlowerOnRandomBranch();
    timeMechanic.recordUserHover();
  }

  tree.render();
}

function keyPressed() {
  // Pass the key input to inputMechanic.
  // inputMechanic decides what should happen when a key is pressed.
  inputMechanic.handleKeyPressed(key);
}

function mouseMoved() {
  // Pass the current mouse position to inputMechanic
  // so it can detect whether the user is hovering over the tree.
  inputMechanic.handleMouseMoved(mouseX, mouseY);
  bloomFromMouseHover(mouseX, mouseY);
}

function mouseClicked() {
  // Pass the click position to inputMechanic
  // so it can check whether a flower was clicked.
  inputMechanic.handleMouseClicked(mouseX, mouseY);
}

function windowResized() {
  // Rebuild the tree when the browser size changes.
  resizeCanvas(windowWidth, windowHeight);
  createNewTree();

  // Reset the time mechanic so the scene timing starts cleanly after resizing.
  timeMechanic.reset();
}

function drawGround() {
  let groundBaseY = height - 100;

  noStroke();
  fill(120, 78, 45);

  beginShape();

  // Start from bottom-left.
  vertex(0, height);

  // Add the first ground surface point.
  let firstY = groundBaseY + map(noise(0), 0, 1, -18, 12);
  vertex(0, firstY);

  // Draw uneven surface across the screen.
  for (let x = 0; x <= width; x += 20) {
    let noiseValue = noise(x * 0.01);
    let groundY = groundBaseY + map(noiseValue, 0, 1, -18, 12);

    vertex(x, groundY);
  }

  // Force the final surface point to reach the right edge.
  let lastNoiseValue = noise(width * 0.01);
  let lastGroundY = groundBaseY + map(lastNoiseValue, 0, 1, -18, 12);
  vertex(width, lastGroundY);

  // Fill down to bottom-right.
  vertex(width, height);

  endShape(CLOSE);

  // Draw top soil line.
  stroke(155, 105, 65);
  strokeWeight(5);
  noFill();

  beginShape();

  let startY = groundBaseY + map(noise(0), 0, 1, -18, 12);
  vertex(0, startY);

  for (let x = 0; x <= width; x += 20) {
    let noiseValue = noise(x * 0.01);
    let groundY = groundBaseY + map(noiseValue, 0, 1, -18, 12);

    vertex(x, groundY);
  }

  vertex(width, lastGroundY);

  endShape();
}
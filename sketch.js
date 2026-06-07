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
  //flowerImage = createFlowerImage();

  createNewTree();

  SFXToggle();
}

function draw() {
  background(timeMechanic.getBackgroundColor());

  // Draw natural uneven ground.
  drawGround();

  // Create gentle wind movement over time.
  windAngle += 0.003;
  tree.windForce = sin(windAngle) * 0.02;

  let growthStep = timeMechanic.getTreeGrowthStep();
  tree.update(growthStep);

  tree.render();

}

function keyPressed() {
  // Press space to regenerate the tree.
  // The overall tree shape stays controlled,
  // while small variations appear in branch angles and length.
  inputMechanic.handleKeyPressed(key);
  
  // Starting chime and rustling sfx also triggered on space
  audioSFX();

}

function mouseMoved() {
  // Pass the current mouse position to inputMechanic to check if the cursor is hovering over a branch.
  inputMechanic.handleMouseMoved(mouseX, mouseY);
}

function mouseClicked() {
  // Pass click position to inputMechanic to check if a flower was clicked.
  inputMechanic.handleMouseClicked(mouseX, mouseY);
}

function windowResized() {
  // Rebuild the tree when the browser size changes.
  resizeCanvas(windowWidth, windowHeight);
  createNewTree();
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

  // IMPORTANT:
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
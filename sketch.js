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

  SFXToggle();
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
  // When the tree is fully grown,
  // automatically start the leaf falling process.
  if (tree.growth >= 1 && !leafFallStarted) {
    leafFallStarted = true;
  }

  // If the user has not hovered for 5 seconds,
  // add one flower and reset the inactivity timer.
  if (timeMechanic.shouldAutoBloom()) {
    addFlowerOnRandomBranch();
    timeMechanic.recordUserHover();
  }

  tree.render();

  drawFrontMound();
  
  // Update and draw falling flower petals.
  for (let i = 0; i < fallingPetals.length; i++) {
    fallingPetals[i].update();
    fallingPetals[i].render();
  }

  // Update and draw falling leaves.
  for (let i = 0; i < fallingLeaves.length; i++) {
    fallingLeaves[i].update();
    fallingLeaves[i].render();
  }


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
  // Pass the current mouse position to inputMechanic
  // so it can detect whether the user is hovering over the tree.
  inputMechanic.handleMouseMoved(mouseX, mouseY);
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

function drawFrontMound() {
  if (!tree) return;

  let baseX = tree.x;
  let groundY = height - 100;

  noStroke();

  // Main soil mound.
  fill(150, 100, 55);

  beginShape();

  vertex(baseX - 110, groundY + 42);

  bezierVertex(
    baseX - 88,
    groundY + 12,
    baseX - 45,
    groundY + 8,
    baseX - 14,
    groundY + 22
  );

  bezierVertex(
    baseX + 12,
    groundY + 6,
    baseX + 62,
    groundY + 12,
    baseX + 96,
    groundY + 38
  );

  bezierVertex(
    baseX + 78,
    groundY + 64,
    baseX - 72,
    groundY + 68,
    baseX - 110,
    groundY + 42
  );

  endShape(CLOSE);

  // Add a soft lower layer so it feels like loose soil,
  // not a perfect single blob.
  fill(142, 92, 48);
  beginShape();

  vertex(baseX - 78, groundY + 48);

  bezierVertex(
    baseX - 52,
    groundY + 34,
    baseX - 10,
    groundY + 38,
    baseX + 8,
    groundY + 46
  );

  bezierVertex(
    baseX + 38,
    groundY + 36,
    baseX + 76,
    groundY + 44,
    baseX + 84,
    groundY + 58
  );

  bezierVertex(
    baseX + 48,
    groundY + 72,
    baseX - 46,
    groundY + 70,
    baseX - 78,
    groundY + 48
  );

  endShape(CLOSE);

  // Gentle top highlight.
  stroke(180, 124, 74, 150);
  strokeWeight(4);
  strokeCap(ROUND);
  noFill();

  beginShape();
  vertex(baseX - 76, groundY + 30);

  bezierVertex(
    baseX - 42,
    groundY + 14,
    baseX + 38,
    groundY + 14,
    baseX + 76,
    groundY + 32
  );

  endShape();

  // Small stones.
  noStroke();
  fill(108, 75, 50, 150);
  ellipse(baseX - 52, groundY + 46, 9, 6);
  ellipse(baseX + 56, groundY + 44, 8, 5);
  ellipse(baseX - 10, groundY + 58, 7, 5);

  // Tiny grass marks on both sides.
  stroke(78, 112, 42, 150);
  strokeWeight(2);
  strokeCap(ROUND);

  line(baseX - 96, groundY + 34, baseX - 102, groundY + 22);
  line(baseX - 88, groundY + 35, baseX - 84, groundY + 24);

  line(baseX + 96, groundY + 36, baseX + 102, groundY + 24);
  line(baseX + 88, groundY + 35, baseX + 84, groundY + 24);
}
// sketch.js
// Main controller for the p5.js sketch.
// This file keeps the core p5.js flow in one place:
// setup(), draw(), keyPressed(), mouseMoved(), mouseClicked(), and windowResized().
// It connects the time, tree, input, audio, sky, and ground behaviours during each frame.

let tree;
let windAngle = 0;
let timeMechanic;

let mic;
let fft;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  // Set up microphone input and FFT analysis so audio can influence the visuals.
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(smoothing, numBins);
  mic.connect(fft);

  // Create the time mechanic before using any time-based values.
  timeMechanic = new TimeMechanic();

  // Create reusable images once at the beginning.
  // The tree uses leafImage, and flower.js uses flowerImage.
  leafImage = createLeafImage();
  flowerImage = createFlowerImage();

  createNewTree();

  // Create the UI control for turning background sound effects on or off.
  SFXToggle();

}

function draw() {
  background(timeMechanic.getBackgroundColor());

  // Draw the sun and moon before the ground so they stay behind the tree scene.
  drawSkyObjects();

  // Draw the back ground layer before the tree so the tree appears planted in the scene.
  drawGround();

  // Use a slow sine wave to create continuous wind movement across the branches.
  windAngle += 0.003;
  tree.windForce = sin(windAngle) * 0.02;

  // Apply time-based growth so the tree animation is not tied directly to frame count.
  let growthStep = timeMechanic.getTreeGrowthStep();
  tree.update(growthStep);

  // Start the leaf-falling stage once the main tree has finished growing.
  if (tree.growth >= 1 && !leafFallStarted) {
    leafFallStarted = true;
  }

  // Trigger passive blooming after a period of no hover interaction.
  // The timer is reset after blooming to prevent flowers spawning every frame.
  if (timeMechanic.shouldAutoBloom()) {
    addFlowerOnRandomBranch();
    timeMechanic.recordUserHover();
  }

  tree.render();

  drawFrontMound();
  
  // Update and draw falling leaves behind petals.
  for (let i = 0; i < fallingLeaves.length; i++) {
    fallingLeaves[i].update();
    fallingLeaves[i].render();
  }

  // Update and draw falling flower petals.
  for (let i = 0; i < fallingPetals.length; i++) {
    fallingPetals[i].update();
    fallingPetals[i].render();
  }

  // Use microphone input to influence the height or movement of falling leaves and petals.
  micAudio();

}

function keyPressed() {
  // Forward key input to inputMechanic so input behaviour stays separate from the main draw loop.
  inputMechanic.handleKeyPressed(key);
  
  // Trigger the start sound effect when the key interaction occurs.
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

  // Restart time-based states after resizing so the regenerated scene stays in sync.
  timeMechanic.reset();
}
function getGroundScale() {
  return constrain(min(width, height) / 900, 0.65, 1.3);
}

function drawGround() {
  let scaleValue = getGroundScale();
  let groundBaseY = height - 100 * scaleValue;

  noStroke();
  fill(120, 78, 45);

  beginShape();

  // Start the ground shape from the bottom-left corner so the area can be filled.
  vertex(0, height);

  // Add the first uneven ground point before drawing across the screen.
  let firstY = groundBaseY + map(noise(0), 0, 1, -18 * scaleValue, 12 * scaleValue);
  vertex(0, firstY);

  // Use noise to make the ground edge feel organic instead of perfectly flat.
  for (let x = 0; x <= width; x += 20 * scaleValue) {
    let noiseValue = noise(x * 0.01);
    let groundY = groundBaseY + map(noiseValue, 0, 1, -18 * scaleValue, 12 * scaleValue);

    vertex(x, groundY);
  }

  // Force the final surface point to reach the right edge.
  let lastNoiseValue = noise(width * 0.01);
  let lastGroundY = groundBaseY + map(lastNoiseValue, 0, 1, -18 * scaleValue, 12 * scaleValue);
  vertex(width, lastGroundY);

  // Fill the shape down to the bottom-right corner.
  vertex(width, height);

  endShape(CLOSE);

  // Draw a lighter top line to separate the soil from the sky and tree.
  stroke(155, 105, 65);
  strokeWeight(5 * scaleValue);
  noFill();

  beginShape();

  let startY = groundBaseY + map(noise(0), 0, 1, -18 * scaleValue, 12 * scaleValue);
  vertex(0, startY);

  for (let x = 0; x <= width; x += 20 * scaleValue) {
    let noiseValue = noise(x * 0.01);
    let groundY = groundBaseY + map(noiseValue, 0, 1, -18 * scaleValue, 12 * scaleValue);

    vertex(x, groundY);
  }

  vertex(width, lastGroundY);

  endShape();
}

function drawFrontMound() {
  if (!tree) return;

  let scaleValue = getGroundScale();
  let baseX = tree.x;
  let groundY = height - 100 * scaleValue;

  noStroke();

  // Draw a front soil mound around the tree base to visually anchor the trunk.
  fill(150, 100, 55);

  beginShape();

  vertex(baseX - 110 * scaleValue, groundY + 42 * scaleValue);

  bezierVertex(
    baseX - 88 * scaleValue,
    groundY + 12 * scaleValue,
    baseX - 45 * scaleValue,
    groundY + 8 * scaleValue,
    baseX - 14 * scaleValue,
    groundY + 22 * scaleValue
  );

  bezierVertex(
    baseX + 12 * scaleValue,
    groundY + 6 * scaleValue,
    baseX + 62 * scaleValue,
    groundY + 12 * scaleValue,
    baseX + 96 * scaleValue,
    groundY + 38 * scaleValue
  );

  bezierVertex(
    baseX + 78 * scaleValue,
    groundY + 64 * scaleValue,
    baseX - 72 * scaleValue,
    groundY + 68 * scaleValue,
    baseX - 110 * scaleValue,
    groundY + 42 * scaleValue
  );

  endShape(CLOSE);

  // Add a lower soil layer so the mound feels loose rather than like one flat blob.
  fill(142, 92, 48);
  beginShape();

  vertex(baseX - 78 * scaleValue, groundY + 48 * scaleValue);

  bezierVertex(
    baseX - 52 * scaleValue,
    groundY + 34 * scaleValue,
    baseX - 10 * scaleValue,
    groundY + 38 * scaleValue,
    baseX + 8 * scaleValue,
    groundY + 46 * scaleValue
  );

  bezierVertex(
    baseX + 38 * scaleValue,
    groundY + 36 * scaleValue,
    baseX + 76 * scaleValue,
    groundY + 44 * scaleValue,
    baseX + 84 * scaleValue,
    groundY + 58 * scaleValue
  );

  bezierVertex(
    baseX + 48 * scaleValue,
    groundY + 72 * scaleValue,
    baseX - 46 * scaleValue,
    groundY + 70 * scaleValue,
    baseX - 78 * scaleValue,
    groundY + 48 * scaleValue
  );

  endShape(CLOSE);

  // Add a soft highlight to show the top surface of the soil.
  stroke(180, 124, 74, 150);
  strokeWeight(4 * scaleValue);
  strokeCap(ROUND);
  noFill();

  beginShape();
  vertex(baseX - 76 * scaleValue, groundY + 30 * scaleValue);

  bezierVertex(
    baseX - 42 * scaleValue,
    groundY + 14 * scaleValue,
    baseX + 38 * scaleValue,
    groundY + 14 * scaleValue,
    baseX + 76 * scaleValue,
    groundY + 32 * scaleValue
  );

  endShape();

  // Add small stones to break up the soil surface.
  noStroke();
  fill(108, 75, 50, 150);
  ellipse(baseX - 52 * scaleValue, groundY + 46 * scaleValue, 9 * scaleValue, 6 * scaleValue);
  ellipse(baseX + 56 * scaleValue, groundY + 44 * scaleValue, 8 * scaleValue, 5 * scaleValue);
  ellipse(baseX - 10 * scaleValue, groundY + 58 * scaleValue, 7 * scaleValue, 5 * scaleValue);

  // Add small grass marks on both sides so the mound blends into the ground.
  stroke(78, 112, 42, 150);
  strokeWeight(2 * scaleValue);
  strokeCap(ROUND);

  line(
    baseX - 96 * scaleValue,
    groundY + 34 * scaleValue,
    baseX - 102 * scaleValue,
    groundY + 22 * scaleValue
  );

  line(
    baseX - 88 * scaleValue,
    groundY + 35 * scaleValue,
    baseX - 84 * scaleValue,
    groundY + 24 * scaleValue
  );

  line(
    baseX + 96 * scaleValue,
    groundY + 36 * scaleValue,
    baseX + 102 * scaleValue,
    groundY + 24 * scaleValue
  );

  line(
    baseX + 88 * scaleValue,
    groundY + 35 * scaleValue,
    baseX + 84 * scaleValue,
    groundY + 24 * scaleValue
  );
}

function drawSkyObjects() {
  // Sun and moon use the same day-night cycle as the background.
  // Their movement is stylised to suggest rising across the sky rather than looping back down.
  if (timeMechanic.isSunVisible()) {
    let sunProgress = timeMechanic.getSunProgress();

    // Smooth the motion so the sun enters gradually instead of jumping into view.
    let easedSunProgress = easeInOutSmooth(sunProgress);

    // Move the sun from the lower-right area toward the upper sky.
    let sunX = lerp(width * 0.82, width * 0.48, easedSunProgress);
    let sunY = lerp(height * 0.95, height * 0.22, easedSunProgress);

    // Use the visible progress to fade the sun in and out over time.
    let sunStrength = getSkyObjectStrength(sunProgress);

    drawSun(sunX, sunY, sunStrength);
  }

  if (timeMechanic.isMoonVisible()) {
    let moonProgress = timeMechanic.getMoonProgress();

    // Reuse the same smooth rising motion so the moon follows the same time system.
    let easedMoonProgress = easeInOutSmooth(moonProgress);

    // Move the moon from the lower-right area toward the upper sky.
    let moonX = lerp(width * 0.82, width * 0.48, easedMoonProgress);
    let moonY = lerp(height * 0.95, height * 0.22, easedMoonProgress);

    // Fade the moon in and out so it does not appear or disappear suddenly.
    let moonStrength = getSkyObjectStrength(moonProgress);

    drawMoon(moonX, moonY, moonStrength);
  }
}

function easeInOutSmooth(value) {
  value = constrain(value, 0, 1);

  // Smooth acceleration and deceleration for sky object movement.
  return value * value * (3 - 2 * value);
}

function getSkyObjectStrength(progress) {
  // Fade in from 0 so the sun or moon does not pop into view.
  let fadeIn = constrain(map(progress, 0, 0.22, 0, 1), 0, 1);

  // Fade out near the end while the object is still in the sky.
  let fadeOut = constrain(map(progress, 0.78, 1, 1, 0), 0, 1);

  return fadeIn * fadeOut;
}

function drawSun(x, y, strength) {
  push();
  noStroke();

  let skyScale = min(width, height) / 900;

  fill(255, 70, 10, 16 * strength);
  circle(x, y, 520 * skyScale);

  fill(255, 85, 15, 24 * strength);
  circle(x, y, 420 * skyScale);

  fill(255, 105, 25, 40 * strength);
  circle(x, y, 330 * skyScale);

  fill(255, 125, 35, 65 * strength);
  circle(x, y, 260 * skyScale);

  fill(255, 90, 20, 235 * strength);
  circle(x, y, 220 * skyScale);

  fill(255, 140, 45, 160 * strength);
  circle(x, y, 175 * skyScale);

  fill(255, 190, 100, 85 * strength);
  circle(x - 30 * skyScale, y - 32 * skyScale, 60 * skyScale);

  pop();
}

function drawMoon(x, y, strength) {
  push();
  noStroke();

  let skyScale = min(width, height) / 900;

  // Draw a cool glow around the moon to make it visible against the night sky.
  fill(150, 175, 255, 12 * strength);
  circle(x, y, 440);

  fill(180, 200, 255, 20 * strength);
  circle(x, y, 320);

  fill(205, 215, 255, 32 * strength);
  circle(x, y, 230);

  // Draw the main moon body.
  fill(225, 230, 238, 235 * strength);
  circle(x, y, 175);
  
  // Add darker crater marks to make the moon surface less flat.
  fill(145, 155, 175, 88 * strength);
  circle(x - 36, y - 26, 24);
  circle(x + 38, y - 22, 18);
  circle(x + 12, y + 38, 24);
  circle(x - 42, y + 34, 15);
  circle(x + 48, y + 30, 12);

  // Add small highlights on selected craters to create surface detail.
  fill(245, 246, 250, 82 * strength);
  circle(x - 41, y - 31, 10);
  circle(x + 34, y - 27, 8);
  circle(x + 7, y + 32, 9);

  // Add a soft highlight so the moon has a gentle spherical feel.
  fill(255, 255, 255, 58 * strength);
  circle(x - 32, y - 34, 48);

  pop();
}
// sketch.js
// This file works as the main controller of the sketch.
// It keeps the main p5.js flow in one place:
// setup(), draw(), keyPressed(), and windowResized().
// The tree generation logic and Branch class are defined in tree.js.

let tree;
let windAngle = 0;
let timeMechanic;

let mic;
let fft;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  //allowing mic functionality and fft
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

  //button for toggling backgroundSFX
  SFXToggle();

}

function draw() {
  background(timeMechanic.getBackgroundColor());

  drawSkyObjects();

  // Draw natural uneven ground
  drawGround();

  // Create gentle wind movement over time
  windAngle += 0.003;
  tree.windForce = sin(windAngle) * 0.02;

  // Use timeMechanic to control tree growth speed
  let growthStep = timeMechanic.getTreeGrowthStep();
  tree.update(growthStep);

  // When the tree is fully grown,
  // automatically start the leaf falling process
  if (tree.growth >= 1 && !leafFallStarted) {
    leafFallStarted = true;
  }

  // If the user has not hovered for 5 seconds,
  // add one flower and reset the inactivity timer
  if (timeMechanic.shouldAutoBloom()) {
    addFlowerOnRandomBranch();
    timeMechanic.recordUserHover();
  }

  tree.render();

  drawFrontMound();
  
  // Update and draw falling leaves behind petals
  for (let i = 0; i < fallingLeaves.length; i++) {
    fallingLeaves[i].update();
    fallingLeaves[i].render();
  }

  // Update and draw falling flower petals
  for (let i = 0; i < fallingPetals.length; i++) {
    fallingPetals[i].update();
    fallingPetals[i].render();
  }

  //function controlling petal/leaf height based off mic input
  micAudio();

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
  // Rebuild the tree when the browser size changes
  resizeCanvas(windowWidth, windowHeight);
  createNewTree();

  // Reset the time mechanic so the scene timing starts cleanly after resizing
  timeMechanic.reset();
}

function drawGround() {
  let groundBaseY = height - 100;

  noStroke();
  fill(120, 78, 45);

  beginShape();

  // Start from bottom-left
  vertex(0, height);

  // Add the first ground surface point
  let firstY = groundBaseY + map(noise(0), 0, 1, -18, 12);
  vertex(0, firstY);

  // Draw uneven surface across the screen
  for (let x = 0; x <= width; x += 20) {
    let noiseValue = noise(x * 0.01);
    let groundY = groundBaseY + map(noiseValue, 0, 1, -18, 12);

    vertex(x, groundY);
  }

  // Force the final surface point to reach the right edge
  let lastNoiseValue = noise(width * 0.01);
  let lastGroundY = groundBaseY + map(lastNoiseValue, 0, 1, -18, 12);
  vertex(width, lastGroundY);

  // Fill down to bottom-right
  vertex(width, height);

  endShape(CLOSE);

  // Draw top soil line
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

function drawSkyObjects() {
  // Sun and moon use the same day-night cycle as the background.
  // In Sydney, their path is represented as rising from the right side
  // and moving upward across the sky.
  if (timeMechanic.isSunVisible()) {
    let sunProgress = timeMechanic.getSunProgress();

    // Make the movement faster near the beginning,
    // so the sun enters the scene earlier.
    let easedSunProgress = easeInOutSmooth(sunProgress);

    // Rise from the lower-right area and disappear higher in the sky.
    let sunX = lerp(width * 0.82, width * 0.48, easedSunProgress);
    let sunY = lerp(height * 0.95, height * 0.22, easedSunProgress);

    // Fade in quickly, then fade out while still high in the sky.
    let sunStrength = getSkyObjectStrength(sunProgress);

    drawSun(sunX, sunY, sunStrength);
  }

  if (timeMechanic.isMoonVisible()) {
    let moonProgress = timeMechanic.getMoonProgress();

    // Use the same natural rising motion for the moon.
    let easedMoonProgress = easeInOutSmooth(moonProgress);

    // Rise from the lower-right area and fade out in the upper sky.
    let moonX = lerp(width * 0.82, width * 0.48, easedMoonProgress);
    let moonY = lerp(height * 0.95, height * 0.22, easedMoonProgress);

    // Fade in and out so the moon does not suddenly pop on/off.
    let moonStrength = getSkyObjectStrength(moonProgress);

    drawMoon(moonX, moonY, moonStrength);
  }
}

function easeInOutSmooth(value) {
  value = constrain(value, 0, 1);

  // Smooth acceleration and deceleration.
  return value * value * (3 - 2 * value);
}

function getSkyObjectStrength(progress) {
  // Fade in from 0 so the sun/moon does not pop into view.
  let fadeIn = constrain(map(progress, 0, 0.22, 0, 1), 0, 1);

  // Fade out near the end while still in the sky.
  let fadeOut = constrain(map(progress, 0.78, 1, 1, 0), 0, 1);

  return fadeIn * fadeOut;
}

    drawSun(sunX, sunY, sunStrength);

  // Moon appears during the later part of the cycle.
  if (timeMechanic.isMoonVisible()) {
    let moonProgress = timeMechanic.getMoonProgress();

    // Keep the moon centred horizontally so it mirrors the sun transition.
    let moonX = width * 0.5;

    // Move the moon in the same rising and falling motion.
    let moonY = lerp(height * 1.08, height * 0.72, sin(moonProgress * PI));

    let moonStrength = sin(moonProgress * PI);

    drawMoon(moonX, moonY, moonStrength);
  }


function drawSun(x, y, strength) {
  push();
  noStroke();

  // Large atmospheric glow.
  fill(255, 70, 10, 16 * strength);
  circle(x, y, 520);

  fill(255, 85, 15, 24 * strength);
  circle(x, y, 420);

  fill(255, 105, 25, 40 * strength);
  circle(x, y, 330);

  fill(255, 125, 35, 65 * strength);
  circle(x, y, 260);

  // Main glowing body.
  fill(255, 90, 20, 235 * strength);
  circle(x, y, 220);

  // Warm inner light.
  fill(255, 140, 45, 160 * strength);
  circle(x, y, 175);

  // Subtle highlight so the sun does not look completely flat.
  fill(255, 190, 100, 85 * strength);
  circle(x - 30, y - 32, 60);

  pop();
}

function drawMoon(x, y, strength) {
  push();
  noStroke();

  // Large cold glow around the moon.
  fill(150, 175, 255, 12 * strength);
  circle(x, y, 440);

  fill(180, 200, 255, 20 * strength);
  circle(x, y, 320);

  fill(205, 215, 255, 32 * strength);
  circle(x, y, 230);

  // Main moon body.
  fill(225, 230, 238, 235 * strength);
  circle(x, y, 175);
  
  // Main craters.
  fill(145, 155, 175, 88 * strength);
  circle(x - 36, y - 26, 24);
  circle(x + 38, y - 22, 18);
  circle(x + 12, y + 38, 24);
  circle(x - 42, y + 34, 15);
  circle(x + 48, y + 30, 12);

  // Crater highlights.
  fill(245, 246, 250, 82 * strength);
  circle(x - 41, y - 31, 10);
  circle(x + 34, y - 27, 8);
  circle(x + 7, y + 32, 9);

  // Gentle surface highlight.
  fill(255, 255, 255, 58 * strength);
  circle(x - 32, y - 34, 48);

  pop();
}
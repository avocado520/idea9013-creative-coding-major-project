// sketch.js
// This file works as the main controller of the sketch.
// It creates the shared Tree object and calls its update and display methods each frame.
// The detailed tree structure and branch behaviour are defined in tree.js.

// sketch.js

let tree;
let windAngle = 0;
let minX, maxX, minY, maxY;
let leafImage;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  strokeCap(ROUND);
  leafImage = createLeafImage();
  createNewTree();
}

function draw() {
  background(20, 24, 30);

  windAngle += 0.003;
  tree.windForce = sin(windAngle) * 0.02;
  tree.update();
  tree.render();
}

function createNewTree() {
  // Use the current time in milliseconds to seed the random number generator, ensuring a different tree each time
  randomSeed(millis());

  minX = width / 2;
  maxX = width / 2;
  minY = height;
  maxY = height;

  let groundY = height - 50;
  tree = new Branch(null, width / 2, groundY, PI, 110);

  let xSize = maxX - minX;
  let ySize = maxY - minY;
  let scaleValue = 1;

  if (xSize > ySize) {
    if (xSize > 500) scaleValue = 500 / xSize;
  } else {
    if (ySize > 480) scaleValue = 480 / ySize;
  }

  tree.setScale(scaleValue);
  tree.x = width / 2 - (xSize / 2) * scaleValue + (tree.x - minX) * scaleValue;
  tree.y = groundY;
}

function keyPressed() {
  if (key === ' ') {
    createNewTree();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createNewTree();
}
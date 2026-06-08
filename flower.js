// flower.js
// This file controls the visual style of flowers.
// The flower position is still decided by tree.js,
// because flowers grow from the tips of tree branches.

let flowerImage;

function createFlowerImage() {
  let buffer = createGraphics(50, 50);

  buffer.clear();

  buffer.push();

  // Move the drawing origin to the centre.
  buffer.translate(25, 25);

  buffer.noStroke();

  // Draw a very soft pale shadow behind the flower.
  // This makes the blossom feel less flat.
  buffer.fill(255, 190, 205, 45);
  buffer.circle(0, 0, 30);

  // Draw five slightly irregular petals.
  for (let i = 0; i < 5; i++) {
    buffer.push();

    let petalAngle = (TWO_PI / 5) * i;
    buffer.rotate(petalAngle);

    // Main outer petal.
    buffer.fill(255, 198, 210, 235);

    buffer.beginShape();
    buffer.vertex(0, -3);

    buffer.bezierVertex(
      7,
      -10,
      8,
      -18,
      1,
      -21
    );

    buffer.bezierVertex(
      -7,
      -18,
      -8,
      -10,
      0,
      -3
    );

    buffer.endShape(CLOSE);

    // Inner highlight on each petal.
    buffer.fill(255, 235, 240, 170);

    buffer.beginShape();
    buffer.vertex(0, -5);

    buffer.bezierVertex(
      3,
      -10,
      3,
      -15,
      0,
      -17
    );

    buffer.bezierVertex(
      -3,
      -15,
      -3,
      -10,
      0,
      -5
    );

    buffer.endShape(CLOSE);

    // A thin pink vein line.
    buffer.stroke(255, 135, 155, 110);
    buffer.strokeWeight(0.8);
    buffer.noFill();

    buffer.bezier(
      0,
      -5,
      1,
      -9,
      1,
      -13,
      0,
      -18
    );

    buffer.noStroke();

    buffer.pop();
  }

  // Small warmer pink marks near the centre.
  buffer.fill(255, 135, 155, 180);
  buffer.circle(-4, -2, 2);
  buffer.circle(4, -1, 2);
  buffer.circle(1, 4, 2);

  // Yellow flower centre.
  buffer.fill(245, 205, 85);
  buffer.circle(0, 0, 6);

  // Darker centre dot.
  buffer.fill(145, 95, 45);
  buffer.circle(0, 0, 2.5);

  // Tiny stamens around the centre.
  buffer.stroke(240, 160, 80, 180);
  buffer.strokeWeight(1);

  for (let i = 0; i < 6; i++) {
    let a = (TWO_PI / 6) * i;
    let x1 = cos(a) * 4;
    let y1 = sin(a) * 4;
    let x2 = cos(a) * 8;
    let y2 = sin(a) * 8;

    buffer.line(x1, y1, x2, y2);
  }

  buffer.noStroke();
  buffer.fill(255, 210, 90);

  for (let i = 0; i < 6; i++) {
    let a = (TWO_PI / 6) * i;
    buffer.circle(cos(a) * 8, sin(a) * 8, 1.5);
  }

  buffer.pop();

  return buffer;
}

function drawFlower(x, y, flowerSize, flowerAngle) {
  push();

  translate(x, y);
  rotate(flowerAngle);

  // Slightly reduce the base size so the flowers do not cover the tree too much.
  scale(flowerSize * 0.75);

  image(
    flowerImage,
    -flowerImage.width / 2,
    -flowerImage.height / 2
  );

  pop();
}
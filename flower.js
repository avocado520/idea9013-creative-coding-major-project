// This file controls the visual style of flowers.
// The flower position is still decided by tree.js,
// because flowers grow from the tips of tree branches.

// Draw one blossom.
// x: flower x position
// y: flower y position
// flowerSize: flower scale
// flowerAngle: flower rotation
function drawFlower(x, y, flowerSize, flowerAngle) {
  push();

  translate(x, y);
  rotate(flowerAngle);
  scale(flowerSize);
  image(flowerImage, -flowerImage.width / 2, -flowerImage.height / 2);
  
  noStroke();

  // Draw five soft pink petals.
  for (let i = 0; i < 5; i++) {
    push();

    rotate((TWO_PI / 5) * i);

    // Main petal shape.
    fill(255, 205, 215);
    ellipse(0, -7, 7, 13);

    // Lighter inner petal detail.
    fill(255, 232, 238, 180);
    ellipse(0, -7, 3, 8);

    pop();
  }

  // Draw the yellow flower center.
  fill(245, 205, 80);
  circle(0, 0, 5);

  // Draw a small darker dot in the center.
  fill(170, 110, 55);
  circle(0, 0, 2);

  // Add small pink details to make the flower look less flat.
  fill(255, 125, 150);
  circle(-3, -2, 1.5);
  circle(3, 1, 1.5);

  pop();
}
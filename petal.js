let petals = [];

function setup() {
  createCanvas(600, 600);

  // Create many petals
  for (let i = 0; i < 80; i++) {
    petals[i] = new Petal();
  }
}

function draw() {
  background(250, 245, 248);

  for (let i = 0; i < petals.length; i++) {
    petals[i].move();
    petals[i].display();
  }
}

class Petal {
  constructor() {
    this.x = random(width);
    this.y = random(-height, 0);

    this.size = random(8, 18);
    this.speedY = random(0.8, 2.5);
    this.speedX = random(-0.5, 0.5);

    this.angle = random(TWO_PI);
    this.rotateSpeed = random(-0.03, 0.03);

    this.noiseOffset = random(1000);

    // Different falling styles
    this.type = int(random(4));

    this.r = random(245, 255);
    this.g = random(150, 190);
    this.b = random(180, 220);
    this.alpha = random(160, 230);
  }

  move() {
    // Type 0: soft left-right floating
    if (this.type === 0) {
      this.x += sin(frameCount * 0.03 + this.noiseOffset) * 0.8;
      this.y += this.speedY;
      this.angle += this.rotateSpeed;
    }

    // Type 1: rotating and slowly falling
    if (this.type === 1) {
      this.x += map(noise(this.noiseOffset), 0, 1, -1, 1);
      this.y += this.speedY * 0.9;
      this.angle += this.rotateSpeed * 2;
      this.noiseOffset += 0.01;
    }

    // Type 2: faster diagonal falling
    if (this.type === 2) {
      this.x += this.speedX + 1.2;
      this.y += this.speedY * 1.5;
      this.angle += this.rotateSpeed;
    }

    // Type 3: slow drifting, like petals far away
    if (this.type === 3) {
      this.x += map(noise(this.noiseOffset), 0, 1, -0.7, 0.7);
      this.y += this.speedY * 0.6;
      this.angle += this.rotateSpeed * 0.5;
      this.noiseOffset += 0.005;
    }

    // Reset petal when it falls out of screen
    if (this.y > height + 20 || this.x > width + 20) {
      this.x = random(width);
      this.y = random(-100, 0);
      this.size = random(8, 18);
      this.speedY = random(0.8, 2.5);
      this.speedX = random(-0.5, 0.5);
      this.type = int(random(4));
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    noStroke();
    fill(this.r, this.g, this.b, this.alpha);

    // Draw simple petal shape
    beginShape();
    vertex(0, -this.size);
    bezierVertex(
      this.size * 0.8, -this.size * 0.5,
      this.size * 0.7, this.size * 0.7,
      0, this.size
    );
    bezierVertex(
      -this.size * 0.7, this.size * 0.7,
      -this.size * 0.8, -this.size * 0.5,
      0, -this.size
    );
    endShape(CLOSE);

    pop();
  }
}
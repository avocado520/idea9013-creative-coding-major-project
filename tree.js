
let windAngle = 0;
let minX, maxX, minY, maxY;

let leafImage;

function setup() {
  createCanvas(600, 600);
  angleMode(RADIANS);

  leafImage = createLeafImage();

  createNewTree();
}

function draw() {
  
  background(215); 

  fill(160); 
  noStroke();
  rect(0, height - 50, width, 50);

  windAngle += 0.003;

  tree.windForce = sin(windAngle) * 0.02;

  tree.update();
  tree.render();
}

function createNewTree() {
  

  minX = width / 2;
  maxX = width / 2;
  minY = height;
  maxY = height;

  // the ground level is set at height - 50 to ensure the tree starts growing from the ground
  let groundY = height - 50; 

  tree = new Branch(null, width / 2, groundY, PI, 110);

  let xSize = maxX - minX;
  let ySize = maxY - minY;

  let scaleValue = 1;

  if (xSize > ySize) {
    if (xSize > 500) {
      scaleValue = 500 / xSize;
    }
  } else {
    if (ySize > 480) { 
      scaleValue = 480 / ySize;
    }
  }

  tree.setScale(scaleValue);

  tree.x = width / 2 - (xSize / 2) * scaleValue + (tree.x - minX) * scaleValue;
  tree.y = groundY;
}

function createLeafImage() {
  let buffer = createGraphics(12, 18);

  buffer.clear();

  buffer.stroke(93, 104, 0);
  buffer.line(6, 0, 6, 6);

  buffer.noStroke();

  buffer.fill(116, 150, 0);
  buffer.beginShape();
  buffer.vertex(6, 6);
  buffer.bezierVertex(0, 12, 0, 12, 6, 18);
  buffer.bezierVertex(12, 12, 12, 12, 6, 6);
  buffer.endShape();

  buffer.fill(139, 184, 0);
  buffer.beginShape();
  buffer.vertex(6, 9);
  buffer.bezierVertex(0, 13, 0, 13, 6, 18);
  buffer.bezierVertex(12, 13, 12, 13, 6, 9);
  buffer.endShape();

  buffer.stroke(101, 144, 0);
  buffer.noFill();
  buffer.bezier(6, 9, 5, 11, 5, 12, 6, 15);

  return buffer;
}

class Branch {
  constructor(parent, x, y, angleOffset, length) {
    this.parent = parent;

    this.x = x;
    this.y = y;

    this.angle = 0;
    this.angleOffset = angleOffset;

    this.length = length;

    this.growth = 0;
    this.windForce = 0;
    this.blastForce = 0;

    this.branchA = null;
    this.branchB = null;

    if (this.parent !== null) {
      this.angle = this.parent.angle + angleOffset;
      this.angleOffset = angleOffset;
    } else {
      this.angle = angleOffset;
      this.angleOffset = -0.2 + random(0.4);
    }

    let xB = this.x + sin(this.angle) * this.length;
    let yB = this.y + cos(this.angle) * this.length;

    if (this.length > 10) {
      if (this.length + random(this.length * 10) > 30) {
        this.branchA = new Branch(
          this,
          xB,
          yB,
          -0.1 - random(0.4) + ((this.angle % TWO_PI) > PI ? -1 / this.length : 1 / this.length),
          this.length * (0.6 + random(0.3))
        );
      }

      if (this.length + random(this.length * 10) > 30) {
        this.branchB = new Branch(
          this,
          xB,
          yB,
          0.1 + random(0.4) + ((this.angle % TWO_PI) > PI ? -1 / this.length : 1 / this.length),
          this.length * (0.6 + random(0.3))
        );
      }

      if (this.branchB !== null && this.branchA === null) {
        this.branchA = this.branchB;
        this.branchB = null;
      }
    }

    minX = min(xB, minX);
    maxX = max(xB, maxX);
    minY = min(yB, minY);
    maxY = max(yB, maxY);
  }

  setScale(scaleValue) {
    this.length *= scaleValue;

    if (this.branchA !== null) {
      this.branchA.setScale(scaleValue);

      if (this.branchB !== null) {
        this.branchB.setScale(scaleValue);
      }
    }
  }

  update() {
    if (this.parent !== null) {
      this.x = this.parent.x + sin(this.parent.angle) * this.parent.length * this.parent.growth;
      this.y = this.parent.y + cos(this.parent.angle) * this.parent.length * this.parent.growth;

      this.windForce = this.parent.windForce * (1.0 + 5.0 / this.length) + this.blastForce;

      this.blastForce = (this.blastForce + sin(this.x / 2 + windAngle) * 0.005 / this.length) * 0.98;

      this.angle = this.parent.angle + this.angleOffset + this.windForce + this.blastForce;

      this.growth = min(this.growth + 0.1 * this.parent.growth, 1);
    } else {
      this.growth = min(this.growth + 0.1, 1);
    }

    if (this.branchA !== null) {
      this.branchA.update();

      if (this.branchB !== null) {
        this.branchB.update();
      }
    }
  }

  render() {
    if (this.branchA !== null) {
      let xB = this.x;
      let yB = this.y;

      if (this.parent !== null) {
        xB += (this.x - this.parent.x) * 0.4;
        yB += (this.y - this.parent.y) * 0.4;
      } else {
        xB += sin(this.angle + this.angleOffset) * this.length * 0.3;
        yB += cos(this.angle + this.angleOffset) * this.length * 0.3;
      }

      let branchColor = floor(1100 / this.length);

      stroke(branchColor);
      strokeWeight(this.length / 5);
      strokeCap(ROUND);
      noFill();

      bezier(
        this.x,
        this.y,
        xB,
        yB,
        xB,
        yB,
        this.branchA.x,
        this.branchA.y
      );

      this.branchA.render();

      if (this.branchB !== null) {
        this.branchB.render();
      }
    } else {
      push();
      translate(this.x, this.y);
      rotate(-this.angle);
      image(leafImage, -leafImage.width / 2, 0);
      pop();
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    createNewTree();
  }
}
const PARENT = "particles-parent";
const  MAX_COUNT = 84;
const particles = [];
let width, height;

function dimensions() {
  let p = document.getElementById(PARENT);
  width = p.offsetWidth;
  height = p.offsetHeight;
  count = Math.round(width * height / 8640);
  if (count < 3) {
    count = 3;
  } else if (count > MAX_COUNT) {
    count = MAX_COUNT;
  }
}

function makeCanvas() {
  dimensions();
  let cnv = createCanvas(width, height);
  // cnv.style("display", "block");
  // cnv.style("position", "absolute");
  // cnv.style("inset", 0);
  // cnv.style("z-index", -1);
  cnv.parent(PARENT);
  return cnv;
}

function setup() {
  dimensions();
  let cnv = makeCanvas();
  for (let i = 0; i <= count; i++) {
    // set the color of the first particle to #f012ce, the second particle to #32B47F and the third particle to #7E6551, the remaining particles should be #FFFFFF
    if (i === 0) {
        particles.push(new Particle("#f012ce"));
    } else if (i === 1) {
        particles.push(new Particle("#32B47F"));
    } else if (i === 2) {
        particles.push(new Particle("#7E6551"));
    } else {
        particles.push(new Particle("#FFFFFF"));
    }
  }
  return cnv;
}

function draw() {
  // background(51);
  clear();
  particles.forEach((particle, index) => {
    particle.update();
    particle.drawParticle();
    particle.drawLines(particles.slice(index));
  });
}

function windowResized() {
  dimensions();
  let cnv = makeCanvas();
  if (particles.length < count) {
    for (let i = particles.length; i <= count; i++) {
      particles.push(new Particle("#FFFFFF"));
    }
  } else if (particles.length > count) {
    for (let i = particles.length; i > count; i--) {
      particles.pop();
    }
  }
  return cnv;
}

class Particle {
  constructor(color) {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    this.acceleration = createVector();
    this.color = color;
    this.trapped = 0;
    this.trapCheck = false;
  }

  update() {
    this.detectMouseInteraction();
    this.position.add(this.velocity);
    this.detectEdges();
  }

  detectMouseInteraction() {
    let mouse = createVector(mouseX, mouseY);
    let direction = mouse.sub(this.position);
    let distance = direction.mag();

    if (distance < 100) {
      direction.normalize();
      direction.mult(0.5);
      this.acceleration = direction;
      this.velocity.add(this.acceleration);
      this.velocity.limit(4);
    }
  }

  detectEdges() {
    if (this.trapped > 5) {
      this.position.x = random(width);
      this.position.y = random(height);
      this.trapped = 0;
      this.trapCheck = false;
    } else if (this.position.x < 0 || this.position.x > width) {
      this.velocity.x *= -1;
      if (this.trapCheck) {
        this.trapped += 1;
      }
      this.trapCheck = true;
    } else if (this.position.y < 0 || this.position.y > height) {
      this.velocity.y *= -1;
      if (this.trapCheck) {
        this.trapped += 1;
      }
      this.trapCheck = true;
    } else {
      this.trapped = 0;
      this.trapCheck = false;
    }
  }

  drawLines(particles) {
    particles.forEach((particle) => {
      let distance = dist(
        this.position.x,
        this.position.y,
        particle.position.x,
        particle.position.y
      );
      const MAX_DISTANCE = 100;
      if (distance < MAX_DISTANCE) {
        let alpha = map(distance, 0, MAX_DISTANCE, 255, 0);
        // create a variable that converts this.color to rgb
        let r = parseInt(this.color.slice(1, 3), 16);
        let g = parseInt(this.color.slice(3, 5), 16);
        let b = parseInt(this.color.slice(5, 7), 16);
        stroke(r, g, b, alpha);
        line(
          this.position.x,
          this.position.y,
          particle.position.x,
          particle.position.y
        );
      }
    });
  }

  drawParticle() {
    fill(this.color);
    noStroke();
    ellipse(this.position.x, this.position.y, 5);
  }
}

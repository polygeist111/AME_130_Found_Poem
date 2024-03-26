

let w = 800;
let h = 800;
let spacer = 15;
let numRows;
let numCols;
let rowConts;
let colConts;

let poem;

let tried = false;

let lastTime;

let green = 0;

let baseFSize = 20;

let petalCount = 10;
let hue = 20;
let hueDirection = true;


const directions = [-1, 1];

let fillColor = [-1,-1,-1];
let fillDirection = [0, 0, 0];
let petal;
let rotation = 0;


class line {
  constructor(type, ind, contents, speed) {
    this.contents = contents;
    this.type = type;
    this.maxWidth = textWidth(contents) * 2;
    this.maxHeight = textWidth(contents) * 5;
    this.x = 0 - this.maxWidth;;
    this.y = 0 - this.maxHeight;
    this.xOffset = (int) (random(spacer * 0.5));
    this.yOffset = (int) (random(spacer * 0.5));
    this.speed = speed;
    this.ind = ind;
    this.fsize = (int) (random(10)) - 5 + baseFSize;

    if (this.type == 0) {
      this.y = (ind + 1) * spacer + this.yOffset; 
    } else if (this.type == 1) { 
      this.x = ind * spacer + this.xOffset;
      this.maxWidth = textWidth("w");
      this.y = 0 - h;
    }
    
  }

  drawLine() {
    //console.log(this.x);
    textSize(this.fsize);
    text(this.contents, this.x, this.y, this.maxWidth, this.maxHeight);
    if (this.type == 0) {
      this.x += this.speed;
      if (this.x > w) {
        rowConts[this.ind] = null;
      }
    } else if (this.type == 1) { 
      this.y += this.speed;
      if (this.y > h) {
        colConts[this.ind] = null;
      }
    }
  }
}

function preload() {
  poem = loadStrings('poem.txt');

}

function setup() {
  createCanvas(w, h);
  //newLine(0, 0); 
  numRows = (int) (h / spacer);
  numCols = (int) (w / spacer);
  rowConts = new Array(numRows);
  colConts = new Array(numCols);
  textSize(baseFSize);
  lastTime = millis();
  initiateColor();
}

function draw() {
  clear()
  changeHue();
  //background(220);
  //console.log((int) (millis() % 200));
  //console.log(millis() - lastTime);
  if (millis() - lastTime >= 100 && random() > 0.5) {
    if (!tried) {
      tried = true;
      //console.log("new line attempted");
      var type = (int) (random(2));
      if (type == 0) {
        newLine(type, (int) (random(numRows)));
      } else if (type == 1) {
        newLine(type, (int) (random(numCols)));
      }
      lastTime = millis();
    }
  } else {
    tried = false;
  }
  drawBackground();
  //drawSphere();

  push();
    angleMode(DEGREES);
    imageMode(CENTER);

    generatePetal();

    translate(width * 0.5, height * 0.5);

    drawPetals(10, rotation);

    
    noStroke();
    push();
      colorMode(HSB);
      fill(hue, 100, 100);
      //fill(fillColor[0], fillColor[1], fillColor[2]);
      circle(0, 0, width * 0.585) //0.398 for 5
    pop();
    stroke(1);
    rotation += 0.1;
    
    changeColor();
  pop();

  drawLines();
}

function newLine(type, ind) {
  //console.log("new line entered");
  //0 type is row, 1 is col
  //ind is index within that array
  contents = '';
  while (!contents) {
    contents = random(poem);
  }
  
  //console.log(contents);
  if (type == 0) {
    //console.log("creating row");
    if (ind < rowConts.length && rowConts[ind] == null) {
      rowConts[ind] = new line(type, ind, contents, (int) (random(5)) + 1);
    }
  } else if (type == 1) {
    //console.log("creating col");
    if (ind < colConts.length && colConts[ind] == null) {
      colConts[ind] = new line(type, ind, contents, (int) (random(5)) + 1);
    }
  }
  //console.log(rowConts + " " + colConts);
}

function drawLines() {
  //console.log(rowConts);
  
  for (var i = 0; i < rowConts.length; i++) {
    if(rowConts[i] != null) {
      rowConts[i].drawLine();
    }
  }
  for (var i = 0; i < colConts.length; i++) {
    if (colConts[i] != null) {
      colConts[i].drawLine();
    }
  }
}

function drawBackground() {
  var totalObjects = 0;
  for (var i = 0; i < rowConts.length; i++) {
    if(rowConts[i] != null) {
      totalObjects++;
    }
  }
  for (var i = 0; i < colConts.length; i++) {
    if (colConts[i] != null) {
      totalObjects++;
    }
  } 
  //console.log(totalObjects);
  var greenTarget = map(totalObjects, 0, numRows + numCols, 20, 255);
  updateGreen(greenTarget);
  background(0, green, 0);
}

function updateGreen(greenTarget) {
  if (green > greenTarget) {
    green--;
  } else if (green < greenTarget) {
    green++;
  }
}




function initiateColor() {
  for (var i = 0; i < 3; i++) {
    fillColor[i] = floor(random(256));
    fillDirection[i] = random(directions);
  }
}

function changeColor() {
  let channel = floor(random(3));
  fillColor[channel] += fillDirection[channel];
  if (fillColor[channel] >= 255 || fillColor[channel] <= 0) 
    fillDirection[channel] *= -1;
}

function generatePetal() {
  petal = createGraphics(width, height);
  push();
    petal.colorMode(HSB);
    petal.fill(hue, 100, 100);
    //petal.fill(fillColor[0], fillColor[1], fillColor[2]);
    
    petal.noStroke();
    petal.triangle(width * 0.37, height * 0.5, width * 0.63, height * 0.5, width * 0.5, height * 0.053);
    petal.stroke(1);
    
    petal.arc(width * 0.57, height * 0.5, width * .4, height * 0.95, PI, PI + (0.45 * PI), OPEN);
    petal.arc(width * 0.43, height * 0.5, width * .4, height * 0.95, PI + (0.55 * PI), 0, OPEN);
  pop();
}

function drawPetal(thisRotation) {
  push();
    rotate(thisRotation);
    image(petal, 0, 0, width, height);
  pop();
}

function drawPetals(petalCount, rotation) {
  var angle = 360 / petalCount;
  for (var i = 0; i < petalCount; i++) {
    drawPetal(angle * i + rotation);
  }
}

function changeHue() {
  let mod = 0.1
  if (hue < 65 && hueDirection) {
    hue += mod;
  } else if (hue > 25 && !hueDirection) {
    hue -= mod;
  } else if (hue <= 25) {
    hue += mod;
    hueDirection = true;
  } else if (hue >= 65) {
    hue -= mod; 
    hueDirection = false;
  }
  console.log(hue);
}
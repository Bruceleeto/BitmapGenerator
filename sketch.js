let grid;
let cellSize;
let gridSize = 32;
let outputP;
let inputTextArea;
let loadButton;
let sizeInput;
let setSizeButton;

function setup() {
  createCanvas(windowWidth * 0.8, windowWidth * 0.8); 
  sizeInput = createInput('32', 'number');
  sizeInput.attribute('min', '1');
  sizeInput.attribute('max', '32');

  setSizeButton = createButton('Set Size');
  setSizeButton.mousePressed(() => {
    gridSize = constrain(int(sizeInput.value()), 1, 32);
    cellSize = width / gridSize; 
    resetGrid();
  });

  inputTextArea = createInput('', 'text');
  inputTextArea.size(400);

  loadButton = createButton('Load Code');
  loadButton.mousePressed(loadFromCode);

  outputP = createP();
  cellSize = width / gridSize;
  resetGrid();
}

function resetGrid() {
  grid = new Array(gridSize).fill().map(() => new Array(gridSize).fill(0));
}

function draw() {
  background(255);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 1) {
        fill(0);
      } else {
        fill(255);
      }
      rect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let x = floor(mouseX / cellSize);
    let y = floor(mouseY / cellSize);

    grid[y % gridSize][x % gridSize] = 1 - grid[y % gridSize][x % gridSize];
    generateCode();
  }
}

function generateCode() {
  let codeLines = [];
  for (let i = 0; i < gridSize; i++) {
    let val = 0;
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 1) {
        val |= 1 << (gridSize - 1 - j);
      }
    }
    codeLines.push('0x' + val.toString(16).padStart(4, '0'));
  }
  outputP.html(`static const uint16_t bitmap[${gridSize}] = {${codeLines.join(', ')}};`);
}

function loadFromCode() {
  let code = inputTextArea.value();
  let matches = code.match(/\{([^\}]+)\}/);
  if (matches) {
    let values = matches[1].split(',').map(val => parseInt(val.trim(), 16));
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < gridSize; j++) {
        grid[i][j] = (values[i] & (1 << (gridSize - 1 - j))) ? 1 : 0;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 0.8, windowWidth * 0.8); 
  cellSize = width / gridSize;
}

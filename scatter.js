let L, H;
let labelLength = 16;
let labels = [], lims = [], xyzw = [];
let binfile;

function preload()
{
  //binfile = loadBytes('data.bin');
  binfile = loadBytes('https://cdn.jsdelivr.net/gh/anbarsode/p5viz_testing/data.bin');
  font = loadFont('DMSerifText-Regular.ttf'); // Preload the font. For 3D to work, we need a font file (not a linked font).
}

/*
function readBinaryData()
{
  let buffer = binfile.bytes.buffer;
  xyzw = new Float64Array(buffer);
}
*/

function readBinaryData()
{
  let b = binfile.bytes;
  let offset = 0;

  // --- Read 4 strings (16 bytes each) ---
  for (let i = 0; i < 4; i++) {
    let strBytes = b.slice(offset, offset + labelLength);
    let str = String.fromCharCode(...strBytes).trim();
    labels.push(str.trim());
    offset += labelLength;
  }

  // --- Read next 6 float64s manually (lims) ---
  let buffer = new DataView(new Uint8Array(b.slice(offset, offset + 48)).buffer);
  for (let i = 0; i < 6; i++) {
    lims.push(buffer.getFloat64(i * 8, true));
  }
  offset += 48;

  // --- Remaining bytes: float64 values (xyzw) ---
  let remaining = b.slice(offset);
  let f64Buffer = new Float64Array(new Uint8Array(remaining).buffer);
  xyzw = Array.from(f64Buffer);
}

function fit_xyz_to_canvas(aspect)
{
  let xscale = 1.8 * L / (lims[1] - lims[0]);
  let yscale = 1.8 * H / (lims[3] - lims[2]);
  let zscale = min(xscale, yscale);

  if(aspect === 'equal')
  {
    xscale = zscale;
    yscale = zscale;
  }
  if(aspect !== 'auto' && aspect !== 'equal') return;
  for(let i = 0; i < xyzw.length; i += 4)
  {
    xyzw[i] = (xyzw[i] - 0.5 * lims[1] - 0.5 * lims[0]) * xscale;
    xyzw[i + 1] = (xyzw[i + 1] - 0.5 * lims[3] - 0.5 * lims[2]) * yscale;
    xyzw[i + 2] = (xyzw[i + 2] - lims[4]) * zscale;
  }
}

function setup()
{
  createCanvas(windowWidth,windowHeight,WEBGL);
  L = width * 0.5;
  H = height * 0.5;
  textFont(font);
  readBinaryData();
  fit_xyz_to_canvas('equal');
}

function draw()
{
  lights();
  background('#000000');
  orbitControl(); // enable mouse rotation
  
  ortho();
  scale(1,-1,1);

  axes();

  /*
  let tex = createP();
  tex.style('font-size', '20px')
  tex.style('color', '#FFFFFF');
  tex.position(135, 165);
  katex.render('\\nabla^{2}\\Phi=\\sigma(x)', tex.elt);
  */

  // Scatter points
  for(let i = 0; i < xyzw.length; i += 4)
  {
    //stroke(xyzw[i+3] * 255, 255 * (xyzw[i+3]), 255 * (xyzw[i+3]));
    stroke('white');
    point(xyzw[i], xyzw[i+1], xyzw[i+2]);
  }
}

function axes(){
  colorMode(RGB);
  textSize(32);
  
  stroke(255, 0, 0); // red
  line(-L * 0.9, -H * 0.9, 0, -L * 0.9 + H * 0.5, -H * 0.9, 0);  // first axis
  fill(255, 0, 0);
  push();
  scale(1,-1,1);
  text(labels[0], -L * 0.9 + H * 0.5, H * 0.9);
  pop();

  stroke(0, 255, 0); // green
  line(-L * 0.9, -H * 0.9, 0, -L * 0.9, -H * 0.4, 0);  // second axis
  fill(0, 255, 0);
  push();
  scale(1,-1,1);
  text(labels[1], -L * 0.9, H * 0.4);
  pop();

  stroke(0, 0, 255); // blue
  line(-L * 0.9, -H * 0.9, 0, -L * 0.9, -H * 0.9, H * 0.5);  // third axis
  fill(0, 0, 255);
  push();
  scale(1,-1,1);
  translate(0,0,H * 0.5);
  text(labels[2], -L * 0.9, H * 0.9);
  pop();
}

function keyPressed()
{
  if(key === 'p')
  {
    translate(mouseX, mouseY);
    sphere(40);
    console.log("Hi");
  }
}

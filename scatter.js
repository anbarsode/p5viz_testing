let L, H, PixScale = 40;
let binfile, xyzw, lims;

function preload()
{
  binfile = loadBytes('data.bin');
  //binfile = loadBytes('https://cdn.jsdelivr.net/gh/anbarsode/p5viz_testing/data.bin');
  font = loadFont('DMSerifText-Regular.ttf'); // Preload the font. For 3D to work, we need a font file (not a linked font).
}

function readBinaryData()
{
  let buffer = binfile.bytes.buffer;
  xyzw = new Float64Array(buffer);
}

function setup()
{
  createCanvas(windowWidth,windowHeight,WEBGL);
  L = width * 0.5;
  H = height * 0.5;
  textFont(font);
  readBinaryData();

}

function draw()
{
  lights();
  background('#000000');
  orbitControl(); // enable mouse rotation
  
  //ortho();
  scale(1,-1,1);

  axes();

  /*
  let tex = createP();
  tex.style('font-size', '20px')
  tex.style('color', '#FFFFFF');
  tex.position(135, 165);
  katex.render('\\nabla^{2}\\Phi=\\sigma(x)', tex.elt);
  */

  if (xyzw.length === 0) return;

  // Scatter points
  for(let i = 0; i < xyzw.length; i += 4)
  {
    let x = xyzw[i] * PixScale;
    let y = xyzw[i + 1] * PixScale;
    let z = xyzw[i + 2] * PixScale;
    stroke(xyzw[i+3] * 255, 255 * (xyzw[i+3]), 255 * (xyzw[i+3]));
    point(x, y, z);
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
  text('Red', -L * 0.9 + H * 0.5, H * 0.9);
  pop();

  stroke(0, 255, 0); // green
  line(-L * 0.9, -H * 0.9, 0, -L * 0.9, -H * 0.4, 0);  // second axis
  fill(0, 255, 0);
  push();
  scale(1,-1,1);
  text('Green', -L * 0.9, H * 0.4);
  pop();

  stroke(0, 0, 255); // blue
  line(-L * 0.9, -H * 0.9, 0, -L * 0.9, -H * 0.9, H * 0.5);  // third axis
  fill(0, 0, 255);
  push();
  scale(1,-1,1);
  translate(0,0,H * 0.5);
  text('Blue', -L * 0.9, H * 0.9);
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

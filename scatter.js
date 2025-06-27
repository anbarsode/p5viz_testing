let L;
let datafile, data;

function preload()
{
  datafile = loadBytes('data.bin');
  //datafile = loadBytes('https://cdn.jsdelivr.net/gh/anbarsode/p5viz_testing/data.bin');
}

function setup()
{
  createCanvas(960,540,WEBGL);
  let buffer = datafile.bytes.buffer;
  data = new Float64Array(buffer);
  console.log(data);
  L = width;
}

function draw()
{
  lights();
  background('#000000');
  orbitControl(); // enable mouse rotation
 
  scale(1,-1,1);

  axis();
	
  if (data.length === 0) return;

  // Scatter points
  for(let i = 0; i < data.length; i += 6)
  {
    let x = data[i] * 40;
    let y = data[i + 1] * 40;
    let z = data[i + 2] * 40;
    stroke(data[i+3], data[i+4], data[i+5]);
    point(x, y, z);
  }
}

function axis(){
  colorMode(RGB);
  stroke(255, 0, 0);       // red
  line(0, 0, 0, L, 0, 0);  // first axis
  stroke(0, 255, 0);       // green
  line(0, 0, 0, 0, L, 0);  // second axis
  stroke(0, 0, 255);       // blue
  line(0, 0, 0, 0, 0, L);  // third axis
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

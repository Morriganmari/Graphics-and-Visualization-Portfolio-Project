let gl;
let cube;
let modelViewMatrix;
let projectionMatrix;
let modelViewMatrixLoc;
let projectionMatrixLoc;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
let eye;
let radius = 5;
let theta = 0;
let phi = 0;
let left = -5;
let right = 5;
let ytop = 5;
let bottom = -5;
let near = 1;
let far = 20;
let lightDirection = normalize(vec3(0.0, 0.0, 1.0));
let lightColor = vec3(1.0, 1.0, 1.0);
let useTexture = false;
let texture;

function main() {
  const canvas = document.getElementById('webgl-canvas');
  gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('Unable to initialize WebGL');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  cube = new Cube();
  modelViewMatrixLoc = gl.getUniformLocation(cube.program, 'modelViewMatrix');
  projectionMatrixLoc = gl.getUniformLocation(cube.program, 'projectionMatrix');
  document.getElementById("depthSlider").onchange = function (event) {
    radius = parseFloat(event.target.value);
  };
  document.getElementById("thetaSlider").onchange = function (event) {
    theta = event.target.value * Math.PI / 180.0;
  };
  document.getElementById("phiSlider").onchange = function (event) {
    phi = event.target.value * Math.PI / 180.0;
  };
  document.getElementById("textureCheckbox").onchange = function (event) {
    useTexture = event.target.checked;
  };
  initTexture();
  render();
}
class Cube {
  constructor() {
    this.program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(this.program);

    // Define vertex positions, colors, normals, and indices for each face of the cube
    this.positions = [
      // Front face
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0, 1.0, -1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0
    ];

    this.colors = [
      1.0, 0.0, 0.0, 1.0,  // Front face: red
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,

      0.0, 1.0, 0.0, 1.0,  // Back face: green
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,

      0.0, 0.0, 1.0, 1.0,  // Top face: blue
      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0,

      1.0, 1.0, 0.0, 1.0,  // Bottom face: yellow
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,

      1.0, 0.0, 1.0, 1.0,  // Right face: magenta
      1.0, 0.0, 1.0, 1.0,
      1.0, 0.0, 1.0, 1.0,
      1.0, 0.0, 1.0, 1.0,

      0.0, 1.0, 1.0, 1.0,  // Left face: cyan
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0
    ];

    this.normals = [
      // Front face
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,

      // Back face
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,

      // Top face
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,

      // Bottom face
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,

      // Right face
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,

      // Left face
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0
    ];

    this.texCoords = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back face  
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Top face
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,

      // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      // Right face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Left face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0
    ];

    this.indices = [
      0, 1, 2, 0, 2, 3,   // Front face
      4, 5, 6, 4, 6, 7,   // Back face
      8, 9, 10, 8, 10, 11,   // Top face
      12, 13, 14, 12, 14, 15,   // Bottom face
      16, 17, 18, 16, 18, 19,   // Right face
      20, 21, 22, 20, 22, 23    // Left face
    ];

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

    this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    this.positionAttribute = gl.getAttribLocation(this.program, 'vPosition');
    gl.enableVertexAttribArray(this.positionAttribute);

    this.colorAttribute = gl.getAttribLocation(this.program, 'vColor');
    gl.enableVertexAttribArray(this.colorAttribute);

    this.normalAttribute = gl.getAttribLocation(this.program, 'vNormal');
    gl.enableVertexAttribArray(this.normalAttribute);

    this.texCoordAttribute = gl.getAttribLocation(this.program, 'vTexCoord');
    gl.enableVertexAttribArray(this.texCoordAttribute);
  }
}

function initTexture() {
  texture = gl.createTexture();
  const image = new Image();
  
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  };
  
  image.src = "https://github.com/Morriganmari/images/blob/main/hypnoticImage.png?raw=true";
}
/**
* Animates and renders a single frame of the animation
*/
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  eye = vec3(radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta));
  modelViewMatrix = lookAt(eye, at, up);
  projectionMatrix = ortho(left, right, bottom, ytop, near, far);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  let normalMatrix = transpose(inverse(modelViewMatrix));
  gl.uniformMatrix4fv(gl.getUniformLocation(cube.program, 'normalMatrix'), false, flatten(normalMatrix));
  gl.uniform3fv(gl.getUniformLocation(cube.program, 'lightDirection'), flatten(lightDirection));
  gl.uniform3fv(gl.getUniformLocation(cube.program, 'lightColor'), flatten(lightColor));
  gl.uniform1i(gl.getUniformLocation(cube.program, 'useTexture'), useTexture);
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.positionBuffer);
  gl.vertexAttribPointer(cube.positionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(cube.positionAttribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorBuffer);
  gl.vertexAttribPointer(cube.colorAttribute, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(cube.colorAttribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.normalBuffer);
  gl.vertexAttribPointer(cube.normalAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(cube.normalAttribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.texCoordBuffer);
  gl.vertexAttribPointer(cube.texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(cube.texCoordAttribute);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(cube.program, 'texSampler'), 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);
  gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_SHORT, 0);
  requestAnimationFrame(render);
}
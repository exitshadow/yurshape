var positions = [
    0,  0,
    0,  .5,
    .7, 0
];

function glInit(glCanvas) {
    //let glCanvas = document.getElementById('glCanvas');
    var gl = glCanvas.getContext("webgl");
    if (!gl) {
        console.log("WebGL isn’t supported");
    } else {
        console.log("We’ll do something soon.")
    }

    var vertSrc = document.querySelector("#vertex-shader-2d").textContent;
    var fragSrc = document.querySelector("#fragment-shader-2d").textContent;

    var vert = createShader(gl, gl.VERTEX_SHADER, vertSrc);
    var frag = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);

    var program = createProgram(gl, vert, frag);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // insert function to resize canvas
    // https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);

    // binding position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // passing data to the attribute for getting data out of the position buffer (ARRAY_BUFFER)
    var size = 2;           // 2 components per iteration
    var type = gl.FLOAT;    // data is in 32bit float
    var normalized = false;  // do not normalize the data
    var stride = 0;         // 0 = move forward size of each iteration to get to nex position
    var offset = 0;         // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalized, stride, offset);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        console.log("shader created successfully");
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        console.log("program created successfully");
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

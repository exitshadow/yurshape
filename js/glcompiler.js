function glRender() {
    let glCanvas = document.getElementById('glCanvas');
    let gl = glCanvas.getContext("webgl");
    if (!gl) {
        console.log("WebGL isn’t supported");
    } else {
        console.log("We’ll do something soon.")
    }
}



function createShader(gl, type, source) {
    var shader = gl.createShader(type);
}
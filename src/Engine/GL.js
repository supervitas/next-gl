import fragmentShader from './shaders/example.frag';
import vertexShader from './shaders/example.vert';

import * as glmatrix from 'gl-matrix';

class GL {
	constructor(domElement) {
		this._domElement = domElement;
		this.gl = this._initWebGL();		
  
		if (!this.gl) return;
	
		const shaderProgram = this._initShaderProgram(vertexShader, fragmentShader);
		const programInfo = {
			program: shaderProgram,
			attribLocations: {
				vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
				vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
			},
			uniformLocations: {
				projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
				modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			},
		};

		const buffers = this._initBuffers(this.gl);
		this.drawScene(this.gl, programInfo, buffers);
	}
  
	resize(w, h) {
		this.gl.viewport(0, 0, w, h);
	}

	_initBuffers(gl) {
		const positions = [
			1.0,  1.0,
			-1.0,  1.0,
			1.0, -1.0,
			-1.0, -1.0,
		];
		const positionBuffer = gl.createBuffer();		
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		const colors = [
			1.0,  1.0,  1.0,  1.0,    // white
			1.0,  0.0,  0.0,  1.0,    // red
			0.0,  1.0,  0.0,  1.0,    // green
			0.0,  0.0,  1.0,  1.0,    // blue
		];
			
		const colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

		return {position: positionBuffer, color: colorBuffer};
	}

	_initWebGL() {      
		const gl = this._domElement.getContext('webgl',  { antialias: true}) || this._domElement.getContext('experimental-webgl');
      
		if (!gl) {
			alert('Unable to initialize WebGL. Your browser may not support it.');
			return null;
		}

		return gl;
	}

	_initShaderProgram(vertexShader, fragmentShader) {
		const shaderProgram = this.gl.createProgram();

		const vShader = this._loadShader(this.gl, this.gl.VERTEX_SHADER, vertexShader);
		const fShader = this._loadShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShader);
		
		
		this.gl.attachShader(shaderProgram, vShader);
		this.gl.attachShader(shaderProgram, fShader);
		this.gl.linkProgram(shaderProgram);

		if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
			console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
			return null;
		}
		
		return shaderProgram;
	}

	_loadShader(gl, type, source) {
		const shader = gl.createShader(type);		
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}
	
	drawScene(gl, programInfo, buffers) {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		// Clear the canvas before we start drawing on it.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Create a perspective matrix, a special matrix that is
		// used to simulate the distortion of perspective in a camera.
		// Our field of view is 45 degrees, with a width/height
		// ratio that matches the display size of the canvas
		// and we only want to see objects between 0.1 units
		// and 100 units away from the camera.

		const fieldOfView = 45 * Math.PI / 180;   // in radians
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100.0;
		const projectionMatrix = glmatrix.mat4.create();

		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
		glmatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

		// Set the drawing position to the "identity" point, which is
		// the center of the scene.
		const modelViewMatrix = glmatrix.mat4.create();

		// Now move the drawing position a bit to where we want to
		// start drawing the square.

		glmatrix.mat4.translate(modelViewMatrix,     // destination matrix
			modelViewMatrix,     // matrix to translate
			[-0.0, 0.0, -6.0]);  // amount to translate

		// Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
		{
			const numComponents = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexPosition);
		}

		{
			const numComponents = 4;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexColor,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexColor);
		}

		// Tell WebGL to use our program when drawing
		gl.useProgram(programInfo.program);

		// Set the shader uniforms
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.projectionMatrix,
			false,
			projectionMatrix);
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.modelViewMatrix,
			false,
			modelViewMatrix);	  
	
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);		  
	}
	

}
export {GL};
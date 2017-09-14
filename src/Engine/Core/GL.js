import * as glmatrix from 'gl-matrix';

class GL {
	constructor(domElement) {
		this.test();
		this._domElement = domElement;
		this.gl = this._initWebGL();

		if (!this.gl) return;

		this.realPixels = window.devicePixelRatio || 1;
		this.resize();

		this.rotation = 0.0;
		this._lastDT = 0;

		// const shaderProgram = this._createProgram(
		// 	this._loadShader(this.gl.VERTEX_SHADER, vertexShader),
		// 	this._loadShader(this.gl.FRAGMENT_SHADER, fragmentShader));

		// if (shaderProgram === null) return;
        //
		// this.programInfo = {
		// 	program: shaderProgram,
		// 	attribLocations: {
		// 		vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
		// 		vertexNormal: this.gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
		// 		textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
		// 	},
		// 	uniformLocations: {
		// 		projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
		// 		modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
		// 		normalMatrix: this.gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
		// 		uSampler: this.gl.getUniformLocation(shaderProgram, 'uSampler'),
		// 	},
		// };
        //
		// this.buffers = this._initBuffers();
		// this.texture = this._loadTexture(this.gl, 'src/Engine/test_texture.jpg');

		// this.renderFunc = this.render.bind(this);

		// requestAnimationFrame(this.renderFunc);
	}

	initProgram(vertexShader, fragmentShader){
		return this._createProgram(
			this._loadShader(this.gl.VERTEX_SHADER, vertexShader),
			this._loadShader(this.gl.FRAGMENT_SHADER, fragmentShader)
		);
	}
	test() {
		// const mat = Matrix.identityMatrix4();
	}

	render(dt) {
		dt *= 0.001;
		const deltaTime = dt - this._lastDT;
		this._lastDT = dt;

		this.drawScene(this.programInfo, this.buffers, this.texture, deltaTime);
		requestAnimationFrame(this.renderFunc);
	}

	resize() {
		const canvas = this.gl.canvas;

		const displayWidth = Math.floor(canvas.clientWidth  * this.realPixels);
		const displayHeight = Math.floor(canvas.clientHeight  * this.realPixels);

		if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
			canvas.width  = displayWidth;
			canvas.height = displayHeight;

			this.gl.viewport(0, 0, canvas.width, canvas.height);
		}
	}

	loadTexture(gl, url) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1;
		const height = 1;
		const border = 0;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
			width, height, border, srcFormat, srcType,
			pixel);

		const image = new Image();
		image.onload = () => {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
				srcFormat, srcType, image);
			gl.generateMipmap(gl.TEXTURE_2D);

		};

		image.src = url;

		return texture;
	}

	_initWebGL() {
		const gl = this._domElement.getContext('webgl2', { antialias: true});

		if (!gl) {
			alert('Unable to initialize WebGL. Your browser may not support it.');
			return null;
		}

		gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

		return gl;
	}


	_loadShader(type, source) {
		const shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
			this.gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	_createProgram(vertexShader, fragmentShader) {
		const shaderProgram = this.gl.createProgram();

		this.gl.attachShader(shaderProgram, vertexShader);
		this.gl.attachShader(shaderProgram, fragmentShader);
		this.gl.linkProgram(shaderProgram);

		if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
			console.error(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(shaderProgram)}`);
			return null;
		}

		return shaderProgram;
	}

	drawScene(programInfo, buffers, texture, deltaTime) {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		const fieldOfView = 45 * Math.PI / 180;   // in radians

		const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100.0;
		const projectionMatrix = glmatrix.mat4.create();


		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
		glmatrix.mat4.perspective(projectionMatrix,
			fieldOfView,
			aspect,
			zNear,
			zFar);

		// Set the drawing position to the "identity" point, which is
		// the center of the scene.
		const modelViewMatrix = glmatrix.mat4.create();

		// Now move the drawing position a bit to where we want to
		// start drawing the square.

		glmatrix.mat4.translate(modelViewMatrix,     // destination matrix
			modelViewMatrix,     // matrix to translate
			[0.0, 0.0, -8.0]);  // amount to translate
		glmatrix.mat4.rotate(modelViewMatrix,  // destination matrix
			modelViewMatrix,  // matrix to rotate
			this.rotation,     // amount to rotate in radians
			[0, 0, 1]);       // axis to rotate around (Z)
		glmatrix.mat4.rotate(modelViewMatrix,  // destination matrix
			modelViewMatrix,  // matrix to rotate
			this.rotation * 0.7,// amount to rotate in radians
			[0, 1, 0]);       // axis to rotate around (X)

		const normalMatrix = glmatrix.mat4.create();
		glmatrix.mat4.invert(normalMatrix, modelViewMatrix);
		glmatrix.mat4.transpose(normalMatrix, normalMatrix);

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute
		{
			const numComponents = 3;
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

		// Tell WebGL how to pull out the texture coordinates from
		// the texture coordinate buffer into the textureCoord attribute.
		{
			const numComponents = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
			gl.vertexAttribPointer(
				programInfo.attribLocations.textureCoord,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.textureCoord);
		}

		// Tell WebGL how to pull out the normals from
		// the normal buffer into the vertexNormal attribute.
		{
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexNormal,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexNormal);
		}

		// Tell WebGL which indices to use to index the vertices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

		// Tell WebGL to use our program when drawing

		this.gl.useProgram(programInfo.program);

		// Set the shader uniforms

		this.gl.uniformMatrix4fv(
			programInfo.uniformLocations.projectionMatrix,
			false,
			projectionMatrix);
		this.gl.uniformMatrix4fv(
			programInfo.uniformLocations.modelViewMatrix,
			false,
			modelViewMatrix);
		this.gl.uniformMatrix4fv(
			programInfo.uniformLocations.normalMatrix,
			false,
			normalMatrix);

		// Specify the texture to map onto the faces.

		// Tell WebGL we want to affect texture unit 0
		this.gl.activeTexture(this.gl.TEXTURE0);

		// Bind the texture to texture unit 0
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

		// Tell the shader we bound the texture to texture unit 0
		this.gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

		{
			const vertexCount = 36;
			const type = this.gl.UNSIGNED_SHORT;
			const offset = 0;
			this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
		}

		// Update the rotation for the next draw

		this.rotation += deltaTime;
	}
}
export {GL};

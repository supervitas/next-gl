import {SceneObject} from '../../Core/SceneObject';

import fragmentShader from './shaders/example.frag';
import vertexShader from './shaders/example.vert';

class Cube extends SceneObject {
	constructor(gl) {
		super(gl);

		this.program = this.gl.initProgram(vertexShader, fragmentShader);

		const gl2 = this.gl.gl;

		this.programInfo = {
			program: this.program,
			attribLocations: {
				vertexPosition: gl2.getAttribLocation(this.program, 'aVertexPosition'),
				vertexNormal: gl2.getAttribLocation(this.program, 'aVertexNormal'),
				textureCoord: gl2.getAttribLocation(this.program, 'aTextureCoord'),
			},
			uniformLocations: {
				projectionMatrix: gl2.getUniformLocation(this.program, 'uProjectionMatrix'),
				modelViewMatrix: gl2.getUniformLocation(this.program, 'uModelViewMatrix'),
				normalMatrix: gl2.getUniformLocation(this.program, 'uNormalMatrix'),
				uSampler: gl2.getUniformLocation(this.program, 'uSampler'),
			},
		};

		this._initBuffersAndVao();

		this.texture = this.gl.loadTexture(gl2, 'src/Engine/Primitives/Cube/test_texture.jpg');
	}

	_initBuffersAndVao() {
		const gl = this.gl.gl;

		const positionBuffer = gl.createBuffer();

		// Select the positionBuffer as the one to apply buffer
		// operations to from here out.

		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		// Now create an array of positions for the cube.

		const positions = [
			// Front face
			-1.0, -1.0,  1.0,
			1.0, -1.0,  1.0,
			1.0,  1.0,  1.0,
			-1.0,  1.0,  1.0,

			// Back face
			-1.0, -1.0, -1.0,
			-1.0,  1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0, -1.0, -1.0,

			// Top face
			-1.0,  1.0, -1.0,
			-1.0,  1.0,  1.0,
			1.0,  1.0,  1.0,
			1.0,  1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0,  1.0,
			-1.0, -1.0,  1.0,

			// Right face
			1.0, -1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0,  1.0,  1.0,
			1.0, -1.0,  1.0,

			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0,
			-1.0,  1.0,  1.0,
			-1.0,  1.0, -1.0,
		];

		// Now pass the list of positions into WebGL to build the
		// shape. We do this by creating a Float32Array from the
		// JavaScript array, then use it to fill the current buffer.

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		// Set up the normals for the vertices, so that we can compute lighting.

		const normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

		const vertexNormals = [
			// Front
			0.0,  0.0,  1.0,
			0.0,  0.0,  1.0,
			0.0,  0.0,  1.0,
			0.0,  0.0,  1.0,

			// Back
			0.0,  0.0, -1.0,
			0.0,  0.0, -1.0,
			0.0,  0.0, -1.0,
			0.0,  0.0, -1.0,

			// Top
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,

			// Bottom
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,

			// Right
			1.0,  0.0,  0.0,
			1.0,  0.0,  0.0,
			1.0,  0.0,  0.0,
			1.0,  0.0,  0.0,

			// Left
			-1.0,  0.0,  0.0,
			-1.0,  0.0,  0.0,
			-1.0,  0.0,  0.0,
			-1.0,  0.0,  0.0
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

		// Now set up the texture coordinates for the faces.

		const textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

		const textureCoordinates = [
			// Front
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
			// Back
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
			// Top
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
			// Bottom
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
			// Right
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
			// Left
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

		// Build the element array buffer; this specifies the indices
		// into the vertex arrays for each face's vertices.

		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		// This array defines each face as two triangles, using the
		// indices into the vertex array to specify each triangle's
		// position.

		const indices = [
			0,  1,  2,      0,  2,  3,    // front
			4,  5,  6,      4,  6,  7,    // back
			8,  9,  10,     8,  10, 11,   // top
			12, 13, 14,     12, 14, 15,   // bottom
			16, 17, 18,     16, 18, 19,   // right
			20, 21, 22,     20, 22, 23,   // left
		];

		// Now send the element array to GL

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		gl.activeTexture(gl.TEXTURE0);

		// Bind the texture to texture unit 0
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		// Tell the shader we bound the texture to texture unit 0
		gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

		{
			const vertexCount = 36;
			const type = gl.UNSIGNED_SHORT;
			const offset = 0;
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
		}


		// -- Init VAO
		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute
		{

			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

			gl.vertexAttribPointer(
				this.programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
		}

		// Tell WebGL how to pull out the texture coordinates from
		// the texture coordinate buffer into the textureCoord attribute.
		{
			const numComponents = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.vertexAttribPointer(
				this.programInfo.attribLocations.textureCoord,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);
		}



		// Tell WebGL how to pull out the normals from
		// the normal buffer into the vertexNormal attribute.
		{
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.vertexAttribPointer(
				this.programInfo.attribLocations.vertexNormal,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexNormal);
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		gl.bindVertexArray(null);

	}
}
export {Cube};


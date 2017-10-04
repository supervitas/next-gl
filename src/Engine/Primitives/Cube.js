import {SceneObject} from '../Core/SceneObject';
import {StandardMaterial} from '../Core/Materials/StandardMaterial';
import twgl from 'twgl-base.js';

class Cube extends SceneObject {
	constructor({gl, material = new StandardMaterial({gl})}) {
		super({gl, material});

		this.programInfo = {
			// attribLocations: {
			// 	vertexPosition: this.glContext.getAttribLocation(this.program, 'aVertexPosition'),
			// 	vertexNormal: this.glContext.getAttribLocation(this.program, 'aVertexNormal'),
			// 	textureCoord: this.glContext.getAttribLocation(this.program, 'aTextureCoord'),
			// },
			// uniformLocations: {
			// 	modelViewMatrix: this.glContext.getUniformLocation(this.program, 'uModelViewMatrix'),
			// 	normalMatrix: this.glContext.getUniformLocation(this.program, 'uNormalMatrix'),
			// 	color: this.glContext.getUniformLocation(this.program, 'uColor'),
			// 	map: material.map !== null ? this.glContext.getUniformLocation(this.program, 'map') : null
			// },
			uniformSetters : twgl.createUniformSetters(gl.glContext, this.program),
			attribSetters: twgl.createAttributeSetters(gl.glContext, this.program)
		};
		// var uniformSetters = twgl.createUniformSetters(gl.glContext, this.program);
		// var attribSetters  = twgl.createAttributeSetters(gl.glContext, this.program);

		this.vertexCount = 36;
		this.type = this.glContext.UNSIGNED_SHORT;
		this.offset = 0;

		const positions = this._getPosition();

		const vertexNormals = this._getVertexNormals();

		const uv = this._getUV();

		const indices = this._getIndices();

		const arrays = {
			position: { numComponents: 3, data: positions },
			uv: { numComponents: 2, data: uv},
			normal:   { numComponents: 3, data: vertexNormals},
			indices:  { numComponents: 3, data: indices},
		};
				
		const bufferInfo = twgl.createBufferInfoFromTypedArray(this.glContext, arrays);		
 		this.vao = twgl.createVAOFromBufferInfo(this.glContext, this.programInfo.attribSetters, bufferInfo);


		// this.vao = this._initBuffersAndVao();
	}
	_getIndices() {
		return [
			0,  1,  2,      0,  2,  3,    // front
			4,  5,  6,      4,  6,  7,    // back
			8,  9,  10,     8,  10, 11,   // top
			12, 13, 14,     12, 14, 15,   // bottom
			16, 17, 18,     16, 18, 19,   // right
			20, 21, 22,     20, 22, 23,   // left
		];
	}
	_getUV() {
		return [
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
	}
	_getVertexNormals() {
		return [
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
	}

	_getPosition() {
		return [
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
	}
	

	_initBuffersAndVao() {
		const gl = this.glContext;

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

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

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

		const normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

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

		const textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);


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

		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		// -- Init VAO
		const vao = gl.createVertexArray();
		gl.bindVertexArray(vao);

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute
		{

			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;

			gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.vertexAttribPointer(
				this.programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset);
		}

		// Tell WebGL how to pull out the texture coordinates from
		// the texture coordinate buffer into the textureCoord attribute.
		{
			const numComponents = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;

			gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);
			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.vertexAttribPointer(
				this.programInfo.attribLocations.textureCoord,
				numComponents,
				type,
				normalize,
				stride,
				offset);
		}



		// Tell WebGL how to pull out the normals from
		// the normal buffer into the vertexNormal attribute.
		{
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;

			gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexNormal);
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.vertexAttribPointer(
				this.programInfo.attribLocations.vertexNormal,
				numComponents,
				type,
				normalize,
				stride,
				offset);
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		gl.bindVertexArray(null);

		return vao;
	}
}
export {Cube};

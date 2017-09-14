import * as glmatrix from 'gl-matrix';

class Renderer {
	constructor({glContext, scene}) {
		this._glContext = glContext;
		this._scene = scene;
		this.rotation = 0;
	}
	drawScene() {
		this._glContext.clear(this._glContext.COLOR_BUFFER_BIT | this._glContext.DEPTH_BUFFER_BIT);

		const fieldOfView = 45 * Math.PI / 180;   // in radians

		const aspect = this._glContext.canvas.clientWidth / this._glContext.canvas.clientHeight;
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

		for (const renderObject of this._scene.sceneObjects) {

			if (!renderObject.visible) continue;

			this._glContext.bindVertexArray(renderObject.vao);

			this._glContext.useProgram(renderObject.program);


			this._glContext.uniformMatrix4fv(
				renderObject.programInfo.uniformLocations.projectionMatrix,
				false,
				projectionMatrix);
			this._glContext.uniformMatrix4fv(
				renderObject.programInfo.uniformLocations.modelViewMatrix,
				false,
				modelViewMatrix);
			this._glContext.uniformMatrix4fv(
				renderObject.programInfo.uniformLocations.normalMatrix,
				false,
				normalMatrix);


			if (renderObject.texture) {
				this._glContext.activeTexture(this._glContext.TEXTURE0);

				// Bind the texture to texture unit 0
				this._glContext.bindTexture(this._glContext.TEXTURE_2D, renderObject.texture);

				// Tell the shader we bound the texture to texture unit 0
				this._glContext.uniform1i(renderObject.programInfo.uniformLocations.uSampler, 0);

				{
					const vertexCount = 36;
					const type = this._glContext.UNSIGNED_SHORT;
					const offset = 0;
					this._glContext.drawElements(this._glContext.TRIANGLES, vertexCount, type, offset);
				}
			}
		}
	}
}
export {Renderer};

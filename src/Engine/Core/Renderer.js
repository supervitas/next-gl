import * as glmatrix from 'gl-matrix';

class Renderer {
	constructor({glContext, scene}) {
		this._glContext = glContext;
		this._scene = scene;
	}
	drawScene() {
		this._glContext.clear(this._glContext.COLOR_BUFFER_BIT | this._glContext.DEPTH_BUFFER_BIT);

		const fieldOfView = 45 * Math.PI / 180;   // in radians

		const aspect = this._glContext.canvas.clientWidth / this._glContext.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100.0;
		const projectionMatrix = glmatrix.mat4.create();

		glmatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);


		for (const renderObject of this._scene.sceneObjects) {

			if (!renderObject.visible) continue;

			const modelViewMatrix = renderObject.modelViewMatrix;

			const normalMatrix = glmatrix.mat4.create();
			glmatrix.mat4.invert(normalMatrix, modelViewMatrix);
			glmatrix.mat4.transpose(normalMatrix, normalMatrix);

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

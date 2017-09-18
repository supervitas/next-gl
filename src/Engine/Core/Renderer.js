import * as glmatrix from 'gl-matrix';

class Renderer {
	constructor({glContext, scene, camera}) {
		this._glContext = glContext;
		this._scene = scene;
		this._camera = camera;
	}

	drawScene() {
		this._glContext.clear(this._glContext.COLOR_BUFFER_BIT | this._glContext.DEPTH_BUFFER_BIT);

		const viewProjectionMatrix = this._camera.viewProjectionMatrix;


		for (const sceneObject of this._scene.sceneObjects.values()) { // for programs in sceneObjects..

			this._glContext.useProgram(sceneObject.program);

			for (const renderObject of sceneObject.renderables) { // render objects with same program at once

				const modelViewMatrix = renderObject.modelViewMatrix;

				// if()

				if (!renderObject.visible) continue;


				const normalMatrix = glmatrix.mat4.create();
				glmatrix.mat4.invert(normalMatrix, modelViewMatrix);
				glmatrix.mat4.transpose(normalMatrix, normalMatrix);

				this._glContext.bindVertexArray(renderObject.vao);


				this._glContext.uniformMatrix4fv(
					renderObject.programInfo.uniformLocations.viewProjectionMatrix,
					false,
					viewProjectionMatrix);
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
				}


				this._glContext.drawElements(this._glContext.TRIANGLES, renderObject.vertexCount, renderObject.type, renderObject.offset);
			}
		}
	}

	shouldBeFrustrumCulled(viewProjection, objectPosition) {
		const mat = glmatrix.mat4.create();

		glmatrix.mat4.multiply(mat, viewProjection,[objectPosition.x,objectPosition.y,objectPosition.z, 1]);
		return abs(Pclip.x) < Pclip.w &&
			abs(Pclip.y) < Pclip.w &&
			0 < Pclip.z &&
			Pclip.z < Pclip.w;
	}
}
export {Renderer};

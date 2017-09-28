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

		const modelViewMatrix = glmatrix.mat4.create();

		for (const sceneObject of this._scene.sceneObjects.values()) { // for programs in sceneObjects..

			this._glContext.useProgram(sceneObject.program);

			for (const renderObject of sceneObject.renderables) { // render objects with same program at once
				if (!renderObject.visible) continue;

				this._useMaterialDepthTest(renderObject.material.depthTest);

				const modelMatrix = renderObject.modelMatrix;

				const normalMatrix = glmatrix.mat4.create();
				glmatrix.mat4.invert(normalMatrix, modelMatrix);
				glmatrix.mat4.transpose(normalMatrix, normalMatrix);

				glmatrix.mat4.multiply(modelViewMatrix, viewProjectionMatrix, modelMatrix);

				this._glContext.bindVertexArray(renderObject.vao);

				this._glContext.uniformMatrix4fv(
					renderObject.programInfo.uniformLocations.modelViewMatrix,
					false,
					modelViewMatrix);

				this._glContext.uniformMatrix4fv(
					renderObject.programInfo.uniformLocations.normalMatrix,
					false,
					normalMatrix);

				if (renderObject.material.map) {
					this._glContext.activeTexture(this._glContext.TEXTURE0);

					// Bind the texture to texture unit 0
					this._glContext.bindTexture(this._glContext.TEXTURE_2D, renderObject.material.map);

					// Tell the shader we bound the texture to texture unit 0
					this._glContext.uniform1i(renderObject.programInfo.uniformLocations.map, 0);
				}


				this._glContext.uniform4f(renderObject.programInfo.uniformLocations.color,
					renderObject.material.color.r,
					renderObject.material.color.g,
					renderObject.material.color.b,
					renderObject.material.color.a);

				this._glContext.drawElements(this._glContext.TRIANGLES, renderObject.vertexCount, renderObject.type, renderObject.offset);
			}
		}
	}

	_useMaterialDepthTest(useDepthTest) {
		if (this._glContext.getParameter(this._glContext.DEPTH_TEST) === useDepthTest) return;

		useDepthTest ? this._glContext.enable(this._glContext.DEPTH_TEST) : this._glContext.disable(this._glContext.DEPTH_TEST);
	}

	shouldBeFrustrumCulled(viewProjection, objectPosition) {

	}
}
export {Renderer};

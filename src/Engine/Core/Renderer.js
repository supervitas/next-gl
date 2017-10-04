import * as glmatrix from 'gl-matrix';
import twgl from 'twgl-base.js';

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

				renderObject.programInfo.uniformSetters.uModelViewMatrix(modelViewMatrix);
				renderObject.programInfo.uniformSetters.uNormalMatrix(normalMatrix);
				renderObject.programInfo.uniformSetters.uColor([
					renderObject.material.color.r,
					renderObject.material.color.g,
					renderObject.material.color.b,
					renderObject.material.color.a
				]);

				if (renderObject.material.map) {
					renderObject.programInfo.uniformSetters.map(renderObject.material.map);
				}


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

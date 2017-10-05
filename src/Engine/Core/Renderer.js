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

				this._depthTest(renderObject.material.depthTest);

				glmatrix.mat4.multiply(modelViewMatrix, viewProjectionMatrix, renderObject.modelMatrix);

				this._glContext.bindVertexArray(renderObject.vao);

				this._updateRenderableUniforms(renderObject, {normalMatrix: renderObject.normalMatrix, modelViewMatrix});

				twgl.drawBufferInfo(this._glContext, renderObject.bufferInfo);
			}
		}
	}

	_updateRenderableUniforms(renderObject, {normalMatrix, modelViewMatrix}) {
		renderObject.uniforms.uNormalMatrix = normalMatrix;
		renderObject.uniforms.uModelViewMatrix = modelViewMatrix;
		renderObject.uniforms.uColor = [
			renderObject.material.color.r,
			renderObject.material.color.g,
			renderObject.material.color.b,
			renderObject.material.color.a
		];

		if (renderObject.material.map) {
			renderObject.uniforms.map = renderObject.material.map;
		}
		twgl.setUniforms(renderObject.programInfo.uniformSetters, renderObject.uniforms);
	}

	_depthTest(useDepthTest) {
		if (this._glContext.getParameter(this._glContext.DEPTH_TEST) === useDepthTest) return;

		useDepthTest ? this._glContext.enable(this._glContext.DEPTH_TEST) : this._glContext.disable(this._glContext.DEPTH_TEST);
	}
	

	shouldBeFrustrumCulled(viewProjection, objectPosition) {

	}
}
export {Renderer};

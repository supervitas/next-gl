import * as glmatrix from 'gl-matrix';
import twgl from 'twgl-base.js';

class Renderer {
	constructor({glContext, scene, camera}) {
		this._glContext = glContext;
		this._scene = scene;
		this._camera = camera;

		this._glDepthTest = this._glContext.getParameter(this._glContext.DEPTH_TEST);
		this._glCullFace = this._glContext.getParameter(this._glContext.CULL_FACE);
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
				this._useFaceCulluing(renderObject.material.isDoubleSided);

				renderObject.updateWorldMatrix();

				glmatrix.mat4.multiply(modelViewMatrix, viewProjectionMatrix, renderObject.worldMatrix);

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
		if (this._glDepthTest === useDepthTest) return;

		this._glDepthTest = useDepthTest;
		useDepthTest ? this._glContext.enable(this._glContext.DEPTH_TEST) : this._glContext.disable(this._glContext.DEPTH_TEST);
	}
	_useFaceCulluing(isDoubleSided) {
		if (this._glCullFace === isDoubleSided) return;

		this._glCullFace = isDoubleSided;
		isDoubleSided ? this._glContext.disable(this._glContext.CULL_FACE) : this._glContext.enable(this._glContext.CULL_FACE);
	}


	shouldBeFrustrumCulled(viewProjection, objectPosition) {

	}
}
export {Renderer};

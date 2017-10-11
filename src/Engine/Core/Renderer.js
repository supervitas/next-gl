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

		this._updateWorldMatixForSceneObjects();

		const viewProjectionMatrix = this._camera.viewProjectionMatrix;

		const modelViewMatrix = glmatrix.mat4.create();

		for (const [program, renderable] of this._scene.renderablesByProgram.entries()) {

			this._glContext.useProgram(program);

			for (const sceneObject of renderable.sceneObjects) {
				if (!sceneObject.visible) continue;

				this._depthTest(sceneObject.material.depthTest);
				this._useFaceCulluing(sceneObject.material.isDoubleSided);

				glmatrix.mat4.multiply(modelViewMatrix, viewProjectionMatrix, sceneObject.worldMatrix);

				this._glContext.bindVertexArray(sceneObject.vao);

				this._updateRenderableUniforms(sceneObject, {normalMatrix: sceneObject.normalMatrix, modelViewMatrix});

				twgl.drawBufferInfo(this._glContext, sceneObject.bufferInfo);
			}
		}
	}

	_updateWorldMatixForSceneObjects() {
		for (const sceneObject of this._scene.sceneObjects.values()) {
			sceneObject.updateWorldMatrix();
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

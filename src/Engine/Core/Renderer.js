import twgl from 'twgl-base.js';

class Renderer {
	constructor({gl}) {
		this._gl = gl;
		this._glContext = gl.glContext;

		this._glDepthTest = this._glContext.getParameter(this._glContext.DEPTH_TEST);
		this._glCullFace = this._glContext.getParameter(this._glContext.CULL_FACE);
	}

	drawScene(scene, camera, target = null) {
		if (target) { // render to texture
			this._glContext.viewport(0, 0, target.width, target.height);
			// this._glContext.disable(this._glContext.BLEND);
			// this._glContext.blendFunc(this._glContext.SRC_ALPHA, this._glContext.ONE);
			// this._glContext.enable(this._glContext.BLEND);
			target.bindFrameBuffer();
		}

		this._glContext.clear(this._glContext.COLOR_BUFFER_BIT | this._glContext.DEPTH_BUFFER_BIT);

		scene.update(camera);

		this._glContext.disable(this._glContext.BLEND);
		this._glContext.enable(this._glContext.DEPTH_TEST);

		for (const [program, renderable] of scene.renderablesByProgram.entries()) {

			this._glContext.useProgram(program);

			for (const sceneObject of renderable.sceneObjects) {
				if (!sceneObject.visible || sceneObject.material.opacity !== 1) continue;

				this._depthTest(sceneObject.material.depthTest);
				this._useFaceCulluing(sceneObject.material.isDoubleSided);

				this._glContext.bindVertexArray(sceneObject.vao);

				this._updateRenderableUniforms(sceneObject, {normalMatrix: sceneObject.normalMatrix, modelWorldMatrix: sceneObject.worldMatrix});

				twgl.drawBufferInfo(this._glContext, sceneObject.bufferInfo);
			}
		}


		this._glContext.enable(this._glContext.BLEND);
		this._glContext.disable(this._glContext.DEPTH_TEST);

		for (const [program, renderable] of scene.renderablesByProgram.entries()) {

			this._glContext.useProgram(program);

			for (const sceneObject of renderable.sceneObjects) {
				if (!sceneObject.visible || sceneObject.material.opacity === 1) continue;

				this._useFaceCulluing(sceneObject.material.isDoubleSided);
				this._glContext.blendFunc(this._glContext.SRC_ALPHA, this._glContext.ONE); // todo from material

				this._glContext.bindVertexArray(sceneObject.vao);

				this._updateRenderableUniforms(sceneObject, {normalMatrix: sceneObject.normalMatrix, modelWorldMatrix: sceneObject.worldMatrix});

				twgl.drawBufferInfo(this._glContext, sceneObject.bufferInfo);
			}
		}
	}


	_updateRenderableUniforms(renderObject, {normalMatrix, modelWorldMatrix}) {
		renderObject.material.uniforms.uNormalMatrix = normalMatrix;
		renderObject.material.uniforms.uModelWorldMatrix = modelWorldMatrix;

		twgl.setUniforms(renderObject.material.programInfo.uniformSetters, renderObject.material.uniforms);
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


	_shouldBeFrustrumCulled(viewProjection, objectPosition) {

	}
}
export {Renderer};

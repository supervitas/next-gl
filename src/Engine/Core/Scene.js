import {Light} from './Lights/Light';
import {AmbientLight} from './Lights/AmbientLight';
import {DirectLight} from './Lights/DirectLight';

import twgl from 'twgl-base.js';

class Scene {
	constructor(gl) {
		this._gl = gl;
		this.renderablesByProgram = new Map();
		this.sceneObjects = new Map();
		this.lights = [];

		this.UBOData = null;
	}

	addToScene(sceneObject) {
		this.sceneObjects.set(sceneObject.id, sceneObject);

		if (sceneObject instanceof Light) {
			this.lights.push(sceneObject);
		}

		if (!sceneObject.material) return; // empty object

		sceneObject.initObject(this._gl);

		if (!this.UBOData) {
			this._createUBO(sceneObject.material.programInfo);

			for (const light of this.lights) {
				if (light instanceof AmbientLight) {
					this._updateAmbientLightUBO(light);
				}

				else if (light instanceof DirectLight) {
					this._updateDirectLightUBO(light);
				}
			}
		}

		if (this.renderablesByProgram.has(sceneObject.program)) {
			const renderable = this.renderablesByProgram.get(sceneObject.program);
			renderable.sceneObjects.push(sceneObject);
		} else {
			this.renderablesByProgram.set(sceneObject.program, {sceneObjects: [sceneObject]});
		}
	}

	removeFromScene(sceneObject) {
		const object = this.getObjectById(sceneObject.id);

		if (!object) {
			console.warn('Can`t find object in this scene');
			return;
		}

		if (object.material) {
			const renderable = this.renderablesByProgram.get(sceneObject.material.program);
			const index = renderable.sceneObjects.indexOf(sceneObject);
			renderable.sceneObjects.splice(index, 1);
		}

		if (object.children) {
			for (const child of object.children) {
				this.removeFromScene(child);
			}
		}

		this.sceneObjects.delete(sceneObject.id);
	}

	getObjectById(id) {
		return this.sceneObjects.get(id);
	}

	_createUBO(programInfo) {
		this.UBOData = {
			lightUBO: twgl.createUniformBlockInfo(this._gl.glContext, programInfo, 'Lights'),
			projectionMatrixUBO: twgl.createUniformBlockInfo(this._gl.glContext, programInfo, 'Projection'),
			programInfo
		};
	}

	updateProjectionMatrixUBO(projectionMatrix) {
		twgl.setBlockUniforms(this.UBOData.projectionMatrixUBO, {
			uProjectionMatrix: projectionMatrix
		});

		this.updateUBO(this.UBOData.projectionMatrixUBO);
	}

	_updateDirectLightUBO(light) {
		twgl.setBlockUniforms(this.UBOData.lightUBO, {
			'directLight.u_direction': light.direction,
			'directLight.u_color': [light.color.r, light.color.g, light.color.b],
			'directLight.u_intencity': light.intencity
		});

		this.updateUBO(this.UBOData.lightUBO);
	}

	_updateAmbientLightUBO(light) {
		twgl.setBlockUniforms(this.UBOData.lightUBO, {
			'ambientLight.u_color': [light.color.r, light.color.g, light.color.b],
			'ambientLight.u_intencity': light.intencity
		});

		this.updateUBO(this.UBOData.lightUBO);
	}

	updateUBO(ubo) {
		twgl.setUniformBlock(this._gl.glContext, this.UBOData.programInfo, ubo);
		twgl.bindUniformBlock(this._gl.glContext, this.UBOData.programInfo, ubo);
	}
}
export {Scene};


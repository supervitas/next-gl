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

		this.lightUBOInfo = null;
	}

	addToScene(sceneObject) {
		this.sceneObjects.set(sceneObject.id, sceneObject);

		if (sceneObject instanceof Light) {
			this.lights.push(sceneObject);
		}

		if (!sceneObject.material) return; // empty object

		sceneObject.initObject(this._gl);

		if (!this.lightUBO) {
			this._createLightUBO(sceneObject.programInfo);

			for (const light of this.lights) {
				if (light instanceof AmbientLight) {
					// console.log('ambient')
				}

				if (light instanceof DirectLight) {
					this._updateDirectLight(light);
				}
			}
		}

		if (this.renderablesByProgram.has(sceneObject.material.program)) {
			const renderable = this.renderablesByProgram.get(sceneObject.program);
			renderable.sceneObjects.push(sceneObject);
		} else {
			this.renderablesByProgram.set(sceneObject.material.program, {sceneObjects: [sceneObject]});
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

	_createLightUBO(programInfo) {
		this.lightUBOInfo = {
			ubo: twgl.createUniformBlockInfo(this._gl.glContext, programInfo, 'Lights'),
			programInfo
		};
	}

	_updateDirectLight(light) {

		twgl.setBlockUniforms(this.lightUBOInfo.ubo, {
			'directLight.u_direction': light.direction,
			'directLight.u_color': [light.color.r, light.color.g, light.color.b],
			'directLight.u_intencity': light.intencity
		});

		twgl.setUniformBlock(this._gl.glContext, this.lightUBOInfo.programInfo, this.lightUBOInfo.ubo);
		twgl.bindUniformBlock(this._gl.glContext, this.lightUBOInfo.programInfo, this.lightUBOInfo.ubo);
	}
}
export {Scene};


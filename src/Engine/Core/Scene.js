import {Light} from './Lights/Light';
import {AmbientLight} from './Lights/AmbientLight';
import {DirectLight} from './Lights/DirectLight';
import {PointLight} from './Lights/PointLight';

import twgl from 'twgl-base.js';
import {SpotLight} from './Lights/SpotLight';

class Scene {
	constructor(gl) {
		this._gl = gl;
		this.renderablesByProgram = new Map();
		this.sceneObjects = new Map();
		this.UBOData = new Map();

		this.lights = new Map();
		this.lights.set('DirectLight', []);
		this.lights.set('SpotLight', []);
		this.lights.set('PointLight', []);
		this.lights.set('AmbientLight', []);
	}

	addToScene(sceneObject) {
		this.sceneObjects.set(sceneObject.id, sceneObject);

		if (sceneObject instanceof Light) {
			this._addLight(sceneObject);
			this._updateLightsUBO();
		}

		if (!sceneObject.material) return; // empty object

		sceneObject.initObject(this._gl);

		if (!this.UBOData.has(sceneObject.material)) {
			this._createUBO(sceneObject.material);
			this._updateLightsUBO();
		}

		if (this.renderablesByProgram.has(sceneObject.material.programInfo.program)) {
			const renderable = this.renderablesByProgram.get(sceneObject.material.programInfo.program);
			renderable.sceneObjects.push(sceneObject);
		} else {
			this.renderablesByProgram.set(sceneObject.material.programInfo.program, {sceneObjects: [sceneObject]});
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

	_addLight(light) {
		let lightArray;

		if (light instanceof AmbientLight) {
			lightArray = this.lights.get('AmbientLight');
		}

		if (light instanceof DirectLight) {
			lightArray = this.lights.get('DirectLight');
		}

		if (light instanceof PointLight) {
			lightArray = this.lights.get('PointLight');
		}

		if (light instanceof SpotLight) {
			lightArray = this.lights.get('SpotLight');
		}

		lightArray.push(light);
	}

	_updateLightsUBO() {
		for (const [lightType, lightsArray] of this.lights.entries()) {
			if (lightType === 'AmbientLight') {
				this._updateAmbientLightUBO(lightsArray);
			}

			if (lightType === 'DirectLight') {
				this._updateDirectLightUBO(lightsArray);
			}

			if (lightType === 'SpotLight') {
				this._updateSpotLightUBO(lightsArray);
			}

			if (lightType === 'PointLight') {
				this._updatePointLightUBO(lightsArray);
			}
		}
	}

	_createUBO(material) {
		this.UBOData.set(material, {
			lightUBO: twgl.createUniformBlockInfo(this._gl.glContext, material.programInfo, 'Lights'),
			vertexPointLightUBO: twgl.createUniformBlockInfo(this._gl.glContext, material.programInfo, 'PointLight'),
			vertexDirectLightUBO: twgl.createUniformBlockInfo(this._gl.glContext, material.programInfo, 'DirectLight'),
			vertexSpotLightUBO: twgl.createUniformBlockInfo(this._gl.glContext, material.programInfo, 'SpotLight'),
			projectionMatrixUBO: twgl.createUniformBlockInfo(this._gl.glContext, material.programInfo, 'Projection'),
			viewPosition: twgl.createUniformBlockInfo(this._gl.glContext, material.programInfo, 'View'),
		});
	}

	updateProjectionMatrixUBO(projectionMatrix) {
		for (const [material, ubos] of this.UBOData.entries()) {
			twgl.setBlockUniforms(ubos.projectionMatrixUBO, {
				uProjectionMatrix: projectionMatrix
			});

			this.updateUBO(material.programInfo, ubos.projectionMatrixUBO);
		}
	}

	updateCameraPositionUBO(position) {
		for (const [material, ubos] of this.UBOData.entries()) {

			twgl.setBlockUniforms(ubos.viewPosition, {
				uViewWorldPosition: position
			});

			this.updateUBO(material.programInfo, ubos.viewPosition);
		}
	}

	_updateDirectLightUBO(light) {
		for (const [material, ubos] of this.UBOData.entries()) {
			for (const [index, dirLight] of light.entries()) {

				twgl.setBlockUniforms(ubos.lightUBO, {
					[`directLight[${index}].u_direction`]: dirLight.direction,
					[`directLight[${index}].u_color`]: [dirLight.color.r, dirLight.color.g, dirLight.color.b],
					[`directLight[${index}].u_intencity`]: dirLight.intencity
				});

				twgl.setBlockUniforms(ubos.vertexDirectLightUBO, {
					[`uDirectLightPosition[${index}]`]: dirLight.position
				});

				this.updateUBO(material.programInfo, ubos.vertexDirectLightUBO);
				this.updateUBO(material.programInfo, ubos.lightUBO);
			}
		}
	}

	_updateAmbientLightUBO(light) {
		for (const [material, ubos] of this.UBOData.entries()) {
			for (const [index, ambientLight] of light.entries()) {
				twgl.setBlockUniforms(ubos.lightUBO, {
					[`ambientLight[${index}].u_color`]: [ambientLight.color.r, ambientLight.color.g, ambientLight.color.b],
					[`ambientLight[${index}].u_intencity`]: ambientLight.intencity
				});

				this.updateUBO(material.programInfo, ubos.lightUBO);
			}
		}
	}

	_updatePointLightUBO(light) {
		for (const [material, ubos] of this.UBOData.entries()) {
			for (const [index, pointLight] of light.entries()) {
				twgl.setBlockUniforms(ubos.lightUBO, {
					[`pointLight[${index}].u_color`]: [pointLight.color.r, pointLight.color.g, pointLight.color.b],
					[`pointLight[${index}].u_intencity`]: pointLight.intencity
				});

				twgl.setBlockUniforms(ubos.vertexPointLightUBO, {
					[`uPointLightPosition[${index}]`]: pointLight.position
				});

				this.updateUBO(material.programInfo, ubos.vertexPointLightUBO);
				this.updateUBO(material.programInfo, ubos.lightUBO);
			}
		}
	}

	_updateSpotLightUBO(light) {
		for (const [material, ubos] of this.UBOData.entries()) {
			for (const [index, spotLight] of light.entries()) {
				twgl.setBlockUniforms(ubos.lightUBO, {
					[`spotLight[${index}].u_color`]: [spotLight.color.r, spotLight.color.g, spotLight.color.b],
					[`spotLight[${index}].u_intencity`]: spotLight.intencity,
					[`spotLight[${index}].u_light_direction`]: spotLight.direction,
					[`spotLight[${index}].u_innerLimit`]: spotLight.innerLimit,
					[`spotLight[${index}].u_outerLimit`]: spotLight.outerLimit
				});

				twgl.setBlockUniforms(ubos.vertexSpotLightUBO, {
					[`uSpotLightPosition[${index}]`]: spotLight.position
				});

				this.updateUBO(material.programInfo, ubos.vertexSpotLightUBO);
				this.updateUBO(material.programInfo, ubos.lightUBO);
			}
		}
	}

	updateUBO(programInfo, ubo) {
		twgl.setUniformBlock(this._gl.glContext, programInfo, ubo);
		twgl.bindUniformBlock(this._gl.glContext, programInfo, ubo);
	}

}
export {Scene};

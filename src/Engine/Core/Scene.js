import {Light} from './Lights/Light';
import {AmbientLight} from './Lights/AmbientLight';
import {DirectLight} from './Lights/DirectLight';
import {PointLight} from './Lights/PointLight';

import twgl from 'twgl-base.js';
import {SpotLight} from './Lights/SpotLight';
import {ShadowRenderer} from './Shadows/ShadowRenderer';
import {DepthMaterial} from "./Materials/DepthMaterial";

class Scene {
	constructor(gl) {
		this._gl = gl;

		this.shadowRT = [];

		this.renderList = new Map();
		this.renderList.set('opaque', new Map());
		this.renderList.set('transparent', new Map());

		this.sceneObjects = new Map();
		this.UBOData = new Map();

		this.lights = new Map();
		this.lights.set('DirectLight', []);
		this.lights.set('SpotLight', []);
		this.lights.set('PointLight', []);
		this.lights.set('AmbientLight', []);

		this._hasLights = false;

		this._materialsWithNoLights = ['DepthMaterial'];
	}

	addToScene(sceneObject) {
		this.sceneObjects.set(sceneObject.id, sceneObject);

		if (sceneObject instanceof Light) {
			this._hasLights = true;

			this._addLight(sceneObject);
			this._updateLightsUBO();
		}

		if (!sceneObject.material) return; // empty object

		sceneObject.initObject(this._gl);

		if (!this.UBOData.has(sceneObject.material)) {
			this._createUBO(sceneObject.material);
			this._updateLightsUBO();
		}


		const renderList = this._getRenderList(sceneObject);

		if (renderList.has(sceneObject.material.programInfo.program)) {
			const renderable = renderList.get(sceneObject.material.programInfo.program);
			renderable.sceneObjects.push(sceneObject);
		} else {
			renderList.set(sceneObject.material.programInfo.program, {
				sceneObjects: [sceneObject],
				material: sceneObject.material
			});
		}
	}

	removeFromScene(sceneObject) {
		const object = this.getObjectById(sceneObject.id);

		if (!object) {
			console.warn('Can`t find object in this scene');
			return;
		}

		if (object.material) {
			const renderList = this._getRenderList(sceneObject);

			const renderable = renderList.get(sceneObject.material.program);
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

	_update(camera) {
		for (const sceneObject of this.sceneObjects.values()) {
			if (sceneObject.updateWorldMatrix) {
				sceneObject.updateWorldMatrix();
			}
		}

		this._updateProjectionMatrixUBO(camera.viewProjectionMatrix);
		this._updateCameraPositionUBO(camera.position.asArray());

		this._updateLightsUBO();
	}

	_addLight(light) {
		let lightArray;

		if (light instanceof AmbientLight) {
			lightArray = this.lights.get('AmbientLight');
		}

		if (light instanceof DirectLight) {
			lightArray = this.lights.get('DirectLight');
			this.shadowRT.push(new ShadowRenderer({gl: this._gl, light}));
			const obj = this.getObjectById('SceneObject5'); // todo remove

			obj.material.uniforms.shadowMap = this.shadowRT[0].shadowMap.target.attachments[0];
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
		if (!this._hasLights) {
			for (const [material, ubos] of this.UBOData.entries()) {
				if (!this._materialsWithNoLights.includes(material.constructor.name)) {
					twgl.setBlockUniforms(ubos.lightUBO, {});
					this._updateUBO(material.programInfo, ubos.lightUBO);
				}
			}
			return;
		}

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
		const ubos = {
			projectionMatrixUBO: twgl.createUniformBlockInfo(this._gl.context, material.programInfo, 'Projection'),
			viewPosition: twgl.createUniformBlockInfo(this._gl.context, material.programInfo, 'View'),
		};

		if (!this._materialsWithNoLights.includes(material.constructor.name)) {
			ubos.lightUBO = twgl.createUniformBlockInfo(this._gl.context, material.programInfo, 'Lights');
		}

		this.UBOData.set(material, ubos);

		for (const ubo of Object.values(ubos)) {
			twgl.setBlockUniforms(ubo, {});
			this._updateUBO(material.programInfo, ubo);
		}
	}

	_bindUBOByMaterial(material) {
		const uboInfo = this.UBOData.get(material);
		Object.values(uboInfo).forEach((ubo) => {
			twgl.setUniformBlock(this._gl.context, material.programInfo, ubo);
		});
	}

	_updateUBO(programInfo, ubo) {
		twgl.setUniformBlock(this._gl.context, programInfo, ubo);
	}

	_iterateUBO(func, excludeMaterials = this._materialsWithNoLights) {
		for (const [material, ubos] of this.UBOData.entries()) {
			if (!excludeMaterials.includes(material.constructor.name)) {
				func(material, ubos);
			}
		}
	}

	_updateProjectionMatrixUBO(projectionMatrix) {
		for (const [material, ubos] of this.UBOData.entries()) {
			twgl.setBlockUniforms(ubos.projectionMatrixUBO, {
				uProjectionMatrix: projectionMatrix,
				uDirectShadowMapMatrix: this.shadowRT[0].shadowCamera.viewProjectionMatrix // todo all direct lights
			});

			this._updateUBO(material.programInfo, ubos.projectionMatrixUBO);
		}
	}

	_updateCameraPositionUBO(position) {
		for (const [material, ubos] of this.UBOData.entries()) {

			twgl.setBlockUniforms(ubos.viewPosition, {
				uViewWorldPosition: position
			});

			this._updateUBO(material.programInfo, ubos.viewPosition);
		}
	}

	_updateDirectLightUBO(light) {
		this._iterateUBO((material, ubos) => {
			for (const [index, dirLight] of light.entries()) {

				twgl.setBlockUniforms(ubos.lightUBO, {
					[`directLight[${index}].u_direction`]: dirLight.direction.asArray(),
					[`directLight[${index}].u_color`]: [dirLight.color.r, dirLight.color.g, dirLight.color.b],
					[`directLight[${index}].u_intencity`]: dirLight.intencity,
					[`directLight[${index}].u_position`]: dirLight.position.asArray()
				});

				this._updateUBO(material.programInfo, ubos.lightUBO);
			}
		});
	}

	_updateAmbientLightUBO(ambientLights) {
		this._iterateUBO((material, ubos) => {
			for (const [index, ambientLight] of ambientLights.entries()) {
				twgl.setBlockUniforms(ubos.lightUBO, {
					[`ambientLight[${index}].u_color`]: [ambientLight.color.r, ambientLight.color.g, ambientLight.color.b],
					[`ambientLight[${index}].u_intencity`]: ambientLight.intencity
				});

				this._updateUBO(material.programInfo, ubos.lightUBO);
			}
		});
	}

	_updatePointLightUBO(pointLights) {
		this._iterateUBO((material, ubos) => {
			for (const [index, pointLight] of pointLights.entries()) {
				twgl.setBlockUniforms(ubos.lightUBO, {
					[`pointLight[${index}].u_color`]: [pointLight.color.r, pointLight.color.g, pointLight.color.b],
					[`pointLight[${index}].u_intencity`]: pointLight.intencity,
					[`pointLight[${index}].u_position`]: pointLight.position.asArray()
				});

				this._updateUBO(material.programInfo, ubos.lightUBO);
			}
		});
	}

	_updateSpotLightUBO(spotLights) {
		this._iterateUBO((material, ubos) => {
			for (const [index, spotLight] of spotLights.entries()) {
				twgl.setBlockUniforms(ubos.lightUBO, {
					[`spotLight[${index}].u_color`]: [spotLight.color.r, spotLight.color.g, spotLight.color.b],
					[`spotLight[${index}].u_intencity`]: spotLight.intencity,
					[`spotLight[${index}].u_position`]: spotLight.position.asArray(),
					[`spotLight[${index}].u_light_direction`]: spotLight.direction.asArray(),
					[`spotLight[${index}].u_innerLimit`]: spotLight.innerLimit,
					[`spotLight[${index}].u_outerLimit`]: spotLight.outerLimit
				});

				this._updateUBO(material.programInfo, ubos.lightUBO);
			}
		});
	}

	_getRenderList(sceneObject) {
		return (sceneObject.material.opacity && sceneObject.material.opacity !== 1) ?
			this.renderList.get('transparent') :
			this.renderList.get('opaque');
	}
}
export {Scene};

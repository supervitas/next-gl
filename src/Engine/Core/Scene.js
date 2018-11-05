import {Light} from './Lights/Light';
import {AmbientLight} from './Lights/AmbientLight';
import {DirectLight} from './Lights/DirectLight';
import {PointLight} from './Lights/PointLight';

import twgl from 'twgl-base.js';
import {SpotLight} from './Lights/SpotLight';
import {ShadowRenderer} from './Shadows/ShadowRenderer';



const noLightsMaterials = ['DepthMaterial'];

class Scene {
	constructor() {
		this._gl = null;
		this.sceneObjects = new Map();
		this.renderList = new Map();
		this.renderList.set('opaque', new Map());
		this.renderList.set('transparent', new Map());


		this.UBOData = new Map();

		this.lights = {directLights: [], spotLights: [], pointLights: [], ambientLights: []};

		this._shadowRT = [];
		
		const self = this;

		this.shadowLights = new Proxy([], {
			set(target, property, value) {
				target[property] = value;
			
				if (value instanceof Light) { // only direct light supported
					self._shadowRT.push(new ShadowRenderer({gl: self._gl, light: value}));
				
					for (const receivers of self.shadowRecievers) {
						for (const shadowRT of self._shadowRT) {  // todo multiple
							receivers.material.uniforms.shadowMap = shadowRT.shadowMap.target.attachments[0];
						}
					}
				}
				
				return true;
			},

			get(target, property) {
				return target[property];
			},
		});

		this.shadowRecievers = new Proxy([], {
			set(target, property, value) {
				target[property] = value;

				for (const shadowRT of self._shadowRT) {  // todo multiple
					value.material.uniforms.shadowMap = shadowRT.shadowMap;
				}

				return true;
			},

			get(target, property) {
				return target[property];
			},
		});
	}

	addToScene(sceneObject) {
		this.sceneObjects.set(sceneObject.id, sceneObject);

		if (sceneObject instanceof Light) {
			this._addLight(sceneObject);
			// this._updateLightsUBO();
		}
	}

	_addToRenderList(sceneObject) {
		const renderList = this._getRenderList(sceneObject);

		if (renderList.has(sceneObject.material.programInfo.program)) {
			const renderable = renderList.get(sceneObject.material.programInfo.program);

			if (!renderable.sceneObjects.includes(sceneObject)) {
				renderable.sceneObjects.push(sceneObject);
			}
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

	_updateMaterials(gl) {
		this._gl = gl;

		for (const sceneObject of this.sceneObjects.values()) {
			if (sceneObject.material && sceneObject.material.needsUpdate) {
				sceneObject.material.initMaterial(gl, this.lights);
				this._addToRenderList(sceneObject);

				if (!this.UBOData.has(sceneObject.material)) {
					this._createUBO(sceneObject.material);
				}
			}

			if (sceneObject.material && !sceneObject.vao) {
				sceneObject._createVao(gl);
			}
		}
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
			lightArray = this.lights.ambientLights;
		}

		if (light instanceof DirectLight) {
			lightArray = this.lights.directLights;
		}

		if (light instanceof PointLight) {
			lightArray = this.lights.pointLights;
		}

		if (light instanceof SpotLight) {
			lightArray = this.lights.spotLights;
		}

		lightArray.push(light);
	}

	_updateLightsUBO() {
		for (const [lightType, lightsArray] of Object.entries(this.lights)) {
			if (lightsArray.length === 0) continue;

			if (lightType === 'ambientLights') {
				this._updateAmbientLightUBO(lightsArray);
			}

			if (lightType === 'directLights') {
				this._updateDirectLightUBO(lightsArray);
			}

			if (lightType === 'spotLights') {
				this._updateSpotLightUBO(lightsArray);
			}

			if (lightType === 'pointLights') {
				this._updatePointLightUBO(lightsArray);
			}
		}
	}

	_createUBO(material) {
		const ubos = {
			projectionMatrixUBO: twgl.createUniformBlockInfo(this._gl.context, material.programInfo, 'Projection'),
			viewPosition: twgl.createUniformBlockInfo(this._gl.context, material.programInfo, 'View'),
		};

		if (!noLightsMaterials.includes(material.constructor.name)) {
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

	_iterateUBO(func, excludeMaterials = noLightsMaterials) {
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
				// uDirectShadowMapMatrix: this._shadowRT[0].shadowCamera.viewProjectionMatrix // todo all direct lights
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
		return sceneObject.material.transparent ?
			this.renderList.get('transparent') :
			this.renderList.get('opaque');
	}
}
export {Scene};

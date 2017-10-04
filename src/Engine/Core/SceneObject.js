import * as glmatrix from 'gl-matrix';
import {Vec3} from '../Math/Vec3';
import twgl from 'twgl-base.js';

class SceneObject {
	constructor({material = null}) {
		this.vao = null;

		this.material = material;
		this.program = material.program;

		this.visible = true;
		this.frustrumCulled = true;

		this._position = new Vec3();
		this._rotationAxis = new Vec3();
		this._scale = new Vec3(1, 1, 1);

		this.modelMatrix = glmatrix.mat4.create();
		this.normalMatrix = glmatrix.mat4.create();
	}

	createObject(gl) {
		this.program = this.material.createMaterial(gl);

		this.programInfo = {
			uniformSetters: twgl.createUniformSetters(gl.glContext, this.program),
			attribSetters: twgl.createAttributeSetters(gl.glContext, this.program)
		};

		this.bufferInfo = twgl.createBufferInfoFromArrays(gl.glContext, this.attributes);
		this.vao = twgl.createVAOFromBufferInfo(gl.glContext, this.programInfo.attribSetters, this.bufferInfo);
	}

	set position(positionVec) {
		Object.keys(positionVec).forEach((key) => {
			this._position[key] = positionVec[key];
		});

		glmatrix.mat4.translate(this.modelMatrix, this.modelMatrix, this._position.asArray());

		this.updateMatrices();
	}

	get position() {
		return this._position;
	}

	set scale(scale) {
		Object.keys(scale).forEach((key) => {
			this._scale[key] = scale[key];
		});

		glmatrix.mat4.scale(this.modelMatrix, this.modelMatrix, this._scale.asArray());

		this.updateMatrices();
	}

	get scale() {
		return this._scale;
	}

	rotate(vecRotateAxis, angle) {
		Object.keys(vecRotateAxis).forEach((key) => {
			this._rotationAxis[key] = vecRotateAxis[key];
		});

		glmatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, angle, this._rotationAxis.asArray());

		this.updateMatrices();
	}

	updateMatrices() {
		this._updateNormalMatrix();
	}

	_updateNormalMatrix() {
		glmatrix.mat4.invert(this.normalMatrix, this.modelMatrix);
		glmatrix.mat4.transpose(this.normalMatrix, this.normalMatrix);
	}

}
export {SceneObject};

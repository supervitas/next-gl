import * as glmatrix from 'gl-matrix';
import {Vec3} from '../Math/Vec3';
import twgl from 'twgl-base.js';

let ID = 0;

class SceneObject {
	constructor({material = null, name = null} = {}) {
		this.id = ID++;
		this.name = name || `SceneObject#${this.id}`;
		this.vao = null;

		if (material) {
			this.material = material;
		}

		this._position = new Vec3();
		this._rotationAxis = new Vec3();
		this._scale = new Vec3(1, 1, 1);

		this.children = [];
		this.parent = null;

		this._visible = true;
		this.frustrumCulled = true;

		this.normalMatrix = glmatrix.mat4.create();

		this.localMatrix = glmatrix.mat4.create();
		this.worldMatrix = glmatrix.mat4.create();
	}

	updateWorldMatrix(parentWorldMatrix) {
		if (parentWorldMatrix) {
			glmatrix.mat4.multiply(this.worldMatrix, parentWorldMatrix, this.localMatrix);
		} else if (!this.parent) {
			glmatrix.mat4.copy(this.worldMatrix, this.localMatrix);
		}

		this.children.forEach((child) => {
			child.updateWorldMatrix(this.worldMatrix);
		});
	}

	setParent(parent) {
		if (this.parent) {
			const index = this.parent.children.indexOf(this);
			if (index !== -1) {
				this.parent.children.splice(index, 1);
			}
		}

		if (parent) {
			parent.children.push(this);
		}

		this.parent = parent;
	}

	removeChild(child) {
		const index = this.children.indexOf(child);

		if (index !== -1) {
			this.children.splice(index, 1);
			child.parent = null;
		}
	}

	initObject(gl) {
		if (!this.material.programInfo) {
			this.material.createMaterial(gl);
		}

		this.bufferInfo = twgl.createBufferInfoFromArrays(gl.glContext, this.attributes);
		this.vao = twgl.createVAOFromBufferInfo(gl.glContext, this.material.programInfo.attribSetters, this.bufferInfo);
	}

	calculateBBox() {


	}

	set position(position) {
		Object.keys(position).forEach((key) => {
			this._position[key] = position[key];
		});

		glmatrix.mat4.fromTranslation(this.localMatrix,  this._position.asArray());

		this.updateMatrices();
	}

	get position() {
		return this._position;
	}

	set visible(isVisible) {
		this._visible = false;
		for (const child of this.children) {
			child.visible = isVisible;
		}
	}

	get visible() {
		return this._visible;
	}

	set scale(scale) {
		Object.keys(scale).forEach((key) => {
			this._scale[key] = scale[key];
		});

		glmatrix.mat4.fromScaling(this.localMatrix, this._scale.asArray());

		this.updateMatrices();
	}

	get scale() {
		return this._scale;
	}

	rotate(vecRotateAxis, angle) {
		Object.keys(vecRotateAxis).forEach((key) => {
			this._rotationAxis[key] = vecRotateAxis[key];
		});

		glmatrix.mat4.fromRotation(this.localMatrix, angle, this._rotationAxis.asArray());

		this.updateMatrices();
	}

	rotateY(angle) {
		glmatrix.mat4.rotate(this.localMatrix, this.localMatrix, angle, [angle > 0 ? 1 : -1, 0, 0]);
		this.updateMatrices();
	}

	rotateX(angle) {
		glmatrix.mat4.rotate(this.localMatrix, this.localMatrix, angle, [0, angle > 0 ? 1 : -1, 0]);
		this.updateMatrices();
	}

	rotateZ(angle) {
		glmatrix.mat4.rotate(this.localMatrix, this.localMatrix, angle, [0, 0, angle > 0 ? 1 : -1]);
		this.updateMatrices();
	}

	updateMatrices() {
		this._updateNormalMatrix();
	}

	_updateNormalMatrix() {
		glmatrix.mat4.invert(this.normalMatrix, this.localMatrix);
		glmatrix.mat4.transpose(this.normalMatrix, this.normalMatrix);
	}
}
export {SceneObject};

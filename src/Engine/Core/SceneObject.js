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

		const that = this;

		this._rotationAxis = new Vec3();
		this.normalMatrix = glmatrix.mat4.create();
		this.localMatrix = glmatrix.mat4.create();
		this.worldMatrix = glmatrix.mat4.create();

		this.position = new Proxy(new Vec3(), {
			set(obj, prop, value) {
				obj[prop] = value;

				that._updateMatrix();
				that.updateMatrices();

				return true;
			}
		});

		this.scale = new Proxy(new Vec3(1, 1, 1), {
			set(obj, prop, value) {
				obj[prop] = value;

				that._updateMatrix();
				that.updateMatrices();

				return true;
			}
		});

		this.children = [];
		this.parent = null;

		this._visible = true;
		this._renderOrder = 0;
		this.frustrumCulled = true;
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


	get renderOrder() {
		return this._renderOrder;
	}

	set renderOrder(ro) {
		this._renderOrder = ro;
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

	rotate(vecRotateAxis, angle) {
		Object.keys(vecRotateAxis).forEach((key) => {
			this._rotationAxis[key] = vecRotateAxis[key];
		});

		glmatrix.mat4.fromRotation(this.localMatrix, angle, this._rotationAxis.asArray());

		this.updateMatrices();
	}

	_updateMatrix() {
		glmatrix.mat4.identity(this.localMatrix);
		glmatrix.mat4.translate(this.localMatrix, this.localMatrix,  this.position.asArray());
		glmatrix.mat4.scale(this.localMatrix, this.localMatrix, this.scale.asArray());

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

import * as glmatrix from 'gl-matrix';
import {GLMath} from '../../Math/GLMath';

class OrthographicCamera {
	constructor({left = 0, right = 0, top = 0, bottom = 0, near = 1, far = 1000 } = {}) {
		this._zNear = near;
		this._zFar = far;
		this._left = left;
		this._right = right;
		this._bottom = bottom;
		this._top = top;

		this._cameraPosition = GLMath.createVec3();

		this.cameraMatrix = glmatrix.mat4.create();
		this.viewProjectionMatrix = glmatrix.mat4.create();
		this._updateProjectionMatrix();
	}

	get zNear() {
		return this._zNear;
	}

	get zFar() {
		return this._zFar;
	}

	set zNear(near) {
		this._zNear = near;
		this._updateProjectionMatrix();
	}

	set zFar(far) {
		this._zFar = far;
		this._updateProjectionMatrix();
	}

	get position() {
		return this._cameraPosition;
	}

	set position(position) {
		Object.keys(position).forEach((key) => {
			this._cameraPosition[key] = position[key];
		});

		glmatrix.mat4.fromTranslation(this.cameraMatrix, this._cameraPosition.asArray());
		this._updateProjectionMatrix();
	}

	_updateProjectionMatrix() {
		glmatrix.mat4.ortho(this.viewProjectionMatrix,
			this._left,
			this._right,
			this._bottom,
			this._top,
			this._zNear, this._zFar);

		glmatrix.mat4.multiply(this.viewProjectionMatrix, this.viewProjectionMatrix, this.cameraMatrix);
	}
}
export {OrthographicCamera};

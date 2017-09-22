import * as glmatrix from 'gl-matrix';
import {GLMath} from '../../Math/GLMath';

class Camera {
	constructor({near = 0.1, far = 1000, aspect = 0, fov = 45}) {

		this._zNear = near;
		this._zFar = far;
		this._aspect = aspect;

		this._lookAtVec = GLMath.createVec3();
		this._cameraPosition = GLMath.createVec3();
		this._rotationAxis = GLMath.createVec3();

		this._fov = GLMath.degToRad(fov);


		this.projectionMatrix = glmatrix.mat4.create();

		this._updateProjectionMatrix();

		this.cameraMatrix = glmatrix.mat4.create();


		this.viewMatrix = glmatrix.mat4.create();

		glmatrix.mat4.invert(this.viewMatrix, this.cameraMatrix);


		this.viewProjectionMatrix = glmatrix.mat4.create();

		glmatrix.mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}

	set zNear(near) {
		this._zNear = near;
		this._updateProjectionAndCamera();
	}

	set zFar(far) {
		this._zFar = far;
		this._updateProjectionAndCamera();
	}

	set fov(fov) {
		this._fov = fov;
		this._updateProjectionAndCamera();
	}

	set aspect(aspect) {
		this._aspect = aspect;
		this._updateProjectionAndCamera();
	}

	set position(positionVec) {
		Object.keys(positionVec).forEach((key) => {
			this._cameraPosition[key] = positionVec[key];
		});

		glmatrix.mat4.translate(this.cameraMatrix, this.cameraMatrix, this._cameraPosition.asArray());
		this._updateCameraMatrix();
	}

	lookAt(vecWhere) {
		Object.keys(vecWhere).forEach((key) => {
			this._lookAtVec[key] = vecWhere[key];
		});

		glmatrix.mat4.lookAt(this.cameraMatrix, this._cameraPosition.asArray(), this._lookAtVec.asArray(), [0, 1, 0]);

		this._updateCameraMatrix();
	}
	rotate(vecRotateAxis, angle) {
		Object.keys(vecRotateAxis).forEach((key) => {
			this._rotationAxis[key] = vecRotateAxis[key];
		});

		glmatrix.mat4.rotate(this.cameraMatrix, this.cameraMatrix, angle, this._rotationAxis.asArray());
		this._updateCameraMatrix();
	}

	_updateProjectionAndCamera() {
		this._updateProjectionMatrix();
		this._updateCameraMatrix();
	}

	_updateProjectionMatrix() {
		glmatrix.mat4.perspective(this.projectionMatrix, this._fov, this._aspect, this._zNear, this._zFar);
	}

	_updateCameraMatrix() {
		glmatrix.mat4.invert(this.viewMatrix, this.cameraMatrix);
		glmatrix.mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}


}
export {Camera};

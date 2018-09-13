import {mat4} from 'gl-matrix';


class CameraOrbitController {
	constructor({camera, canvas}) {
		this._camera = camera;

		this._canvasIsPressed = false;
		this._xRotation = Math.PI / 20;
		this._yRotation = 0;
		this._lastPressX = 0;
		this._lastPressY = 0;

		this._sencitivity = 150;

		canvas.onmousedown = (e) => this._onMouseDown(e);
		canvas.onmouseup = () => this._onMouseUp();
		canvas.onmousemove = (e) => this._onMouseMove(e);
	}

	_onMouseMove(e) {
		if (this._canvasIsPressed) {
			this._xRotation += (e.pageY - this._lastPressY) / this._sencitivity;
			this._yRotation -= (e.pageX - this._lastPressX) / this._sencitivity;

			this._xRotation = Math.min(this._xRotation, Math.PI / 2.5);
			this._xRotation = Math.max(this._xRotation, 0.1);

			this._lastPressX = e.pageX;
			this._lastPressY = e.pageY;

			this._updateCamera();
		}
	}

	_onMouseUp() {
		this._canvasIsPressed = false;
	}

	_onMouseDown(e) {
		this._canvasIsPressed = true;
		this._lastPressX = e.pageX;
		this._lastPressY = e.pageY;
	}

	_updateCamera() {
		const camera = mat4.create();
		mat4.translate(camera, camera, [0, 0, 25]);

		const xRotMatrix = mat4.create();
		const yRotMatrix = mat4.create();

		mat4.rotateX(xRotMatrix, xRotMatrix, -this._xRotation);
		mat4.rotateY(yRotMatrix, yRotMatrix, this._yRotation);
		mat4.multiply( camera, xRotMatrix, camera);
		mat4.multiply(camera, yRotMatrix, camera);
		mat4.targetTo(camera,
			[camera[12], camera[13], camera[14]], [0, 0, 0], [0, 1, 0]);

		this._camera.position.set({x: camera[12], y: camera[13], z: camera[14]});

	}

}
export {CameraOrbitController};

import {mat4} from 'gl-matrix';
import {GLMath} from '../../Math/GLMath';
import {Vec3} from '../../Math/Vec3';


class CameraOrbitController {
	constructor({camera, canvas, target = new Vec3(),
		maxZoom = 100, minZoom = 1,
		zoomSpeed = 0.1, rotationSpeed = 150,
		minPolarAngle = 0.2, maxPolarAngle = Math.PI / 2.5,
		minAzimuthAngle = -Infinity, maxAzimuthAngle = Infinity} = {}) {
		this._camera = camera;

		this.minPolarAngle = minPolarAngle;
		this.maxPolarAngle = maxPolarAngle;

		this.minAzimuthAngle = minAzimuthAngle; // radians
		this.maxAzimuthAngle = maxAzimuthAngle; // radians


		const theta = Math.atan(Math.sqrt(
			(Math.pow(this._camera.position.x, 2) + Math.pow(this._camera.position.y, 2)) / this._camera.position.z ));

		this.theta = GLMath.clamp(theta, minPolarAngle, maxPolarAngle);
		this.phi = GLMath.clamp(Math.atan2(this._camera.position.y, this._camera.position.x), minAzimuthAngle, maxAzimuthAngle);
		this.radius = GLMath.clamp(camera.position.clone().magnitude(), minZoom, maxZoom);


		this._lastData = {
			x: 0,
			y: 0,
		};

		const self = this;
		this._up = [0, 1, 0];
		this._target = target.asArray();

		this.maxZoom = maxZoom;
		this.minZoom = minZoom;
		this.zoomSpeed = zoomSpeed;
		this.sencitivity = rotationSpeed;

		this.upVector = new Proxy(new Vec3(0, 1, 0), {
			set(obj, prop, value) {
				obj[prop] = value;
				self._up = obj.asArray();

				return true;
			},
		});

		this.target = new Proxy(new Vec3(0, 0, 0), {
			set(obj, prop, value) {
				obj[prop] = value;
				self._target = obj.asArray();

				return true;
			},
		});

		this._canvasIsPressed = false;

		canvas.onmousedown = (e) => this._onMouseDown(e);
		canvas.onmouseup = () => this._onMouseUp();
		canvas.onmousemove = (e) => this._onMouseMove(e);
		canvas.onmousemove = (e) => this._onMouseMove(e);
		canvas.addEventListener('wheel', (e) => this._onZoom(e));

		this._updateCamera();
	}

	_onZoom(e) {
		e.preventDefault();

		this.radius = GLMath.clamp(this.radius + e.deltaY * this.zoomSpeed, this.minZoom, this.maxZoom);

		this._updateCamera();
	}

	_onMouseMove(e) {
		if (!this._canvasIsPressed) return;

		this.theta = GLMath.clamp(this.theta + (e.pageY - this._lastData.y) / this.sencitivity,
			this.minPolarAngle , this.maxPolarAngle);
		this.phi = GLMath.clamp(this.phi - (e.pageX - this._lastData.x) / this.sencitivity, this.minAzimuthAngle, this.maxAzimuthAngle);


		this._lastData.x = e.pageX;
		this._lastData.y = e.pageY;


		this._updateCamera();
	}

	_onMouseUp() {
		this._canvasIsPressed = false;
	}

	_onMouseDown(e) {
		this._canvasIsPressed = true;
		this._lastData.x = e.pageX;
		this._lastData.y = e.pageY;
	}

	_updateCamera() {
		const camera = mat4.create();
		mat4.translate(camera, camera, [0, 0, this.radius]);

		const xRotMatrix = mat4.create();
		const yRotMatrix = mat4.create();

		mat4.rotateX(xRotMatrix, xRotMatrix, -this.theta);
		mat4.rotateY(yRotMatrix, yRotMatrix, this.phi);
		mat4.multiply( camera, xRotMatrix, camera);
		mat4.multiply(camera, yRotMatrix, camera);

		mat4.targetTo(camera,
			[camera[12], camera[13], camera[14]], this._target, this._up );

		this._camera.position.set({x: camera[12], y: camera[13], z: camera[14]});

	}

}
export {CameraOrbitController};

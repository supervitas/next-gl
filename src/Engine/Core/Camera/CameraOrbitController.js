import OrbitControls from 'orbit-controls';

class CameraOrbitController {
	constructor({camera, opts = {}}) {
		this._camera = camera;
		this._orbitControls = new OrbitControls(opts);
	}

	_checkEquals(vec, vecArr) {
		return vec.x === vecArr[0] && vec.y === vecArr[1] && vec.z === vecArr[2];
	}

	update() {
		this._orbitControls.update();

		if (!this._checkEquals(this._camera.position, this._orbitControls.position)) {
			this._camera.position.fromArray(this._orbitControls.position);
		}

		if (!this._checkEquals(this._camera.target, this._orbitControls.target)) {
			this._camera.target.fromArray(this._orbitControls.target);
		}
	}
}
export {CameraOrbitController};

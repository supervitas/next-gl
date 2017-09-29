import OrbitControls from 'orbit-controls';

class CameraOrbitController {
	constructor({camera, opts = {}}) {
		this._camera = camera;

		this._orbitControls = new OrbitControls(opts);
	}

	update() {
		this._orbitControls.update();

		this._camera.position = this._orbitControls.position;
		this._camera.lookAt(this._orbitControls.direction);
	}
}
export {CameraOrbitController};

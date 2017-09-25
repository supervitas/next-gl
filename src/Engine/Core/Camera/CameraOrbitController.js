import OrbitControls from 'orbit-controls';

class CameraOrbitController {
	constructor({camera, domElement}) {
		this._camera = camera;
		this._domElement = domElement;

		this._orbitControls = new OrbitControls({element: this._domElement});

	}
	update(dt) {
		this._orbitControls.update();

		this._camera.translateFromArray(this._orbitControls.position);
		this._camera.lookAtFromArray(this._orbitControls.direction);

	}

}
export {CameraOrbitController};

import OrbitControls from 'orbit-controls';
import {GLMath} from '../../Math/GLMath';

class CameraOrbitController {
	constructor({camera, opts = {}}) {
		this._camera = camera;

		this._orbitControls = new OrbitControls(opts);
	}

	update() {
		this._orbitControls.update();

		this._camera.translateFromArray(this._orbitControls.position);
		this._camera.lookAtFromArray(this._orbitControls.direction);
	}


}
export {CameraOrbitController};

import OrbitControls from 'orbit-controls';

class CameraOrbitController {
	constructor({camera, opts = {}}) {
		this._camera = camera;		
		this._orbitControls = new OrbitControls(opts);
	}

	update() {
		this._orbitControls.update();		
		console.log(this._camera.target)	
		this._camera.position = this._orbitControls.position;
		this._camera.target = this._orbitControls.target;
	}
}
export {CameraOrbitController};

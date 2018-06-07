import OrbitControls from 'orbit-controls';

class CameraOrbitController {
	constructor({camera, opts = {}}) {
		this._camera = camera;

		this._orbitControls = new OrbitControls(opts);

		this._domElement = opts.element;

		// this._canvasIsPressed = false;
		// this._xRotation = Math.PI / 20;
		// this._yRotation = 0;
		// this._lastPressX = null;
		// this._lastPressY = null;
        //
		// this._initListeners();
	}

	_initListeners() {
		this._domElement.onmousedown = (e) => {
			this._canvasIsPressed = true;
			this._lastPressX = e.pageX;
			this._lastPressY = e.pageY;
		};
		this._domElement.onmouseup = () => {
			this._canvasIsPressed = false;
		};
		this._domElement.onmouseout = () => {
			this._canvasIsPressed = false;
		};
		this._domElement.onmousemove = (e) => {
			if (this._canvasIsPressed) {
				this._xRotation += (e.pageY - this._lastPressY) / 50;
				this._yRotation -= (e.pageX - this._lastPressX) / 50;

				this._xRotation = Math.min(this._xRotation, Math.PI / 2.5);
				this._xRotation = Math.max(this._xRotation, 0.1);

				this._lastPressX = e.pageX;
				this._lastPressY = e.pageY;
			}
		};

		this._domElement.addEventListener('touchstart',  (e) => {
			this._lastPressX = e.touches[0].clientX;
			this._lastPressY = e.touches[0].clientY;
		});
		this._domElement.addEventListener('touchmove', (e) => {
			e.preventDefault();
			this._xRotation += (e.touches[0].clientY - this._lastPressY) / 50;
			this._yRotation -= (e.touches[0].clientX - this._lastPressX) / 50;

			this._xRotation = Math.min(this._xRotation, Math.PI / 2.5);
			this._xRotation = Math.max(this._xRotation, 0.1);

			this._lastPressX = e.touches[0].clientX;
			this._lastPressY = e.touches[0].clientY;
		});
	}

	update() {
		this._orbitControls.update();
		this._camera.position.fromArray(this._orbitControls.position);
		this._camera.target.fromArray(this._orbitControls.target);
	}
}
export {CameraOrbitController};

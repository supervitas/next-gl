class CameraOrbitController {
	constructor({camera, domElement}) {
		this._camera = camera;
		this._domElement = domElement;

		this._wasClicked = false;

		this._mouseMove = this._onMouseMove.bind(this);
		this._mouseClicked = this._onMouseClicked.bind(this);
		this._mouseUp = this._onMouseUp.bind(this);

		this._domElement.addEventListener('mousedown', this._mouseClicked);
		this._domElement.addEventListener('mousemove', this._mouseMove);
		this._domElement.addEventListener('mouseup', this._mouseUp);

	}
	_onMouseClicked(event) {
		event.preventDefault();
		this._wasClicked = true;
	}
	_onMouseMove(event) {
		event.preventDefault();

		if (!this._wasClicked) return;

		console.log(event);
	}
	_onMouseUp(event) {
		event.preventDefault();

		this._wasClicked = false;
	}

	inputRotate (dx, dy) {
		var PI2 = Math.PI * 2;
		inputDelta[0] -= PI2 * dx * 0.1;
		inputDelta[1] -= PI2 * dy * 0.1;
	}

}
export {CameraOrbitController};

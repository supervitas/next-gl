class Color {
	constructor({r = 255, g = 255, b = 255} = {}) {
		this._r = r;
		this._g = g;
		this._b = b;
	}

	toRGB() {
		return {
			r: this._r / 255,
			g: this._g / 255,
			b: this._b / 255
		};
	}

}

export {Color};

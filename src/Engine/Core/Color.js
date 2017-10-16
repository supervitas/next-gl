class Color {	
	constructor({r = 255, g = 255, b = 255, a = 1} = {r: 255, g: 255, b: 255, a: 1}) {
		this._r = r;
		this._g = g;
		this._b = b;
		this._a = a > 1 ? 1 : a;
	}

	toRGBA() {
		return {
			r: this._r / 255,
			g: this._g / 255,
			b: this._b / 255,
			a: this._a
		};
	}
}
export {Color};

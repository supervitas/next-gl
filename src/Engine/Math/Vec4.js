class Vec4 {
	constructor({x = 0.0, y = 0.0, z = 0.0, w = 0.0} = 0.0) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	asArray() {
		return [this.x, this.y, this.z, this.w];
	}
}
export {Vec4};
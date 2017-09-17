class Vec3 {
	constructor(x = 0.0, y = 0.0, z = 0.0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	asArray() {
		return [this.x, this.y, this.z];
	}

	crossProduct(vec) {
		return {
			x: this.y * vec.y - this.z * vec.y,
			y: this.z * vec.x - this.x * vec.z,
			z: this.x * vec.y - this.y * vec.x
		};
	}

	sub(vec) {
		return {
			x: this.x - vec.x,
			y: this.y - vec.y,
			z: this.z - vec.z
		};
	}
	add(vec) {
		return {
			x: this.x + vec.x,
			y: this.y + vec.y,
			z: this.z + vec.z
		};
	}

	normalize() {
		const magnitude = this.magnitude();
		if (magnitude === 0) {
			return {x: 0, y: 0, z: 0};
		}

		return {
			x: this.x / magnitude,
			y: this.y / magnitude,
			z: this.z / magnitude
		};

	}
	magnitude() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
	}
}
export {Vec3};

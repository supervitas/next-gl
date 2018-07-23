class Vec3 {
	constructor(x = 0.0, y = 0.0, z = 0.0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	asArray() {
		return [this.x, this.y, this.z];
	}

	fromArray(arr) {
		this.x = arr[0];
		this.y = arr[1];
		this.z = arr[2];
	}

	set({x = this.x, y = this.y, z = this.z}) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	crossProduct(vec) {
		return {
			x: this.y * vec.y - this.z * vec.y,
			y: this.z * vec.x - this.x * vec.z,
			z: this.x * vec.y - this.y * vec.x
		};
	}

	dotProduct(vec) {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	}

	sub(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		this.z -= vec.z;

		return this;
	}

	subScalar(scalar) {
		this.x -= scalar;
		this.y -= scalar;
		this.z -= scalar;

		return this;
	}

	multiplyScalar(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	}

	add(vec) {
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;

		return this;
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

	copy(vec) {
		this.x = vec.x;
		this.y = vec.y;
		this.z = vec.z;

		return this;
	}

	magnitude() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
	}
}
export {Vec3};

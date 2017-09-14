class Matrix {

	static identityMatrix4() {
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}

	static createMat4() {
		return this.identityMatrix4();
	}



}
export {Matrix};

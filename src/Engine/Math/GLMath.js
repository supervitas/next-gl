import {Vec3} from './Vec3';
import {Matrix} from './Matrix';

class GLMath {
	constructor() {
		this.vec3 = Vec3;
		this.matrix = Matrix;
	}

	static radToDeg(r) {
		return r * 180 / Math.PI;
	}

	static degToRad(d) {
		return d * Math.PI / 180;
	}

	static createVec3() {
		return new Vec3();
	}

}
export {GLMath};

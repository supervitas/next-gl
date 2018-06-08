import {Vec3} from './Vec3';
import {Matrix} from './Matrix';

class GLMath {
	static radToDeg(r) {
		return r * 180 / Math.PI;
	}

	static degToRad(d) {
		return d * Math.PI / 180;
	}

}
export {GLMath, Vec3};

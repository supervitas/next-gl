class GLMath {
	static radToDeg(r) {
		return r * 180 / Math.PI;
	}

	static degToRad(d) {
		return d * Math.PI / 180;
	}

	static clamp(value, min, max) {
		if (!isFinite(min)) {
			min = value;
		}
		if (!isFinite(max)) {
			max = value;
		}
		return Math.max(min, Math.min(max, value));
	}

}
export {GLMath};

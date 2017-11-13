import {Light} from './Light';

class SpotLight extends Light {
	constructor({color, intensity, direction, position, innerLimit = 12, outerLimit = 17} = {}) {
		super({color, intensity, direction, position});

		this.innerLimit = innerLimit;
		this.outerLimit = outerLimit;
	}
}
export {SpotLight};

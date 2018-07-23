import {Light} from './Light';

class DirectLight extends Light {
	constructor({color, intensity, direction, position, shadowDistanceMultiplier = 2 } = {}) {
		super({color, intensity, direction, position});

		this.shadowDistanceMultiplier = shadowDistanceMultiplier;
	}
}
export {DirectLight};

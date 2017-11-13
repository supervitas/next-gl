import {Light} from './Light';

class PointLight extends Light {
	constructor({color, intensity, direction, position} = {}) {
		super({color, intensity, direction, position});
	}
}
export {PointLight};

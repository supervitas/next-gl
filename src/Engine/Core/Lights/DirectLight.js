import {Light} from './Light';

class DirectLight extends Light {
	constructor({color, intensity, direction, position } = {}) {
		super({color, intensity, direction, position});
	}
}
export {DirectLight};

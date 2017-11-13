import {Light} from './Light';

class AmbientLight extends Light {
	constructor({color, intensity} = {}) {
		super({color, intensity});
	}
}
export {AmbientLight};

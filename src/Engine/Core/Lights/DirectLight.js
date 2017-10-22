import {Color} from '../Color';
import {Light} from './Light';

class DirectLight extends Light {
	constructor({color = new Color(), intensity= 1.0, direction = [0, 0, 0] } = {}) {
		super({color, intensity, direction});

	}
}
export {DirectLight};

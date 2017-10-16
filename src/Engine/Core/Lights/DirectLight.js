import {Color} from '../Color';
import {Light} from './Light';

class DirectLight extends Light {
	constructor({color = new Color(), intencity = 1.0, direction = {x:0, y: 0, z: 0}} = {}) {
		super({color, intencity, direction});

	}
}
export {DirectLight};

import {Color} from '../Color';
import {Light} from './Light';

class AmbientLight extends Light {
	constructor({color = new Color(), intencity = 1.0} = {}) {
		super({color, intencity});
	}
}
export {AmbientLight};

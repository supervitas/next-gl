import {Color} from '../Color';
import {Light} from './Light';

class PointLight extends Light {
	constructor({color = new Color(), intensity = 1.0, direction = [0, 0, 0], position = [0, 0, 0], power = 150,
		specularColor = new Color()} = {}) {
		super({color, intensity, direction, position});

		this.power = power;
		this.specularColor = specularColor.toRGB();
		this._position = position;
	}
}
export {PointLight};

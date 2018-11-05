import {Color} from '../Color';
import {Vec3} from '../../Math/Vec3';
import { SceneObject } from '../SceneObject';

let ID = 0;

class Light extends SceneObject {
	constructor({color = new Color(), intensity = 1.0, direction = new Vec3(), position = new Vec3()} = {}) {
		super({name: `Light${++ID}`});

		this.color = color.toRGB();
		this.intencity = intensity;
		this.direction = new Proxy(direction, {
			set(obj, prop, value) {
				obj[prop] = value;
				return true;
			}
		});

		this.position = new Proxy(position, {
			set(obj, prop, value) {
				obj[prop] = value;
				return true;
			}
		});
	}

}
export {Light};

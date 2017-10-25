import {Color} from '../Color';
import {SceneObject} from '../SceneObject';

class Light extends SceneObject {
	constructor({color = new Color(), intensity = 1.0, direction = [0, 0, 0], lightPosition = [0, 0, 0]  } = {}) {
		super();
		this.color = color.toRGB();
		this.intencity = intensity;
		this.direction = direction;
		this.lightPosition = lightPosition;
	}

}
export {Light};

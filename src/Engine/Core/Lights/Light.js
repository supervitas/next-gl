import {Color} from '../Color';
import {SceneObject} from '../SceneObject';

class Light extends SceneObject {
	constructor({color = new Color(), intencity = 1.0, direction = {x:0, y: 0, z: 0}} = {color: new Color(), intencity: 1.0, direction: {x:0, y: 0, z: 0}}) {
		super();
		this.color = color.toRGB();
		this.intencity = intencity;
		this.direction = direction;
	}
}
export {Light};

import {Color} from '../Color';
import {SceneObject} from '../SceneObject';

class DirectLight extends SceneObject {
	constructor({color = new Color(), intencity = 1.0} = {color: new Color(), intencity: 1.0}) {        
		super();        
		this.color = color;
		this.intencity = intencity;
	}
}
export {DirectLight};
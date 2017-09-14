import {GL} from '../Engine/Core/GL';
import {Renderer} from '../Engine/Core/Renderer';
import {Scene} from '../Engine/Core/Scene';

import {Cube} from '../Engine/Primitives/Cube/Cube';

class FirstExample {
	constructor(domElement) {
		this._domElement = domElement;
		this._lastDT = 0;

		this.gl = new GL(this._domElement);
		this.scene = new Scene();
		this.renderer = new Renderer({gl: this.gl.glContext, scene: this.scene});

		const cube = new Cube(this.gl);
		this.scene.addToScene(cube);

		this.renderFunc = this.render.bind(this);

		requestAnimationFrame(this.renderFunc);
	}

	render(dt) {
		dt *= 0.001;
		const deltaTime = dt - this._lastDT;
		this._lastDT = dt;
		this.renderer.rotation += deltaTime;

		this.renderer.drawScene();
		requestAnimationFrame(this.renderFunc);
	}

	resize() {
		this.gl.resize();
	}
}
export {FirstExample};

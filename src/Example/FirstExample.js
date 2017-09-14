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
		this.renderer = new Renderer({glContext: this.gl.glContext, scene: this.scene});

		const cube = new Cube(this.gl);
		cube.position = {x: 0, y: 0, z: -8};
		this.scene.addToScene(cube);
		// this.scene.addToScene(new Cube(this.gl));

		this.renderFunc = this.render.bind(this);

		requestAnimationFrame(this.renderFunc);
	}

	render(dt) {
		this.gl.resize();
		dt *= 0.001;
		const deltaTime = dt - this._lastDT;
		this._lastDT = dt;


		this.renderer.drawScene();
		requestAnimationFrame(this.renderFunc);
	}

	resize() {
		this.gl.resize();
	}
}
export {FirstExample};

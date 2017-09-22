import {GL} from '../Engine/Core/GL';
import {Renderer} from '../Engine/Core/Renderer';
import {Scene} from '../Engine/Core/Scene';

import {Cube} from '../Engine/Primitives/Cube/Cube';
import {Camera} from '../Engine/Core/Camera/Camera';
import {CameraOrbitController} from '../Engine/Core/Camera/CameraOrbitController';
import {Color} from '../Engine/Core/Color';
import {StandardMaterial} from '../Engine/Core/Materials/StandardMaterial';


class FirstExample {
	constructor(domElement) {
		this._domElement = domElement;
		this._lastDT = 0;

		this.gl = new GL(this._domElement);

		this.scene = new Scene();

		const aspect = this.gl.glContext.canvas.clientWidth / this.gl.glContext.canvas.clientHeight;
		this.camera = new Camera({aspect});
		this.cameraOrbitController = new CameraOrbitController({camera: this.camera, domElement: this._domElement});

		this.renderer = new Renderer({glContext: this.gl.glContext, scene: this.scene, camera: this.camera});

		this.renderFunc = this.render.bind(this);

		this.addCubes();

		requestAnimationFrame(this.renderFunc);
	}

	render(dt) {
		if (this.gl.checkAndResize()) {
			this.camera.aspect = this.gl.glContext.canvas.clientWidth / this.gl.glContext.canvas.clientHeight;
		}
		dt *= 0.001;
		const deltaTime = dt - this._lastDT;
		this._lastDT = dt;
		for (let [index, cube] of this.cubes.entries()) {

			cube.rotate({x: 0, y: 1, z: 0}, deltaTime);
			cube.rotate({x: 1, y: 0, z: 1}, deltaTime * 0.2 * index);
		}

		// this.camera.rotate({x: 0, y: 1, z: 0}, deltaTime);
		// this.camera.lookAt(this.cubes[0].position);

		this.renderer.drawScene();
		requestAnimationFrame(this.renderFunc);
	}

	addCubes() {
		const material = new StandardMaterial({
			gl: this.gl,
			map: this.gl.loadTexture(this.gl.glContext, 'src/Example/test_texture.jpg')
		});

		const materialWithColor = new StandardMaterial({
			color: new Color(50,60, 10),
			gl: this.gl
		});

		const cube = new Cube({gl: this.gl, material });
		cube.position = {x: 0, y: 0, z: -18};
		this.scene.addToScene(cube);

		const cube2 = new Cube({gl: this.gl, material: materialWithColor});
		cube2.position = {x: 5, y: 0, z: -18};
		this.scene.addToScene(cube2);

		const cube3 = new Cube({gl:this.gl, material});
		cube3.position = {x: -5, y: 0, z: -18};
		this.scene.addToScene(cube3);


		this.cubes = [cube, cube2, cube3];
	}

}
export {FirstExample};

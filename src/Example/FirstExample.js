import {StandardMaterial, GL, Renderer, Cube, Plane, SceneObject,
	Color, Camera, CameraOrbitController, Scene, DirectLight} from '../Engine/next-gl';

class FirstExample {
	constructor(domElement) {
		this._domElement = domElement;
		this._lastDT = 0;

		this.gl = new GL({domElement: this._domElement});

		this.scene = new Scene(this.gl);
		this.dirLight = new DirectLight();
		this.scene.addToScene(this.dirLight);

		const aspect = this.gl.glContext.canvas.clientWidth / this.gl.glContext.canvas.clientHeight;
		this.camera = new Camera({aspect});
		this.cameraOrbitController = new CameraOrbitController({
			camera: this.camera,
			opts: {
				element: this._domElement,
				target: [0, 5, 0],
				distance: 20
			}
		});

		this.renderer = new Renderer({glContext: this.gl.glContext, scene: this.scene, camera: this.camera});

		this.renderFunc = this.render.bind(this);

		this.addCubes();

		const material = new StandardMaterial({
			map: this.gl.loadTexture(this.gl.glContext, 'src/Example/test_texture.jpg'),
			isDoubleSided: true
		});

		const plane = new Plane({ material, });
		plane.scale = {x: 30, y:1, z: 30};

		this.scene.addToScene(plane);

		requestAnimationFrame(this.renderFunc);
	}

	render(dt) {
		if (this.gl.checkAndResize()) {
			this.camera.aspect = this.gl.glContext.canvas.clientWidth / this.gl.glContext.canvas.clientHeight;
		}
		dt *= 0.001;
		const deltaTime = dt - this._lastDT;
		this._lastDT = dt;

		for (const [index, cube] of this.cubes.entries()) {
			cube.rotate({x: 0, y: 1, z: 0}, deltaTime);
			cube.rotate({x: 0, y: 0, z: 1}, deltaTime * 0.2 * index);
		}

		this.cameraOrbitController.update(deltaTime);

		this.renderer.drawScene();
		requestAnimationFrame(this.renderFunc);
	}

	addCubes() {
		const material = new StandardMaterial({
			map: this.gl.loadTexture(this.gl.glContext, 'src/Example/test_texture.jpg')
		});

		const materialWithColor = new StandardMaterial({
			color: new Color({r: 50, g: 60, b: 10})
		});

		const cube = new Cube({ material });
		cube.position = {x: 0, y: 5, z: -18};
		this.scene.addToScene(cube);

		const cube2 = new Cube({ material: materialWithColor});
		cube2.position = {x: 5, y: 5, z: -18};
		this.scene.addToScene(cube2);

		const cube3 = new Cube({ material});
		cube3.position = {x: -5, y: 5, z: -18};
		this.scene.addToScene(cube3);

		const cube4 = new Cube({ material});
		cube4.position = {x: -5, y: 15, z: -18};
		this.scene.addToScene(cube4);

		const emptyObject = new SceneObject();
		this.scene.addToScene(emptyObject);

		cube4.setParent(emptyObject);
		emptyObject.setParent(cube3);

		this.cubes = [cube, cube2, cube3];
	}

}
export {FirstExample};

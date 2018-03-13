import {StandardMaterial, GL, Renderer, Cube, Plane,
	Color, OrthographicCamera, Scene, DirectLight,
	AmbientLight} from '../Engine/next-gl';

class OrthographicExample {
	constructor(domElement) {
		this._domElement = domElement;
		this._lastDT = 0;

		this.gl = new GL({domElement: this._domElement});

		this.scene = new Scene(this.gl);

		const aspect = this.gl.glContext.canvas.clientWidth / this.gl.glContext.canvas.clientHeight;
		this.camera = new OrthographicCamera({near: 1, far: 1000, aspect});


		this.renderer = new Renderer({gl: this.gl});

		this.renderFunc = this.render.bind(this);

		this.cubes = this.addCubes(this.scene);


		const plane = new Plane({material: new StandardMaterial({
			map: this.gl.loadTexture('src/Example/textures/base_texture.png')
		})});
		plane.scale = {x: 30, z: 30};

		this.scene.addToScene(plane);

		this.createLight();

		requestAnimationFrame(this.renderFunc);
	}

	render(dt) {
		dt *= 0.001;
		const deltaTime = dt - this._lastDT;
		this._lastDT = dt;

		if (this.gl.checkAndResize()) {
			this.camera.aspect = this.gl.glContext.canvas.clientWidth / this.gl.glContext.canvas.clientHeight;
		}

		for (const [index, cube] of this.cubes.entries()) {
			cube.rotate({x: 0, y: 1, z: 0}, deltaTime);
			cube.rotate({x: 0, y: 0, z: 1}, deltaTime * 0.2 * index);
		}


		this.renderer.drawScene(this.scene, this.camera);

		requestAnimationFrame(this.renderFunc);
	}

	createLight() {
		const ambientLight = new AmbientLight({intensity: 0.2});
		const dirLight = new DirectLight({intensity: 0.2, direction: [0.15, 0.8, 0.75], position: [0, 10, 0]});

		this.camera.position = dirLight.position;
		window.x = this.camera;

		this.scene.addToScene(dirLight);
		this.scene.addToScene(ambientLight);
	}

	addCubes(scene) {
		const mapMaterial = new StandardMaterial({
			map: this.gl.loadTexture('src/Example/textures/test_texture.jpg')
		});

		const materialWithColor = new StandardMaterial({
			color: new Color({r: 50, g: 60, b: 10})
		});

		const cube = new Cube({ material: mapMaterial});
		cube.position = {x: 0, y: 5, z: -18};
		scene.addToScene(cube);

		const cube2 = new Cube({ material: materialWithColor});
		cube2.position = {x: 5, y: 5, z: -18};
		scene.addToScene(cube2);

		const cube3 = new Cube({ material: materialWithColor});
		cube3.position = {x: -5, y: 5, z: -18};
		scene.addToScene(cube3);

		const cube4 = new Cube({ material: materialWithColor});
		cube4.position = {x: -5, y: 15, z: -18};
		scene.addToScene(cube4);

		cube4.setParent(cube3);

		return [cube, cube2, cube3];
	}
}
export {OrthographicExample};

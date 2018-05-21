import {StandardMaterial, GL, Renderer, Cube, Plane,
	Color, OrthographicCamera, Scene, DirectLight,
	AmbientLight} from '../Engine/next-gl';

class OrthographicExample {
	constructor(domElement) {
		this._domElement = domElement;
		this._lastDT = 0;

		this.gl = new GL({domElement: this._domElement});

		this.scene = new Scene(this.gl);

		const w = this.gl.glContext.canvas.clientWidth;
		const h = this.gl.glContext.canvas.clientHeight;

		this.camera = new OrthographicCamera({left: w / -2, right: w /  2, top: h / 2, bottom: h / -2, near: 1, far: 1000});
		window.x = this.camera;


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
			cube.rotateY(deltaTime);
			cube.rotateZ(deltaTime * 0.2 * index);
		}


		this.renderer.drawScene(this.scene, this.camera);

		requestAnimationFrame(this.renderFunc);
	}

	createLight() {
		const ambientLight = new AmbientLight({intensity: 0.2});
		const dirLight = new DirectLight({intensity: 0.2, direction: [0.15, 0.8, 0.75], position: [0, 10, 0]});

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

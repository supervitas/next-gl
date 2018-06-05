import {StandardMaterial, GL, Renderer, Cube, Plane,
	Color, PerspectiveCamera, OrthographicCamera, CameraOrbitController, Scene, DirectLight,
	AmbientLight, PointLight, SpotLight, RenderTarget} from '../Engine/next-gl';

class FirstExample {
	constructor(domElement) {
		this._domElement = domElement;
		this._lastDT = 0;

		this.gl = new GL({domElement: this._domElement});

		this.scene = new Scene(this.gl);

		this.aspect = this.gl.glContext.canvas.clientWidth / this.gl.glContext.canvas.clientHeight;
		this.camera = new PerspectiveCamera({near: 1, far: 1000, aspect: this.aspect});
		this.cameraOrbitController = new CameraOrbitController({
			camera: this.camera,
			opts: {
				element: this._domElement,
				target: [0, 5, 0],
				distance: 20
			}
		});

		this.renderer = new Renderer({gl: this.gl});

		this.renderFunc = this.render.bind(this);

		this.cubes = this.addCubes(this.scene);
		this.addTransparentCubes();


		const plane = new Plane({material: new StandardMaterial({
			map: this.gl.loadTexture('src/Example/textures/test_texture.jpg')
		})});
		plane.scale = {x: 30, z: 30};

		this.scene.addToScene(plane);

		this.createLight();
		this.createShadowMap();

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

		this.cameraOrbitController.update(deltaTime);

		this.renderer.drawScene(this.scene, this.camera);
		this.renderer.drawScene(this.scene, this.shadowCamera);

		requestAnimationFrame(this.renderFunc);
	}

	createLight() {
		const ambientLight = new AmbientLight({intensity: 0.2});
		const dirLight = new DirectLight({intensity: 0.5, direction: [0.35, 0.8, 0.75], position: [3, 5, 0]});
		const pointLight = new PointLight({intensity: 0.3, position: [-25, 5, 0]});
		const spotLight = new SpotLight({intensity: 0.4,
			position: [0, 15, -18],
			innerLimit: 3, outerLimit: 31});


		this.scene.addToScene(dirLight);
		this.scene.addToScene(ambientLight);
		// this.scene.addToScene(pointLight);
		// this.scene.addToScene(spotLight);
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

	addTransparentCubes() {
		const transpMat = new StandardMaterial({
			color: new Color({r: 10, g: 30, b: 100}),
			opacity: 0.6
		});

		const cube = new Cube({ material: transpMat});
		cube.position = {x: 0, y: 5, z: -3};
		cube.scale = {x: 3, y: 3, z: 3};

		this.scene.addToScene(cube);

		const transpMat2 = new StandardMaterial({
			color: new Color({r: 150, g: 130, b: 10}),
			opacity: 0.3
		});

		const cube2 = new Cube({ material: transpMat2});
		cube2.position = {x: 3, y: 5, z: -5};
		cube2.scale = {x: 3, y: 3, z: 3};

		this.scene.addToScene(cube2);
	}

	createShadowMap() {
		const shadowMap = new RenderTarget({
			gl: this.gl.glContext,
			width: this.gl.glContext.canvas.clientWidth,
			height:  this.gl.glContext.canvas.clientHeight
		});

		const w = this.gl.glContext.canvas.clientWidth;
		const h = this.gl.glContext.canvas.clientHeight;


		this.shadowCamera = new OrthographicCamera({
			left: w / -2,
			right: w /  2,
			top: h / 2,
			bottom: h / -2,
			near: 1, far: 1000
		});
		window.x = this.shadowCamera;
		// this.shadowCamera.position = [0, 5, -18];

		// this.shadowCamera.target = [0.35, 0.8, 0.75];
	}
	updateShadowCamera() {

	}
}
export {FirstExample};

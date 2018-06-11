import {StandardMaterial, GL, Renderer, RenderTarget, Cube, Plane,
	Color, PerspectiveCamera, CameraOrbitController, Scene, DirectLight,
	AmbientLight, PointLight, SpotLight} from '../Engine/next-gl';

class RenderToTexture {
	constructor(domElement) {
		this._domElement = domElement;
		this._lastDT = 0;

		this.gl = new GL({domElement: this._domElement});

		this.scene = new Scene(this.gl);

		const aspect = this.gl.context.canvas.clientWidth / this.gl.context.canvas.clientHeight;
		this.camera = new PerspectiveCamera({near: 1, far: 1000, aspect});
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

		this.renderTextureScene = new Scene(this.gl);
		this.renderCamera = new PerspectiveCamera({aspect});
		this.renderCamera.position = [0, 5, 0];

		this.renderTexture = new RenderTarget({gl: this.gl.context, width: 512, height: 512});
		this.renderMaterial = new StandardMaterial({map: this.renderTexture.target.attachments[0], isDoubleSided: true});

		this.cubesOnRenderTextures = this.addCubes(this.renderTextureScene);
		this.renderTextureScene.addToScene(new AmbientLight({intensity: 0.8}));

		this.cubes = this.addCubes(this.scene);


		const plane = new Plane({material: this.renderMaterial});
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
			this.camera.aspect = this.gl.context.canvas.clientWidth / this.gl.context.canvas.clientHeight;
		}

		for (const [index, cube] of this.cubes.entries()) {
			cube.rotate({x: 0, y: 1, z: 0}, deltaTime);
			cube.rotate({x: 0, y: 0, z: 1}, deltaTime * 0.2 * index);
		}

		for (const [index, cube] of this.cubesOnRenderTextures.entries()) {
			cube.rotate({x: 0, y: 1, z: 0}, deltaTime);
			cube.rotate({x: 0, y: 0, z: 1}, deltaTime * 0.2 * index);
		}

		this.cameraOrbitController.update(deltaTime);

		this.renderer.drawScene(this.scene, this.camera);
		this.renderer.drawScene(this.renderTextureScene, this.renderCamera, this.renderTexture);

		requestAnimationFrame(this.renderFunc);
	}

	createLight() {
		const ambientLight = new AmbientLight({intensity: 0.2});
		const dirLight = new DirectLight({intensity: 0.2, direction: [0.15, 0.8, 0.75], position: [0, 10, 0]});
		const pointLight = new PointLight({intensity: 0.3, position: [-25, 5, 0]});
		const spotLight = new SpotLight({intensity: 0.1, position: [0, 5, -18], innerLimit: 3, outerLimit: 31});

		this.scene.addToScene(dirLight);
		this.scene.addToScene(pointLight);
		this.scene.addToScene(ambientLight);
		this.scene.addToScene(spotLight);
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
export {RenderToTexture};

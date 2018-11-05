import {StandardMaterial, GL, Renderer, Cube, Plane,
	Color, PerspectiveCamera, CameraOrbitController, Scene, DirectLight,
	AmbientLight, PointLight, SpotLight, Vec3} from '../Engine/next-gl';

class FirstExample {
	constructor(domElement) {
		this._domElement = domElement;
		this._lastDT = 0;

		this.gl = new GL({domElement: this._domElement});

		this.scene = new Scene();

		this.aspect = this.gl.context.canvas.clientWidth / this.gl.context.canvas.clientHeight;
		this.camera = new PerspectiveCamera({near: 1, far: 1000, aspect: this.aspect});

		this.cameraOrbitController = new CameraOrbitController({
			camera: this.camera,
			canvas: this._domElement
		});

		this.renderer = new Renderer({gl: this.gl});

		this.renderFunc = this.render.bind(this);

		this.cubes = this.addCubes(this.scene);
		// this.addTransparentCubes();


		const plane = new Plane({material: new StandardMaterial({
			map: this.gl.loadTexture('src/Example/textures/test_texture.jpg')
		})});

		plane.scale.set({x: 30, z: 30});
		this.scene.addToScene(plane);
		// this.scene.shadowRecievers.push(plane);

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
			cube.rotateY(deltaTime);
			cube.rotateZ(deltaTime * 0.2 * index);
		}

		this.renderer.drawScene(this.scene, this.camera);

		requestAnimationFrame(this.renderFunc);
	}

	createLight() {
		const ambientLight = new AmbientLight({intensity: 0.2});
		const dirLight = new DirectLight({intensity: 0.6, direction: new Vec3(0.35, 0.8, 0.75),
			position: new Vec3(3, 15, 0)});
		// this.scene.shadowLights.push(dirLight);


		const pointLight = new PointLight({intensity: 0.3, position: new Vec3(-25, 5, 0)});
		const spotLight = new SpotLight({intensity: 0.4,
			position: new Vec3(0, 15, -5),
			innerLimit: 3, outerLimit: 31});


		this.scene.addToScene(dirLight);
		this.scene.addToScene(ambientLight);
		// this.scene.addToScene(pointLight);
		// this.scene.addToScene(spotLight);
	}

	addCubes(scene) {
		const materialWithColor = new StandardMaterial({
			color: new Color({r: 50, g: 60, b: 10})
		});

		const cube = new Cube({ material: materialWithColor});
		cube.position.copy({x: 0, y: 5, z: -18});
		cube.castShadow = true;
		scene.addToScene(cube);

		const cube2 = new Cube({ material: materialWithColor});
		cube2.position.copy({x: 5, y: 5, z: -18});
		cube2.castShadow = true;
		scene.addToScene(cube2);

		const cube3 = new Cube({ material: materialWithColor});
		cube3.position.copy({x: -5, y: 5, z: -18});
		cube3.castShadow = true;
		scene.addToScene(cube3);

		const cube4 = new Cube({ material: materialWithColor});
		cube4.position.copy({x: -5, y: 15, z: -18});
		cube4.castShadow = true;
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
		cube.position.copy({x: 0, y: 5, z: -3});
		cube.scale.set({x: 3, y: 3, z: 3});

		this.scene.addToScene(cube);

		const transpMat2 = new StandardMaterial({
			color: new Color({r: 150, g: 130, b: 10}),
			opacity: 0.3
		});

		const cube2 = new Cube({ material: transpMat2});
		cube2.position.copy({x: 3, y: 5, z: -5});
		cube2.scale.set({x: 3, y: 3, z: 4});


		this.scene.addToScene(cube2);
	}

}
export {FirstExample};

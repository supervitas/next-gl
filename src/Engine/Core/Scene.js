class Scene {
	constructor(gl) {
		this._gl = gl;
		this.renderablesByProgram = new Map(); // grouped sceneObjects by program
		this.sceneObjects = new Map();

	}

	addToScene(sceneObject) {
		if (!sceneObject.material) { // empty object
			this.sceneObjects.set(sceneObject.id, sceneObject);
			return;
		}

		sceneObject.initObject(this._gl);

		if (this.renderablesByProgram.has(sceneObject.material.program)) { // allready have object for this program
			const renderable = this.renderablesByProgram.get(sceneObject.program);
			renderable.sceneObjects.push(sceneObject);
		} else { // create
			this.renderablesByProgram.set(sceneObject.material.program, {sceneObjects: [sceneObject]});
		}

		this.sceneObjects.set(sceneObject.id, sceneObject);
	}

	removeFromScene(renderable) { // todo
		if (!this.sceneObjects.has(renderable.material.program.name)) return;

		const sceneObject = this.sceneObjects.get(renderable.material.program.name);

		const index = sceneObject.renderables.indexOf(renderable);
		if (index !== -1) {
			sceneObject.renderables.splice(index, 1);
		}
	}

	getObjectById(id) {

	}
}
export {Scene};


class Scene {
	constructor(gl) {
		this._gl = gl;
		this.sceneObjects = new Map();
	}

	addToScene(renderable) {
		renderable.createObject(this._gl);
		if (this.sceneObjects.has(renderable.material.program.name)) {
			const sceneObject = this.sceneObjects.get(renderable.program.name);
			sceneObject.renderables.push(renderable);
			return;
		}
		this.sceneObjects.set(renderable.material.program.name, {program: renderable.material.program, renderables: [renderable]});
	}

	removeFromScene(renderable) {
		if (!this.sceneObjects.has(renderable.material.program.name)) return;

		const sceneObject = this.sceneObjects.get(renderable.material.program.name);

		const index = sceneObject.renderables.indexOf(renderable);
		if (index !== -1) {
			sceneObject.renderables.splice(index, 1);
		}
	}
}
export {Scene};


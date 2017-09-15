class Scene {
	constructor() {
		this.sceneObjects = new Map();
	}

	addToScene(renderable) {
		if (this.sceneObjects.has(renderable.program.name)) {
			const sceneObject = this.sceneObjects.get(renderable.program.name);
			sceneObject.renderables.push(renderable);
			return;
		}
		this.sceneObjects.set(renderable.program.name, {program: renderable.program, renderables: [renderable]});
	}

	removeFromScene(sceneObject) {
		const index = this.sceneObjects.indexOf(sceneObject);
		if (index !== -1) {
			this.sceneObjects.splice(index, 1);
		}
	}
}
export {Scene};


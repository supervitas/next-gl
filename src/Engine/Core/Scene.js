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

	removeFromScene(renderable) {
		if (!this.sceneObjects.has(renderable.program.name)) return;

		const sceneObject = this.sceneObjects.get(renderable.program.name);

		const index = sceneObject.renderables.indexOf(renderable);
		if (index !== -1) {
			sceneObject.renderables.splice(index, 1);
		}
	}
}
export {Scene};


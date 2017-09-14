class Scene {
	constructor() {
		this.sceneObjects = [];
	}

	addToScene(sceneObject) {
		this.sceneObjects.push(sceneObject);
	}

	removeFromScene(sceneObject) {
		const index = this.sceneObjects.indexOf(sceneObject);
		if (index !== -1) {
			this.sceneObjects.splice(index, 1);
		}
	}
}
export {Scene};


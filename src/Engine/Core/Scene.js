class Scene {
	constructor() {
		this.objects = [];
	}

	addToScene(sceneObject) {
		this.objects.push(sceneObject);
	}

	removeFromScene(sceneObject) {
		this.objects.remove(sceneObject);
	}
}
export {Scene};


class Scene {
	constructor(gl) {
		this._gl = gl;
		this.renderablesByProgram = new Map(); // grouped sceneObjects by program
		this.sceneObjects = new Map();
	}

	addToScene(sceneObject) {
		this.sceneObjects.set(sceneObject.id, sceneObject);
		
		if (!sceneObject.material) return; // empty object
		
		sceneObject.initObject(this._gl);

		if (this.renderablesByProgram.has(sceneObject.material.program)) {
			const renderable = this.renderablesByProgram.get(sceneObject.program);
			renderable.sceneObjects.push(sceneObject);
		} else {
			this.renderablesByProgram.set(sceneObject.material.program, {sceneObjects: [sceneObject]});
		}
	}

	removeFromScene(sceneObject) {		
		if (!sceneObject.material)	{
			const object = this.getObjectById(sceneObject.id);
			if (object.children) {
				for (const child of sceneObject.children) {
					this.removeFromScene(child);
				}
			}
			
			this.sceneObjects.delete(sceneObject.id);	
			return

		}
		if (!this.renderablesByProgram.has(sceneObject.material.program)) return;

		const renderable = this.renderablesByProgram.get(sceneObject.material.program);

		const index = renderable.sceneObjects.indexOf(sceneObject);

		if (index === -1) return;		

		if (sceneObject.children) {
			for (const child of sceneObject.children) {
				this.removeFromScene(child);
			}
		}
				
		renderable.sceneObjects.splice(index, 1);
		this.sceneObjects.delete(sceneObject.id);	
	}

	getObjectById(id) {
		return this.sceneObjects.get(id);
	}
}
export {Scene};


class SceneObject {
	constructor(gl) {
		this.programInfo = {};
		this.program = null;
		this.vao = null;
		this.gl = gl;
		this.glContext = gl.glContext;

		this.visible = true;
	}

}
export {SceneObject};

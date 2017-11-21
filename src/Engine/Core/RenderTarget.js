import twgl from 'twgl-base.js';

class RenderTarget {
	constructor(gl, attachments) {
		this.attachments = [
			{ format: gl.RGBA, type: gl.UNSIGNED_BYTE, min: gl.LINEAR, wrap: gl.CLAMP_TO_EDGE }
		];
		this._gl = gl;
		const width = 256;
		const height = 256;

		this.target = twgl.createFramebufferInfo(gl, this.attachments, width, height);
	}

	update() {
		twgl.bindFramebufferInfo(this._gl, this.target);
	}

}

export {RenderTarget};


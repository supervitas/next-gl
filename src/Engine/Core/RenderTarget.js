import twgl from 'twgl-base.js';

class RenderTarget {
	constructor({gl, width, height, attachments = [
		{ format: gl.RGBA, type: gl.UNSIGNED_BYTE, min: gl.LINEAR, wrap: gl.CLAMP_TO_EDGE },
		{ format: gl.DEPTH_STENCIL, },
	]}) {
		this._gl = gl;
		this.attachments = attachments;
		this.width = width;
		this.height = height;

		this.target = twgl.createFramebufferInfo(this._gl, this.attachments, width, height);
	}

	updateSize(width = this.width, height = this.height) {
		this.target = twgl.createFramebufferInfo(this._gl, this.attachments, width, height);
	}

	bindFrameBuffer() {
		twgl.bindFramebufferInfo(this._gl, this.target);
	}
}

export {RenderTarget};


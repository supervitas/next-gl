import twgl from 'twgl-base.js';

class RenderTarget {
	constructor({gl, width, height}) {
		this._gl = gl;
		this.attachments = [
			{ format: gl.RGB, type: gl.UNSIGNED_BYTE, min: gl.LINEAR, wrap: gl.CLAMP_TO_EDGE },
			{ format: gl.DEPTH_STENCIL }
		];

		this.width = width;
		this.height = height;

		this.target = twgl.createFramebufferInfo(gl, this.attachments, width, height);
	}

	bindFrameBuffer() {
		twgl.bindFramebufferInfo(this._gl, this.target);
	}
}

export {RenderTarget};


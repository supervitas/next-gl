import twgl from 'twgl-base.js';

class RenderTarget {
	constructor({gl, width, height}) {
		this._gl = gl;
		this.attachments = [
			{
				internalFormat: gl.DEPTH_COMPONENT16,
				format: gl.DEPTH_COMPONENT,
				type: gl.UNSIGNED_SHORT,
				min: gl.NEAREST, mag: gl.NEAREST,
				wrap: gl.CLAMP_TO_EDGE
			},
		];

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


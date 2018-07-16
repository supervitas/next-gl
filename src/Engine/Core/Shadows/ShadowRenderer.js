import {RenderTarget} from '../RenderTarget';
import {OrthographicCamera} from '../../Core/Camera/OrthographicCamera';

class ShadowRenderer {
	constructor({gl, light}) {
		this.gl = gl;
		this.shadowMap = new RenderTarget({
			gl: this.gl.context,
			width: this.gl.context.canvas.clientWidth * this.gl.realPixels,
			height:  this.gl.context.canvas.clientHeight * this.gl.realPixels,
			attachments: [{
				internalFormat: this.gl.context.DEPTH_COMPONENT32F,
				format: this.gl.context.DEPTH_COMPONENT,
				type: this.gl.context.FLOAT,
				min: this.gl.context.NEAREST, mag: this.gl.context.NEAREST,
				wrap: this.gl.context.CLAMP_TO_EDGE
			}],
		});

		const w = this.gl.context.canvas.clientWidth;
		const h = this.gl.context.canvas.clientHeight;


		this.shadowCamera = new OrthographicCamera({
			left: w / -2,
			right: w /  2,
			top: h / 2,
			bottom: h / -2,
			near: 1, far: 1000
		});

		this.shadowCamera.position.copy(light.position);
		this.shadowCamera.target.copy(light.direction);
	}

}

export {ShadowRenderer};

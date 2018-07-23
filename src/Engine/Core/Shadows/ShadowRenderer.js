import {RenderTarget} from '../RenderTarget';
import {OrthographicCamera} from '../../Core/Camera/OrthographicCamera';

class ShadowRenderer {
	constructor({gl, light}) {
		this.gl = gl;

		const context = gl.context;

		this.shadowMap = new RenderTarget({
			gl: context,
			width: context.canvas.clientWidth * this.gl.realPixels,
			height: context.canvas.clientHeight * this.gl.realPixels,
			attachments: [{
				internalFormat: context.DEPTH_COMPONENT32F,
				format: context.DEPTH_COMPONENT,
				type: context.FLOAT,
				compareMode: context.COMPARE_REF_TO_TEXTURE,
				min: context.LINEAR, mag: context.LINEAR,
				wrap: context.CLAMP_TO_EDGE
			}],
		});

		const w = context.canvas.clientWidth;
		const h = context.canvas.clientHeight;


		this.shadowCamera = new OrthographicCamera({
			left: w / -2,
			right: w /  2,
			top: h / 2,
			bottom: h / -2,
			near: 1, far: 1000
		});

		this.shadowCamera.position.copy(light.position).multiplyScalar(light.shadowDistanceMultiplier);
		this.shadowCamera.target.copy(light.direction);
	}

}

export {ShadowRenderer};

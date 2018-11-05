import {Color} from './Color';
import twgl from 'twgl-base.js';

class GL {
	constructor({domElement, clearColor = new Color(), transparent = true,
		pixelRatio = window.devicePixelRatio || 1, antialias = true }) {

		this._domElement = domElement;
		this._clearColor = clearColor.toRGB();
		this._transparent = transparent ? 0.0 : 1.0;
		this._antialias = antialias;

		this.context = this._initWebGL();

		if (!this.context) return;

		this.realPixels = pixelRatio;

		this._programs = new Map();
	}

	initProgram(vertexShader, fragmentShader, defines) {
		if (defines.size !== 0) {
			const insertAt = (src, index, str) => {
				return src.substr(0, index) + str + src.substr(index);
			};

			defines = new Map([...defines.entries()].sort()); // sorting
			let programDefines = '';

			for (const [key, value] of defines) {
				programDefines += `#define ${key} ${value}\n`;
			}

			const firstLine = vertexShader.split('\n')[0];
			const indexWhereDefinesWillInjected = firstLine.length + 1;

			vertexShader = insertAt(vertexShader, indexWhereDefinesWillInjected, programDefines);
			fragmentShader = insertAt(fragmentShader, indexWhereDefinesWillInjected, programDefines);
		}

		const programHash = this._computeHash(vertexShader + fragmentShader);

		if (this._programs.has(programHash)) {
			return this._programs.get(programHash);
		}

		const program = this._createProgram(
			this._loadShader(this.context.VERTEX_SHADER, vertexShader),
			this._loadShader(this.context.FRAGMENT_SHADER, fragmentShader)
		);

		this._programs.set(programHash, program);

		return program;
	}

	checkAndResize() {
		const canvas = this.context.canvas;

		const displayWidth = Math.floor(canvas.clientWidth * this.realPixels);
		const displayHeight = Math.floor(canvas.clientHeight * this.realPixels);

		let needResize = false;

		if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
			canvas.width = displayWidth;
			canvas.height = displayHeight;

			needResize = true;
		}

		this.context.viewport(0, 0, canvas.width, canvas.height);

		return needResize;
	}

	loadTexture(src) {
		const texture = twgl.createTexture(this.context, {
			src,
		});

		return texture;
	}

	_initWebGL() {
		const gl = this._domElement.getContext('webgl2', { antialias: this._antialias});

		if (!gl) {
			alert('Unable to initialize WebGL. Your browser may not support it.');
			return null;
		}

		gl.clearColor(this._clearColor.x, this._clearColor.y, this._clearColor.z, this._transparent);
		gl.enable(gl.CULL_FACE);
		gl.depthFunc(gl.LEQUAL);

		return gl;
	}


	_loadShader(type, source) {
		const shader = this.context.createShader(type);
		this.context.shaderSource(shader, source);
		this.context.compileShader(shader);
		if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
			console.error('An error occurred compiling the shaders: ' + this.context.getShaderInfoLog(shader));
			this.context.deleteShader(shader);
			return null;
		}
		return shader;
	}

	_createProgram(vertexShader, fragmentShader) {
		const shaderProgram = this.context.createProgram();

		this.context.attachShader(shaderProgram, vertexShader);
		this.context.attachShader(shaderProgram, fragmentShader);
		this.context.linkProgram(shaderProgram);

		if (!this.context.getProgramParameter(shaderProgram, this.context.LINK_STATUS)) {
			console.error(`Unable to initialize the shader program: ${this.context.getProgramInfoLog(shaderProgram)}`);
			return null;
		}

		return shaderProgram;
	}

	_computeHash(str) {
		let hash = 0, i, chr;
		if (str === 0) return hash;
		for (i = 0; i < str.length; i++) {
			chr   = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return hash;
	}
}
export {GL};

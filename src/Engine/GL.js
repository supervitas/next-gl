class GL {
	constructor(domElement) {
		this._domElement = domElement;            
		const gl = this._initWebGL();
		this._gl = gl;

		if (gl) {
			gl.clearColor(0.0, 255.0, 255.0, 1.0);                      // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
			gl.enable(gl.DEPTH_TEST);                               // включает использование буфера глубины
			gl.depthFunc(gl.LEQUAL);                                // определяет работу буфера глубины: более ближние объекты перекрывают дальние
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // очистить буфер цвета и буфер глубины.
		}      
	}
  
	resize(w, h){
		this._gl.viewport(0, 0, w, h);
	}

	_initWebGL() {      
		const gl = this._domElement.getContext('webgl') || this._domElement.getContext('experimental-webgl');
      
		if (!gl) {
			alert('Unable to initialize WebGL. Your browser may not support it.');
			return null;
		}
      
		return gl;
	}
}

export {GL};
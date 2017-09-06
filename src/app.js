import './app.css';
import {GL} from './Engine/GL';

class App {
	constructor() {
		this._canvas = document.getElementById('glcanvas');
		this._gl = new GL(this._canvas);
		this._addEventListeners();		
	}

	_addEventListeners() {
		window.addEventListener('resize', () => {
			this._gl.resize(window.innerWidth, window.innerWidth);
		});
	}
}

new App();
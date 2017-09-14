import './app.css';
import {FirstExample} from './Example/FirstExample';

class App {
	constructor() {
		this._canvas = document.getElementById('glcanvas');
		this._example = new FirstExample(this._canvas);
		this._addEventListeners();
	}

	_addEventListeners() {
		window.addEventListener('resize', () => this._example.resize());

	}
}

new App();

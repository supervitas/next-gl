import './app.css';
import {FirstExample} from './Example/FirstExample';

class App {
	constructor() {
		this._canvas = document.getElementById('glcanvas');
		this._example = new FirstExample(this._canvas);
		window.app = this;
	}

}

new App();

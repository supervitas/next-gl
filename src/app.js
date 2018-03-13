import './app.css';
import {FirstExample} from './Example/FirstExample';
import {OrthographicExample} from "./Example/OrthographicCamera";

class App {
	constructor() {
		this._canvas = document.getElementById('glcanvas');
		this._example = new FirstExample(this._canvas);
	}

}

new App();

import {SceneObject} from '../SceneObject';

class OBJLoader {
	static load(src) {
		return fetch(src)
			.then( response => response.text() )
			.then( text => {
				const attribs = OBJLoader._parse(text);

				const verts = [].concat(...attribs.vertices);
				const uv = [].concat(...attribs.texturecoords);
				const normals = [].concat(...attribs.normals);
				const indices = [].concat(...attribs.indices);

				const object = new SceneObject();
				object.attributes = {
					aVertexPosition: { numComponents: 3, data: verts },
					aTextureCoord: { numComponents: 2, data: uv},
					aVertexNormal: { numComponents: 3, data: normals},
					indices: {numComponents: 3, data: indices},
				};

				return object;
			});
	}

	static _parse (resource) {
		const indices = [],
			vertices = [],
			texturecoords = [],
			normals = [];

		const v = [], vt = [], vn = []; // Buffers
		const FACE = function (F) {
			const face = F.split(' ').map(function (fv) {
				const i = fv.split('/').map(function (i) {
					return parseInt(i, 10) - 1;
				});
				return {
					v: v[i[0]],
					vt: vt[i[1]],
					vn: vn[i[2]]
				};
			});

			// Generate indices for triangle
			const len = vertices.length;
			indices.push(len);
			indices.push(len + 1);
			indices.push(len + 2);

			// Generate indices for 4 point polygon
			if (face.length === 4) {
				indices.push(len);
				indices.push(len + 2);
				indices.push(len + 3);
			}

			// SAVE PARSED DATA:
			face.forEach(function (f) {
				vertices.push(f.v);
				texturecoords.push(f.vt);
				normals.push(f.vn);
			});
		};
		const toFloatArr = function (s) {
				return s.split(' ').map(parseFloat);
			},
			lineParsers = {
				'v ': function (S) {
					v.push(toFloatArr(S.slice(2)));
				},
				'vt': function (S) {
					const x = (function (v) {
						v[1] = 1 - v[1];
						return v;
					}(toFloatArr(S.slice(3))));
					vt.push(x);
				},
				'vn': function (S) {
					vn.push(toFloatArr(S.slice(3)));
				},
				'f ': function (S) {
					FACE(S.slice(2));
				}
			};

		resource.split('\n').forEach(function (line) {
			if (line.length > 2) {
				Object.keys(lineParsers).forEach(function (key) {
					if (line.indexOf(key) === 0) {
						lineParsers[key](line);
					}
				});
			}
		});

		return {
			indices: indices,
			vertices: vertices,
			texturecoords: texturecoords,
			normals: normals
		};
	}


}
export {OBJLoader};

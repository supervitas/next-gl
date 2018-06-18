#version 300 es

uniform mat4 uNormalMatrix;
uniform mat4 uModelWorldMatrix;

uniform Projection {
  	mat4 uProjectionMatrix;
};

uniform View {
	vec3 uViewWorldPosition;
};

layout (location = 0) in vec4 aVertexPosition;
layout (location = 1) in vec3 aVertexNormal;


void main() {
	gl_Position = uProjectionMatrix * uModelWorldMatrix * aVertexPosition;
}

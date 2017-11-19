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
layout (location = 2) in vec2 aTextureCoord;

out highp vec2 vTextureCoord;
out vec3 vNormal;
out vec3 vSurfaceToView;
out vec3 vSurfaceWorldPosition;

void main() {
	vTextureCoord = aTextureCoord;

	vNormal = mat3(uNormalMatrix) * aVertexNormal;

	vSurfaceWorldPosition = (uModelWorldMatrix * aVertexPosition).xyz;
	vSurfaceToView = uViewWorldPosition - vSurfaceWorldPosition;

	gl_Position = uProjectionMatrix * uModelWorldMatrix * aVertexPosition;
}

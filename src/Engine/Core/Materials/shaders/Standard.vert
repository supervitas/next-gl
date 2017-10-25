#version 300 es

uniform mat4 uNormalMatrix;
uniform mat4 uModelWorldMatrix;

uniform Projection {
  	mat4 uProjectionMatrix;
};

uniform PointLight {
	vec3 uPointLightPosition;
};

uniform View {
	vec3 uViewWorldPosition;
};

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

out highp vec2 vTextureCoord;
out vec3 vNormal;
out vec3 vSurfaceToLight; // point light
out vec3 vSurfaceToView;

void main() {
	vTextureCoord = aTextureCoord;

	vNormal = mat3(uNormalMatrix) * aVertexNormal;

	vec3 surfaceWorldPosition = (uModelWorldMatrix * aVertexPosition).xyz;

	vSurfaceToLight = uPointLightPosition - surfaceWorldPosition;
	vSurfaceToView = uViewWorldPosition - surfaceWorldPosition;

	gl_Position = uProjectionMatrix * uModelWorldMatrix * aVertexPosition;
}

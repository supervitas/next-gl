#version 300 es

uniform mat4 uNormalMatrix;
uniform mat4 uModelWorldMatrix;

uniform Projection {
  	mat4 uProjectionMatrix;
};

uniform View {
	vec3 uViewWorldPosition;
};

uniform PointLight {
	vec3 uPointLightPosition;
};

uniform DirectLight {
	vec3 uDirectLightPosition;
};

uniform SpotLight {
	vec3 uSpotLightPosition;
};


in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

out highp vec2 vTextureCoord;

out vec3 vNormal;
out vec3 vSurfaceToView;

out vec3 vSurfaceToPointLight;
out vec3 vSurfaceToDirectLight;
out vec3 vSurfaceToSpotLight;

void main() {
	vTextureCoord = aTextureCoord;

	vNormal = mat3(uNormalMatrix) * aVertexNormal;

	vec3 surfaceWorldPosition = (uModelWorldMatrix * aVertexPosition).xyz;

	vSurfaceToPointLight = uPointLightPosition - surfaceWorldPosition;
	vSurfaceToDirectLight = uDirectLightPosition - surfaceWorldPosition;
	vSurfaceToSpotLight = uSpotLightPosition - surfaceWorldPosition;

	vSurfaceToView = uViewWorldPosition - surfaceWorldPosition;

	gl_Position = uProjectionMatrix * uModelWorldMatrix * aVertexPosition;
}

#version 300 es

const int MAX_POINT_LIGHTS_IN_ARRAY = 2;
const int MAX_DIRECT_LIGHTS_IN_ARRAY = 2;
const int MAX_SPOT_LIGHTS_IN_ARRAY = 2;

uniform mat4 uNormalMatrix;
uniform mat4 uModelWorldMatrix;

uniform Projection {
  	mat4 uProjectionMatrix;
};

uniform View {
	vec3 uViewWorldPosition;
};

uniform PointLight {
	vec3 uPointLightPosition[MAX_POINT_LIGHTS_IN_ARRAY];
};

uniform DirectLight {
	vec3 uDirectLightPosition[MAX_DIRECT_LIGHTS_IN_ARRAY];
};

uniform SpotLight {
	vec3 uSpotLightPosition[MAX_SPOT_LIGHTS_IN_ARRAY];
};


in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

out highp vec2 vTextureCoord;

out vec3 vNormal;
out vec3 vSurfaceToView;

out vec3 vSurfacesToPointLight[MAX_POINT_LIGHTS_IN_ARRAY];
out vec3 vSurfacesToDirectLight[MAX_DIRECT_LIGHTS_IN_ARRAY];
out vec3 vSurfacesToSpotLight[MAX_SPOT_LIGHTS_IN_ARRAY];

void calcSurfacesToLights(vec3 surfaceWorldPosition) {
	for (int i = 0; i < MAX_DIRECT_LIGHTS_IN_ARRAY; i++) {
    	vSurfacesToDirectLight[i] = uDirectLightPosition[i] - surfaceWorldPosition;
	}

	for (int i = 0; i < MAX_POINT_LIGHTS_IN_ARRAY; i++) {
		vSurfacesToPointLight[i] = uPointLightPosition[i] - surfaceWorldPosition;
	}

	for (int i = 0; i < MAX_SPOT_LIGHTS_IN_ARRAY; i++) {
		vSurfacesToSpotLight[i] = uSpotLightPosition[i] - surfaceWorldPosition;
	}
}

void main() {
	vTextureCoord = aTextureCoord;

	vNormal = mat3(uNormalMatrix) * aVertexNormal;

	vec3 surfaceWorldPosition = (uModelWorldMatrix * aVertexPosition).xyz;
	calcSurfacesToLights(surfaceWorldPosition);
	vSurfaceToView = uViewWorldPosition - surfaceWorldPosition;

	gl_Position = uProjectionMatrix * uModelWorldMatrix * aVertexPosition;
}

#version 300 es

precision mediump float;

struct DirectLight {
	float u_intencity;
	vec3 u_color;
	vec3 u_direction;
};

// uniform uAmbientLight {
// 	float intencity;
// 	vec3 color;
// } ambient[2];

uniform Lights {
	DirectLight directLight;
} u_lights;

uniform vec3 uColor;

#ifdef USE_MAP
	uniform sampler2D map;
#endif

in highp vec2 vTextureCoord;
in highp vec3 vLighting;
in vec3 vNormal;

out vec4 resultColor;

void main() {
  	highp vec4 texelColor = vec4(uColor, 1.0);

	vec3 ambientLight = vec3(1.0, 1.0, 1.0) * 0.3;
	// float light = max(dot(normal, vec3(0.15, 0.8, 0.75)), 0.0) * directIntencity;

	// vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);


  	vec3 normal = normalize(vNormal);
	// vec3 ambientLight = ambient[0].color * ambient[0].intencity;

	float light = max(dot(normal, u_lights.directLight.u_direction), 0.0) * u_lights.directLight.u_intencity;


	vec3 vLighting = (u_lights.directLight.u_color * light);

	#ifdef USE_MAP
		texelColor = texture(map, vTextureCoord) * texelColor;
	#endif

	resultColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}

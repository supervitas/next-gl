#version 300 es

precision highp float;

struct DirectLight {
	float u_intencity;
	vec3 u_color;
	vec3 u_direction;
};

struct AmbientLight {
	float u_intencity;
	vec3 u_color;
};

uniform Lights {
	DirectLight directLight;
	AmbientLight ambientLight;
} u_lights;

uniform vec3 uColor;

#ifdef USE_MAP
	uniform sampler2D map;
#endif

in highp vec2 vTextureCoord;
in highp vec3 vLighting;
in vec3 vNormal;

out vec4 resultColor;

vec3 calc_ambient(AmbientLight ambient) {
	return ambient.u_color * ambient.u_intencity;
}

vec3 calc_direct(DirectLight direct, vec3 normal) {
	return direct.u_color * max(dot(normal, direct.u_direction), 0.0) * direct.u_intencity;
}

void main() {
  	highp vec3 texelColor = uColor;

  	vec3 normal = normalize(vNormal);


	vec3 ambientLight = calc_ambient(u_lights.ambientLight);
	vec3 directLight = calc_direct(u_lights.directLight, normal);

	vec3 vLighting = ambientLight + directLight;

	#ifdef USE_MAP
		texelColor = texture(map, vTextureCoord).rgb * texelColor;
	#endif

	resultColor = vec4(texelColor.rgb * vLighting, 1.0);
}

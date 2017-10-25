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

struct PointLight {
	float u_intencity;
	float u_power;
	vec3 u_color;
	vec3 u_specular_color;
};

uniform Lights {
	DirectLight directLight;
	AmbientLight ambientLight;
	PointLight pointLight;
} u_lights;

uniform vec3 uColor;

#ifdef USE_MAP
	uniform sampler2D map;
#endif

in vec3 vSurfaceToLight;
in vec3 vSurfaceToView;

in highp vec2 vTextureCoord;
in highp vec3 vLighting;
in vec3 vNormal;

out vec4 resultColor;

vec3 calc_ambient_light(AmbientLight ambient) {
	return ambient.u_color * ambient.u_intencity;
}

vec3 calc_direct_light(DirectLight direct, vec3 normal) {
	return direct.u_color * max(dot(normal, direct.u_direction), 0.0) * direct.u_intencity;
}

vec3 calc_point_light(PointLight point, vec3 normal, vec3 surfaceToLightDirection) {
	return point.u_color * max(dot(normal, surfaceToLightDirection), 0.0) * point.u_intencity;
}

void main() {
  	highp vec3 texelColor = uColor;

  	vec3 normal = normalize(vNormal);
  	vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
  	vec3 surfaceToViewDirection = normalize(vSurfaceToView);

  	vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);


	vec3 ambientLight = calc_ambient_light(u_lights.ambientLight);
  	vec3 pointLight = calc_point_light(u_lights.pointLight, normal, surfaceToLightDirection);
	vec3 directLight = calc_direct_light(u_lights.directLight, normal);

	vec3 specular = max(pow(dot(normal, halfVector), u_lights.pointLight.u_power), 0.0) * u_lights.pointLight.u_specular_color;

	vec3 vLighting = ambientLight + directLight + pointLight;

	#ifdef USE_MAP
		texelColor = texture(map, vTextureCoord).rgb * texelColor;
	#endif

	resultColor = vec4(texelColor.rgb * vLighting, 1.0);
	resultColor.rgb += specular;
}

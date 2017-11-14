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
	vec3 u_color;
};

struct SpotLight {
	float u_intencity;
	vec3 u_color;
	vec3 u_light_direction;
	float u_innerLimit;
    float u_outerLimit;
};

uniform Lights {
	DirectLight directLight;
	AmbientLight ambientLight;
	PointLight pointLight;
	SpotLight spotLight;
} u_lights;

uniform vec3 uColor;

#ifdef USE_MAP
	uniform sampler2D map;
#endif

in vec3 vSurfaceToView;

in vec3 vSurfaceToPointLight;
in vec3 vSurfaceToDirectLight;
in vec3 vSurfaceToSpotLight;

in highp vec2 vTextureCoord;
in vec3 vNormal;

out vec4 resultColor;

vec3 calcAmbientLight(AmbientLight ambient) {
	return ambient.u_color * ambient.u_intencity;
}

vec3 calcDirectLight(DirectLight direct, vec3 normal) {
	return direct.u_color * max(dot(normal, direct.u_direction), 0.0) * direct.u_intencity;
}

vec3 calcPointLight(PointLight point, vec3 normal, vec3 surfaceToLightDirection) {
	return point.u_color * max(dot(normal, surfaceToLightDirection), 0.0) * point.u_intencity;
}

vec3 calcSpotLight(SpotLight spot, vec3 normal, vec3 surfaceToLightDirection) {
	float dotFromDirection = dot(surfaceToLightDirection, -spot.u_light_direction);
	float inLight = smoothstep(spot.u_outerLimit, spot.u_innerLimit, dotFromDirection);
	float light = inLight * dot(normal, surfaceToLightDirection);

	return spot.u_color * light * spot.u_intencity;
}

vec3 calcSpecular(vec3 normal, vec3 halfVector, float intencity, vec3 specularColor) {
	return max(pow(dot(normal, halfVector), 150.0 / intencity), 0.0) * specularColor;
}

void main() {
  	highp vec3 texelColor = uColor;

  	vec3 normal = normalize(vNormal);

  	vec3 surfaceToViewDirection = normalize(vSurfaceToView);

  	vec3 surfaceToPointLightDirection = normalize(vSurfaceToPointLight);
  	vec3 halfVectorFromPointLight = normalize(surfaceToPointLightDirection + surfaceToViewDirection);

  	vec3 surfaceToDirectLightDirection = normalize(vSurfaceToDirectLight);
  	vec3 halfVectorFromDirectLight = normalize(surfaceToDirectLightDirection + surfaceToViewDirection);

  	vec3 surfaceToSpotLightDirection = normalize(vSurfaceToSpotLight);
  	vec3 halfVectorFromSpotLight = normalize(surfaceToSpotLightDirection + surfaceToViewDirection);


	vec3 ambientLight = calcAmbientLight(u_lights.ambientLight);
  	vec3 pointLight = calcPointLight(u_lights.pointLight, normal, surfaceToPointLightDirection);
	vec3 directLight = calcDirectLight(u_lights.directLight, normal);
	vec3 spotLight = calcSpotLight(u_lights.spotLight, normal, surfaceToSpotLightDirection);

	vec3 specularForPointLight = calcSpecular(normal, halfVectorFromPointLight, u_lights.pointLight.u_intencity, u_lights.pointLight.u_color);
	vec3 specularForDirectLight = calcSpecular(normal, halfVectorFromDirectLight, u_lights.directLight.u_intencity, u_lights.directLight.u_color);
	vec3 specularForSpotLight = calcSpecular(normal, halfVectorFromSpotLight, u_lights.spotLight.u_intencity, u_lights.spotLight.u_color);


	#ifdef USE_MAP
		texelColor = texture(map, vTextureCoord).rgb * texelColor;
	#endif

	vec3 vLighting = ambientLight + directLight + pointLight + spotLight;

	texelColor.rgb *= vLighting + specularForDirectLight + specularForPointLight + specularForSpotLight;

	resultColor = vec4(texelColor.rgb, 1.0);
}

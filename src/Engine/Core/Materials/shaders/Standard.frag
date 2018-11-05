#version 300 es
#define EPSILON 0.00001

precision highp float;
precision highp sampler2DShadow;


#include <direct_light>
#include <ambient_light>
#include <point_light>
#include <spot_light>

uniform Lights {
	#if DIRECT_LIGHTS > 0
		DirectLight directLight[DIRECT_LIGHTS];
	#endif

	#if POINT_LIGHTS > 0
		PointLight pointLight[POINT_LIGHTS];
	#endif

	#if SPOT_LIGHTS > 0
		SpotLight spotLight[SPOT_LIGHTS];
	#endif

	#if AMBIENT_LIGHTS > 0
		AmbientLight ambientLight[AMBIENT_LIGHTS];
	#endif
} u_lights;

uniform vec3 uColor;
uniform float opacity;

uniform sampler2DShadow shadowMap;


#ifdef USE_MAP
	uniform sampler2D map;
#endif

in vec3 vSurfaceToView;
in vec3 vSurfaceWorldPosition;

in highp vec2 vUV;
in vec3 vNormal;
in vec4 vShadowCoord;

out vec4 resultColor;

vec3 calcSpecular(vec3 normal, vec3 halfVector, float intencity, vec3 specularColor) {
	return max(pow(dot(normal, halfVector), 150.0 / intencity), 0.0) * specularColor;
}

void calcSceneLights(vec3 normal, inout vec3 lighting, inout vec3 specular) {
 	vec3 surfaceToViewDirection = normalize(vSurfaceToView);

	#if DIRECT_LIGHTS > 0
		for (int i = 0; i < DIRECT_LIGHTS; i++) {

			vec3 surfaceToDirectLightDirection = normalize(u_lights.directLight[i].u_position - vSurfaceWorldPosition);
			vec3 halfVectorFromDirectLight = normalize(surfaceToDirectLightDirection + surfaceToViewDirection);

			vec3 directLight = calcDirectLight(u_lights.directLight[i], normal);
			vec3 specularForDirectLight = calcSpecular(normal, halfVectorFromDirectLight, u_lights.directLight[i].u_intencity, u_lights.directLight[i].u_color);

			lighting += directLight;
			specular += specularForDirectLight;
		}
	#endif

	#if POINT_LIGHTS > 0
		for (int i = 0; i < POINT_LIGHTS; i++) {
			vec3 surfaceToPointLightDirection = normalize(u_lights.pointLight[i].u_position - vSurfaceWorldPosition);
			vec3 halfVectorFromPointLight = normalize(surfaceToPointLightDirection + surfaceToViewDirection);


			vec3 pointLight = calcPointLight(u_lights.pointLight[i], normal, surfaceToPointLightDirection);
			vec3 specularForPointLight = calcSpecular(normal, halfVectorFromPointLight, u_lights.pointLight[i].u_intencity, u_lights.pointLight[i].u_color);

			lighting += pointLight;
			specular += specularForPointLight;

		}
	#endif

	#if SPOT_LIGHTS > 0
		for (int i = 0; i < SPOT_LIGHTS; i++) {
			vec3 surfaceToSpotLightDirection = normalize(u_lights.spotLight[i].u_position - vSurfaceWorldPosition);
			vec3 halfVectorFromSpotLight = normalize(surfaceToSpotLightDirection + surfaceToViewDirection);

			vec3 spotLight = calcSpotLight(u_lights.spotLight[i], normal, surfaceToSpotLightDirection);
			vec3 specularForSpotLight = calcSpecular(normal, halfVectorFromSpotLight, u_lights.spotLight[i].u_intencity, u_lights.spotLight[i].u_color);

			lighting += spotLight;
			specular += specularForSpotLight;
		}
	#endif

	#if AMBIENT_LIGHTS > 0
		for (int i = 0; i < AMBIENT_LIGHTS; i++) {
			vec3 ambientLight = calcAmbientLight(u_lights.ambientLight[i]);
			lighting += ambientLight;
		}
	#endif
}


void main() {
  	highp vec4 texelColor = vec4(1.0);

  	vec3 normal = normalize(vNormal);

  	vec3 lighting = vec3(0.0);
  	vec3 specular = vec3(0.0);

  	calcSceneLights(normal, lighting, specular);

	float visibility = 1.0;

	#ifdef USE_MAP
		texelColor = texture(map, vUV);
		vec3 shadowCoord = vec3(vShadowCoord.x, vShadowCoord.y, vShadowCoord.z - 0.0001);// bias needed to be setted

		float shadow = texture(shadowMap, shadowCoord);
		visibility = shadow;
	#endif


	texelColor.rgb *= uColor * ((lighting + specular)) * visibility;
	texelColor.a *= opacity;
	resultColor = texelColor;
}

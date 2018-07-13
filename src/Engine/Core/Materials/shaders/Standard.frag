#version 300 es
precision highp float;

const int MAX_POINT_LIGHTS_IN_ARRAY = 2;
const int MAX_DIRECT_LIGHTS_IN_ARRAY = 2;
const int MAX_SPOT_LIGHTS_IN_ARRAY = 2;
const int MAX_AMBIENT_LIGHTS_IN_ARRAY = 2;

struct DirectLight {
	float u_intencity;
	vec3 u_color;
	vec3 u_direction;
	vec3 u_position;
};

struct AmbientLight {
	float u_intencity;
	vec3 u_color;
};

struct PointLight {
	float u_intencity;
	vec3 u_color;
	vec3 u_position;
};

struct SpotLight {
	float u_intencity;
	vec3 u_color;
	vec3 u_position;
	vec3 u_light_direction;
	float u_innerLimit;
    float u_outerLimit;
};

uniform Lights {
	DirectLight directLight[MAX_DIRECT_LIGHTS_IN_ARRAY];
	PointLight pointLight[MAX_POINT_LIGHTS_IN_ARRAY];
	SpotLight spotLight[MAX_SPOT_LIGHTS_IN_ARRAY];
	AmbientLight ambientLight[MAX_AMBIENT_LIGHTS_IN_ARRAY];
} u_lights;

uniform vec3 uColor;
uniform float opacity;

uniform sampler2D shadowMap;

#ifdef USE_MAP
	uniform sampler2D map;
#endif

in vec3 vSurfaceToView;
in vec3 vSurfaceWorldPosition;

in highp vec2 vTextureCoord;
in vec3 vNormal;
in vec4 vShadowCoord;

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

void calcSceneLights(vec3 normal, inout vec3 lighting, inout vec3 specular) {
 	vec3 surfaceToViewDirection = normalize(vSurfaceToView);

	for (int i = 0; i < MAX_DIRECT_LIGHTS_IN_ARRAY; i++) {

		vec3 surfaceToDirectLightDirection = normalize(u_lights.directLight[i].u_position - vSurfaceWorldPosition);
		vec3 halfVectorFromDirectLight = normalize(surfaceToDirectLightDirection + surfaceToViewDirection);

		vec3 directLight = calcDirectLight(u_lights.directLight[i], normal);
		vec3 specularForDirectLight = calcSpecular(normal, halfVectorFromDirectLight, u_lights.directLight[i].u_intencity, u_lights.directLight[i].u_color);

		lighting += directLight;
		specular += specularForDirectLight;
	}

	for (int i = 0; i < MAX_POINT_LIGHTS_IN_ARRAY; i++) {
		vec3 surfaceToPointLightDirection = normalize(u_lights.pointLight[i].u_position - vSurfaceWorldPosition);
		vec3 halfVectorFromPointLight = normalize(surfaceToPointLightDirection + surfaceToViewDirection);


		vec3 pointLight = calcPointLight(u_lights.pointLight[i], normal, surfaceToPointLightDirection);
		vec3 specularForPointLight = calcSpecular(normal, halfVectorFromPointLight, u_lights.pointLight[i].u_intencity, u_lights.pointLight[i].u_color);

		lighting += pointLight;
		specular += specularForPointLight;

	}

	for (int i = 0; i < MAX_SPOT_LIGHTS_IN_ARRAY; i++) {
		vec3 surfaceToSpotLightDirection = normalize(u_lights.spotLight[i].u_position - vSurfaceWorldPosition);
		vec3 halfVectorFromSpotLight = normalize(surfaceToSpotLightDirection + surfaceToViewDirection);

		vec3 spotLight = calcSpotLight(u_lights.spotLight[i], normal, surfaceToSpotLightDirection);
		vec3 specularForSpotLight = calcSpecular(normal, halfVectorFromSpotLight, u_lights.spotLight[i].u_intencity, u_lights.spotLight[i].u_color);

		lighting += spotLight;
		specular += specularForSpotLight;
	}

	for (int i = 0; i < MAX_AMBIENT_LIGHTS_IN_ARRAY; i++) {
		vec3 ambientLight = calcAmbientLight(u_lights.ambientLight[i]);
		lighting += ambientLight;
	}
}

float shadowCalculation(vec4 fragPosLightSpace, sampler2D u_shadowMap, float bias) {
   // perform perspective divide and map to [0,1] range
   vec3 projCoords = fragPosLightSpace.xyz/fragPosLightSpace.w;
   projCoords = projCoords * 0.5 + 0.5;
   float shadowDepth = texture(u_shadowMap, projCoords.xy).r;
   float depth = projCoords.z;
   float shadow = step(depth-bias,shadowDepth);

   return shadow;
}

void main() {
  	highp vec4 texelColor = vec4(1.0);

  	vec3 normal = normalize(vNormal);

  	vec3 lighting = vec3(0.0);
  	vec3 specular = vec3(0.0);

  	calcSceneLights(normal, lighting, specular);

	float visibility = 1.0;

	#ifdef USE_MAP
		texelColor = texture(shadowMap, vShadowCoord.xy) * 144.;
//		texelColor = texture(map, vTextureCoord);
//			if ( texture( shadowMap, vShadowCoord.xy ).z  <  vShadowCoord.z) {
//        		visibility = 0.5;
//        	}
//		float shadow = shadowCalculation()
	#endif


	texelColor.rgb *= uColor * ((lighting + specular) );
	texelColor.a *= opacity;
	resultColor = texelColor;
}

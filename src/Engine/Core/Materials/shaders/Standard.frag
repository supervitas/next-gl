#version 300 es

precision mediump float;

uniform vec4 uColor;

#ifdef USE_MAP
	uniform sampler2D map;
#endif

in highp vec2 vTextureCoord;
in highp vec3 vLighting;
in vec3 v_normal;

out vec4 resultColor;

void main() {
  	highp vec4 texelColor = uColor;

  	vec3 normal = normalize(v_normal);
	vec3 ambientLight = vec3(1.0, 1.0, 1.0) * 0.3;
	float light = max(dot(normal, vec3(0.15, 0.8, 0.75)), 0.0);

	vec3 directionalLightColor = vec3(1, 1, 1);

	vec3 vLighting = ambientLight + (directionalLightColor * light);

	#ifdef USE_MAP
		texelColor = texture(map, vTextureCoord) * texelColor;
	#endif

	resultColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}

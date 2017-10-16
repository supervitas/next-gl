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

void main(void) {
  highp vec4 texelColor = uColor;

  vec3 normal = normalize(v_normal);
  float light = dot(normal, vec3(0.15, 0.8, 0.75)); // direction


  #ifdef USE_MAP
  	texelColor = texture(map, vTextureCoord) * texelColor;
  #endif

  resultColor = vec4(texelColor.rgb * light, texelColor.a);
}

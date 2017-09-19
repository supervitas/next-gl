#version 300 es

precision mediump float;

uniform vec4 uColor;

#ifdef USE_MAP
	uniform sampler2D map;
#endif

in highp vec2 vTextureCoord;
in highp vec3 vLighting;

out vec4 resultColor;

void main(void) {
  highp vec4 texelColor = uColor;

  #ifdef USE_MAP
  	texelColor = texture(uSampler, vTextureCoord) * vColor;
  #endif

  resultColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}

#version 300 es

precision highp float;
uniform sampler2D uSampler;

in highp vec2 vTextureCoord;
in highp vec3 vLighting;

out vec4 resultColor;

void main(void) {
  highp vec4 texelColor = texture(uSampler, vTextureCoord);
  resultColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}

#version 300 es

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

out highp vec2 vTextureCoord;
out highp vec3 vLighting;
out vec3 v_normal;

void main() {
  vTextureCoord = aTextureCoord;

  v_normal = mat3(uNormalMatrix) * aVertexNormal;

  gl_Position =  uModelViewMatrix * aVertexPosition;
}

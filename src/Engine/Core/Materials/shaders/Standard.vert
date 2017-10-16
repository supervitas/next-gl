#version 300 es

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

out highp vec2 vTextureCoord;
out vec3 vNormal;

void main() {
  vTextureCoord = aTextureCoord;

  vNormal = mat3(uNormalMatrix) * aVertexNormal;

  gl_Position =  uModelViewMatrix * aVertexPosition;
}

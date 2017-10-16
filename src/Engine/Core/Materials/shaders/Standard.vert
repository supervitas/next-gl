#version 300 es

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

out highp vec2 vTextureCoord;
out highp vec3 vLighting;

out vec3 v_normal;

void main(void) {
  vTextureCoord = aTextureCoord;
  
  highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);

  highp vec3 directionalLightColor = vec3(1, 1, 1);

  highp vec3 directionalVector = normalize(vec3(0.15, 0.8, 0.75));

  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  
  vLighting = ambientLight + (directionalLightColor * directional);

  v_normal = mat3(uNormalMatrix) * aVertexNormal;

  gl_Position =  uModelViewMatrix * aVertexPosition;
}

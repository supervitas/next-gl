struct PointLight {
	float u_intencity;
	vec3 u_color;
	vec3 u_position;
};


vec3 calcPointLight(PointLight point, vec3 normal, vec3 surfaceToLightDirection) {
	return point.u_color * max(dot(normal, surfaceToLightDirection), 0.0) * point.u_intencity;
}


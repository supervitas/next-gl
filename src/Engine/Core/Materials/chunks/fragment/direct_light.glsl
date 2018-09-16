struct DirectLight {
	float u_intencity;
	vec3 u_color;
	vec3 u_direction;
	vec3 u_position;
};


vec3 calcDirectLight(DirectLight direct, vec3 normal) {
	return direct.u_color * max(dot(normal, direct.u_direction), 0.0) * direct.u_intencity;
}

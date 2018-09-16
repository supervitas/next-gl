struct AmbientLight {
	float u_intencity;
	vec3 u_color;
};


vec3 calcAmbientLight(AmbientLight ambient) {
	return ambient.u_color * ambient.u_intencity;
}

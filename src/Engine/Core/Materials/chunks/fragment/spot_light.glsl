struct SpotLight {
	float u_intencity;
	vec3 u_color;
	vec3 u_position;
	vec3 u_light_direction;
	float u_innerLimit;
    float u_outerLimit;
};

vec3 calcSpotLight(SpotLight spot, vec3 normal, vec3 surfaceToLightDirection) {
	float dotFromDirection = dot(surfaceToLightDirection, -spot.u_light_direction);
	float inLight = smoothstep(spot.u_outerLimit, spot.u_innerLimit, dotFromDirection);
	float light = inLight * dot(normal, surfaceToLightDirection);

	return spot.u_color * light * spot.u_intencity;
}

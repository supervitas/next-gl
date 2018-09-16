import ambientFragment from './fragment/ambient_light.glsl';
import directFragment from './fragment/direct_light.glsl';
import pointFragment from './fragment/point_light.glsl';
import spotLight from './fragment/spot_light.glsl';

export default {
	ambient_light: ambientFragment,
	direct_light: directFragment,
	point_light: pointFragment,
	spot_light: spotLight,
};

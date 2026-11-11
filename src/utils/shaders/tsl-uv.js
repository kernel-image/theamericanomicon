//map uv to rgb
import { uv, vec3 } from 'three/tsl';

const _uv = uv();
const uvs = vec3(_uv.x, _uv.y, 0);

const uvmap = () => {
    return uvs;
}

export { uvmap }
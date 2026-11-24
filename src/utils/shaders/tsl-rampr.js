import {Fn, distance, vec2, uv, float} from 'three/tsl';

const rampr = /*@__PURE__*/ Fn(([x=float(0.5), y=float(0.5), k=1]) => {
    return distance(vec2(x,y), uv()).pow(k);
});

export {rampr}
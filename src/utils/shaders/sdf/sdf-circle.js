import * as THREE from 'three';
import { Fn, uv, smoothstep } from 'three/tsl';

const circle = /*@__PURE__*/ Fn(([position, radius]) => {
  return length(position).sub(radius)
}, { position: "vec2", radius: "float", return: "float"});

const drawCircle = /*@__PURE__*/ Fn(({radius=0.5, placement=vec2(1,1), insideColor=vec3(1.0), outsideColor=vec3(0), bgColor=vec3(0), outline=false, expantion=0.1, echosAmt=0.0, echosFreq=1.0}) => {
    const scale = 1;
    const imageRes = vec2(1);
    const p = ((1/scale) * uv() - imageRes * placement)/min(imageRes.x, imageRes.y);
    const d = circle(p, radius);
    const fill = (d > 0 ? outsideColor : insideColor) * 
        (1.0 - exp(-1 * shadowFactor * abs(d)) * shadowAmt) * 
        (echosAmt*cos(100 * echosFreq * abs(d)));
    const domain = outline ? abs(d) : d;
    const out = mix(fill, bgColor, smoothstep(0, expantion, domain));
    return out;
});

export { circle, drawCircle };
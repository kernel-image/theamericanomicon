import {Fn, color, smoothstep, mix, mx_fractal_noise_float, uv, vec2, vec3} from 'three/tsl';
import { rampr } from '../tsl-rampr';
export const defaultFloorShader = /*@__PURE__*/ Fn(()=>{
    const baseColor = color(0x332211);
    const highlightColor = baseColor.add(vec3(0.1));
    const smallNoise = mx_fractal_noise_float(uv().mul(vec2(100.0)), 1, 1, 5, 0.25);
    const bigNoise = mx_fractal_noise_float(uv().mul(vec2(20.0)), 1);
    const mixedNoise = smallNoise.mul(bigNoise);
    const highNoise = mix(baseColor, highlightColor, mixedNoise);
    const ramp = rampr(0.5, 0.5, 0.3).oneMinus();
    const colorRamp = highNoise.mul(smoothstep(0.0, 0.5, ramp));
    return colorRamp;
});
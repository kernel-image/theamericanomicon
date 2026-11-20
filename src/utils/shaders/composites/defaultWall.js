import {Fn, Loop, vec2, vec3, uv, float, time, fract} from 'three/tsl';
import { drawBox } from '../sdf/sdf-box';

export const defaultWallShader = Fn(([maxShapes=6, speed=0.1]) => {
    const st = fract(uv());
    let out = vec3(0).toVar();
    Loop(maxShapes, ({i})=> {
        const x = fract(float(i).div(maxShapes).add(0.1).add(time.mul(speed)));
        out.addAssign(drawBox(st.sub(vec2(x, 0.5)), vec2(0.1/2.5, 0.1)));
    });
    return out;
});
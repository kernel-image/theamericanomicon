import { Fn, vec2 } from 'three/tsl';

export const constantBehavior = {
    'position':
        Fn(([xOffset, yOffset, st])=>{
            return vec2(xOffset, yOffset).mul(st);
        }),
    'scale':
        Fn(([xOffset, yOffset])=> vec2(xOffset, yOffset))
};

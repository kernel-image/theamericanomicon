import { Fn, smoothstep } from "three/tsl";

export const drawSDF = /*@_PURE_@*/ Fn((d, outsideColor=0xffffff, insideColor=0xffffff, bgColor=0x000000, outline = false, expantion=0.1, shadowAmt=0.0, shadowFactor=1.0, echosAmt=0.0, echosFreq=1.0, )=>{
    const fill = (d > 0 ? outsideColor : insideColor) * 
        (1.0 - exp(-1 * shadowFactor * abs(d)) * shadowAmt) * 
        (echosAmt*cos(100 * echosFreq * abs(d)));
    const domain = outline ? abs(d) : d;
    const out = mix(fill, bgColor, smoothstep(0, expantion, domain));
    return out;
}, {d: 'vec2', outsideColor: 'vec3', insideColor: 'vec3', bgColor: 'vec3', outline: 'boolean', shadowAmt: 'float', shadowFactor: 'float', echosAmt: 'float', echosFreq:'float', expantion:'float', return:'vec3'});


import { Fn, vec2, vec3, min, max, abs, length, smoothstep } from "three/tsl";
import { drawSDF } from "./drawSdf";


const box = /*@__PURE__@*/ Fn(([p=vec2(0.5), b=vec2(0.5)])=>{
    const d = abs(p).sub(b);
    return length(max(d,0.0)).add(min(max(d.x,d.y),0.0));
}, {p: 'vec2', b: 'vec2', return: 'float'});

const drawBox = /*@__PURE__*/ Fn(([ p, b = vec2(0.5),  expantion = 0.001]) => {
    const d = box(p, b);
    return vec3(smoothstep(0, expantion, d).oneMinus());
}, {p:'vec2', b:'vec2', expantion:'float', return:'vec3'});

const renderBox = /*@__PURE__*/ Fn(({ p, b = vec2(0.5), insideColor = vec3(1.0), outsideColor = vec3(0), bgColor = vec3(0), outline = false, expantion = 0.001, shadowAmt = 0.0, shadowFactor = 1.0, echosAmt = 0.0, echosFreq = 1.0 }) => {
    const d = box(p, b);
    return drawSDF(d, insideColor, outsideColor, bgColor, outline, expantion, shadowAmt, shadowFactor, echosAmt, echosFreq);
}, {p:'vec2', b:'vec2', insideColor:'vec3', outsideColor:'vec3', bgColor:'vec3', outline:'bool', expantion:'float', shadowAmt:'float', shadowFactor:'float', echosAmt:'float', echosFreq:'float', return:'vec3'});


export {drawBox, renderBox}


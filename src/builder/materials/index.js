import { matUv } from './mat-uv'
import { matWireframe } from './mat-wireframe';

function matLookup(key){
    switch(key){
        case "uv": 
            return matUv;
        case "wireframe":
            return matWireframe;
        case "floor":
            return null;
        case "ceiling":
            return null;
        default:
            return matWireframe;
    }
}
export {
    matLookup, matWireframe as defaultMat  
};
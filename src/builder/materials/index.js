import { matUv } from './mat-uv'
import { matWireframe } from './mat-wireframe';
import { metal } from './mat-metal';
import { dirt } from './mat-dirt';

function matLookup(key){
    switch(key){
        case "uv": 
            return matUv;
        case "wireframe":
            return matWireframe;
        case "dirt":
            return dirt;
        case "metal":
            return metal;
        default:
            return matWireframe;
    }
}
export {
    matLookup, matWireframe as defaultMat  
};
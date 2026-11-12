import { matUv } from './mat-uv'
import { matWireframe } from './mat-wireframe';
import { metal } from './mat-ceiling';
import {dirt} from './mat-floor';

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
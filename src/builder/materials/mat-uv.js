import * as THREE from 'three';
import { uvmap } from "../../utils/shaders";

const matUv = (() => { 
    const mat = new THREE.MeshStandardMaterial();
    mat.name = 'mat-uv';
    mat.colorNode = uvmap();
    mat.emissiveNode = uvmap();
    //matUv.side = THREE.DoubleSide;
    return mat;
})();

export { matUv }
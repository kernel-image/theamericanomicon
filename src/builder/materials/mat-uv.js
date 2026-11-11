import * as THREE from 'three';
import { uvmap } from "../../utils/shaders";

const matUv = new THREE.MeshStandardMaterial();
matUv.name = 'mat-uv';
matUv.colorNode = uvmap();
matUv.emissiveNode = uvmap();
//matUv.side = THREE.DoubleSide;

export { matUv }
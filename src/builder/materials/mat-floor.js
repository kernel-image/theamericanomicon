import * as THREE from 'three';
import { color } from 'three/tsl';
import { metalness, roughness } from 'three/tsl';

const material = new THREE.MeshStandardMaterial({
  color: 0x140a0c,
  metalness: 0,
  roughness:0.75,
});



export {material as dirt}
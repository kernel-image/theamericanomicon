import * as THREE from 'three';

const material = new THREE.MeshPhysicalMaterial({
  color: 0x575757,
  metalness: 0.85,
  anisotropy: 0.25,
  roughness:0.15,
  iridescence:0.3,
  wireframe:false
});



export {material as metal}
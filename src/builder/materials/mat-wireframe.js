import * as THREE from 'three';

const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  emissive: 0x00ff00,
  wireframe: true
});

export {material as matWireframe}
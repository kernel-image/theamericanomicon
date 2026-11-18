import * as THREE from 'three/webgpu';
import { defaultFloorShader } from '../../utils/shaders';

const material = new THREE.MeshBasicNodeMaterial({
  colorNode: defaultFloorShader(),
});

export {material as dirt}
import * as THREE from 'three/webgpu';
import { defaultWallShader } from "../../utils/shaders";
import { positionLocal, normalLocal, mix, color, positionView, remapClamp } from 'three/tsl';

const mat = new THREE.MeshStandardNodeMaterial();
const depthFactor = remapClamp(positionView.z.negate(), 0.1, 2.0, 0.0, 1.0);
mat.colorNode = mix(color(0x111111), color(0x332233), depthFactor);
const displaceAmount = defaultWallShader().x.mul(0.2);
mat.positionNode = positionLocal.add(normalLocal.mul(displaceAmount));

export {mat as simpleBoxes};
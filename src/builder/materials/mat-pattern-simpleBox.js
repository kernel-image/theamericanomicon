import * as THREE from 'three/webgpu';
import { defaultWallShader } from "../../utils/shaders";
import { positionLocal, normalLocal, mix, color, positionView, remapClamp } from 'three/tsl';

const simpleBoxes = (() => {
    const mat = new THREE.MeshStandardNodeMaterial();
    const depthFactor = remapClamp(positionView.z.negate(), 0.1, 1.5, 0.0, 1.0);
    const albedo = mix(color(0x111111), color(0x332233), depthFactor);
    mat.colorNode = albedo;
    mat.emissiveNode = albedo;
    const displaceAmount = defaultWallShader().x.mul(0.2);
    mat.positionNode = positionLocal.add(normalLocal.mul(displaceAmount));
    return mat;
})();


export {simpleBoxes};
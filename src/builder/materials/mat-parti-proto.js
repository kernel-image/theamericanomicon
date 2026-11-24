import { MeshBasicNodeMaterial } from "three/webgpu";
import { addPartiShaders } from "../../utils/shaders/composites/particleShader";

const getPartiMat = ()=>{
    const mat = new MeshBasicNodeMaterial();
    const partiShader = addPartiShaders();
    mat.colorNode = partiShader;
    mat.emissiveNode = partiShader;
    return mat;
}

export {getPartiMat}

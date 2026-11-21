import { MeshBasicNodeMaterial } from "three/webgpu";
import { particleShader } from "../../utils/shaders";

const partiFactory = (uniformArray, posFn, sizeFn, drawFn, count, life)=>{
    const mat = new MeshBasicNodeMaterial();
    mat.colorNode = particleShader(uniformArray, posFn, sizeFn, drawFn, count, life);
    return mat;
}

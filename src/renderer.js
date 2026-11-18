import { WebGPURenderer } from 'three/webgpu';


let renderer;

async function initRenderer() {
    renderer = new WebGPURenderer({alpha: false});
    document.body.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    await renderer.init(); 
}

function getRenderer(){
    return renderer;
}

export { initRenderer, getRenderer}

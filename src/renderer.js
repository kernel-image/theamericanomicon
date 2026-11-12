import { WebGPURenderer } from 'three/webgpu';


const renderer = new WebGPURenderer({alpha: false});

async function initRenderer() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    await renderer.init();
}

function getRenderer(){
    return renderer;
}

export { initRenderer, getRenderer}

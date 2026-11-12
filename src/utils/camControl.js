import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getCamera } from '../sceneLoader';
import { getRenderer } from '../renderer';
import * as THREE from 'three';

let camControls;

function initCamControls(){
    camControls = new createCamControl( getCamera(), getRenderer() );
    setCamTarget(0, 0, .01);
}

function createCamControl(camera, renderer) {

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.NONE,
        RIGHT: THREE.MOUSE.NONE
    };
    return controls;
}

function enableCamControl(value=true){
    camControls.enabled = value;
}

function updateCamControls(){
    camControls.update();
}

function getCamTarget(){
    return camControls.target;
}

function setCamTarget(x, y, z){
    camControls.target.set(x, y, z);
}

export { initCamControls, updateCamControls, getCamTarget, setCamTarget, enableCamControl }
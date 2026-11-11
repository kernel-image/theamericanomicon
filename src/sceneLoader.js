import * as THREE from 'three';
import { getCameraData, getSceneData } from './data/config'
import { roomBuilder } from './builder/room'
import { stateMan } from './state';

let activeCam;
let activeScene;
let activePortals;

function sceneLoader(sceneData){
    if (!sceneData){
        //throw Error("Invalid scene data");
        console.log("invalid scene data, skipping overrrides");
    }
    const scene = new THREE.Scene();
    const room = roomBuilder();
    for (var i in room)
        scene.add(room[i]);
    if (sceneData.geo){
        //add supplemental objects
    }
    if (sceneData.lights){
        //add configured lights
    }else{
        // scene.add(new THREE.AmbientLight());
    }
    return scene;
}

function cameraLoader(cameraData){
    if (!cameraData){
        throw Error("Invalid camera data");
    }
    //construct camera from scene data
    const camera = new THREE.PerspectiveCamera(
        cameraData.fov,
        cameraData.aspect,
        cameraData.near || 0.001,
        cameraData.far || 50
    )
    if (cameraData?.position){
        const position = new THREE.Vector3(
            cameraData.position.x, 
            cameraData.position.y,
            cameraData.position.z
        );
        if (position != camera.position)
            camera.translateOnAxis(position.normalize(), position.length());
    }
    return camera;
}

function _getCamera(key){
    const data = key ? getSceneData(key)?.camera || getCameraData() : getCameraData();
    const cam = cameraLoader(data);
    return cam;
}

function _getScene(key){
    const data = getSceneData(key || stateMan.getCurrentScene());
    const scene = sceneLoader(data);
    return scene;
}

function _setActivePortals(){
    if (activeScene){
        activePortals = activeScene.children.filter((x)=>x.name.startsWith('abyss'));
    }else{
        console.log("no active scene, hence no portals");
    }
}

function _setCamera(sceneId=null){
    activeCam = _getCamera(sceneId);
}

function _setScene(sceneId=null){
    activeScene = _getScene(sceneId);
}

function initScene(){
    if (!activeCam)
        _setCamera();
    _setScene();
    _setActivePortals();
}


function getCamera(){
    return activeCam;
}

function getScene(){
    return activeScene;
}

function getPortals(){
    return activePortals;
}

export {initScene, getCamera, getScene, getPortals}
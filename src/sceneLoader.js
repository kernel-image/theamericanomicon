import * as THREE from 'three';
import { getSceneData } from './data/config'
import { room } from './builder/room'



function sceneLoader(sceneData){
    if (!sceneData){
        throw Error("Invalid scene data");
    }
    const scene = new THREE.Scene();
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

function cameraLoader(sceneData){
    if (!sceneData){
        throw Error("Invalid scene data");
    }
    //construct camera from scene data
    const camera = new THREE.PerspectiveCamera(
        sceneData.camera?.fov,
        sceneData.camera?.aspect,
        sceneData.camera?.near || 0.001,
        sceneData.camera?.far || 50
    )
    if (sceneData.camera?.position){
        const position = new THREE.Vector3(
            sceneData.camera.position.x, 
            sceneData.camera.position.y,
            sceneData.camera.position.z
        );
        if (position != camera.position)
            camera.translateOnAxis(position.normalize(), position.length());
    }
    return camera;
}

function getCamera(key){
    const data = getSceneData(key);
    const cam = cameraLoader(data);
    return cam;
}

function getScene(key){
    const data = getSceneData(key);
    const scene = sceneLoader(data);
    return scene;
}

export {getCamera, getScene}
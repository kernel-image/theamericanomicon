import { animate, arc } from "motion";
import { getCamera, getPortals } from "./sceneLoader";
import { getCamTarget } from "./utils/camControl";
import * as THREE from 'three';


function animateCam2Portal(portalID, duration=1){
    const target = getPortalPosition(portalID);
    const cam = getCamera();
    const camTarget = getCamTarget();
    animate(
        camTarget,
        {x:0, y:0, z:-20},
        {duration:0.3, ease: "circIn"}
    );
    animate(
        cam.position,
        {x: target.x, y: target.y, z: target.z},
        {duration: 0.98, path: arc(), ease: "quadIn"}
    );
}

function getPortalPosition(key){
    const portal = getPortals().find((x)=> x.name == key);
    return portal.geometry.boundingSphere.center;
}

function resetPosition(duration=1){
    const cam = getCamera();
    const target = getCamTarget();
    animate(
        target,
        {x:0, y:0, z:0.01},
        {duration:.01}
    );
    animate(
        cam.position,
        {x: 0, y: 0, z: 0},
        {duration: 1, ease: "circOut", path:arc()}
    );
}

export {animateCam2Portal, resetPosition}


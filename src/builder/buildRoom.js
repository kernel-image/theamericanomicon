import * as THREE from 'three';
import { boxUV } from '../utils/boxUV';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'

const wallRes = 64;
const roomScale = 2;
const portalHeight = 1.5;
const portalThickness = 0.1;


/*
 *
 * utilities
 *
 */

function createPlane(scale, subdivLevel=1, axis='z'){
    const geo = new THREE.PlaneGeometry(scale, scale, subdivLevel, subdivLevel);
    switch (axis.toLowerCase()){
        case 'x':
            geo.rotateY(Math.PI/2);
            break;
        case 'y':
            geo.rotateX(Math.PI/2);
            break;
        default:
            break;
    }
    return geo;
}

function createBeam(height=3, thickness=0.3, axis='y'){
    const geo = new THREE.BoxGeometry(thickness, height, thickness);
    switch (axis.toLowerCase()){
        case 'x':
            geo.rotateZ(Math.PI/2);
            break;
        case 'z':
            geo.rotateX(Math.PI/2);
            break;
        default:
            break;
    }
    return geo;
}

/*
 * contruction
 */



function buildWallGeo(){
    //make planes
    const wallLeft = createPlane(roomScale, wallRes, 'x');
    const wallRight = wallLeft.clone();
    const wallFront = createPlane(roomScale, wallRes);
    //fix normals
    wallRight.rotateY(Math.PI);
    wallFront.rotateY(Math.PI);
    //translate
    wallLeft.translate(roomScale/-2,0,0);
    wallRight.translate(roomScale/2,0,0);    
    wallFront.translate(0, 0, roomScale/2);
    //combine meshes
    let combinedGeo = BufferGeometryUtils.mergeGeometries([wallLeft, wallRight, wallFront]);
    //merge verticies
    const mergeDistance = 0.0001;
    combinedGeo = BufferGeometryUtils.mergeVertices(combinedGeo, mergeDistance);
    //generate uvs
    boxUV(combinedGeo);
    return combinedGeo;
}

function buildFloorGeo(){
    const geo = createPlane(roomScale, 1, 'y');
    return geo;
}

function buildPortalGeo(xOffset){
    const beamLeft = createBeam(portalHeight, portalThickness);
    beamLeft.translate(xOffset * -1,0,0);
    const beamRight = createBeam(portalHeight, portalThickness);
    beamRight.translate(xOffset,0,0);
    const beamTop = createBeam(xOffset * 2 + portalThickness * (xOffset > 0 ? 1 : -1), portalThickness, 'x');
    beamTop.translate(0,portalHeight/2 + portalThickness/2,0);
    const combinedGeo = BufferGeometryUtils.mergeGeometries([beamLeft, beamRight, beamTop]);
     
    return combinedGeo; 
}

function buildAbyss(xOffset){
    const abyss = new THREE.BoxGeometry(xOffset*2, portalHeight, 0.01);
    return abyss;
}

function buildBackWallGeo(){
    const wall = createPlane(roomScale, 1);
    wall.translate(0,0,roomScale/-2);
    return wall;
}

export function buildGeo(){
    const data = {};
    data['walls'] = buildWallGeo();
    data['floor'] = buildFloorGeo().translate(0,roomScale/2, 0);
    data['ceiling'] = buildFloorGeo().rotateZ(Math.PI).translate(0,roomScale/-2, 0);
    data['gate'] = buildBackWallGeo();
    data['portal1'] = buildPortalGeo(0.25).translate(roomScale/-4, roomScale/-3.7, roomScale/-2);
    data['portal2'] = buildPortalGeo(-0.25).translate(roomScale/4, roomScale/-3.7, roomScale/-2);
    data['abyss1'] = buildAbyss(0.25).translate(roomScale/-4, roomScale/-3.7, roomScale/-2);
    data['abyss2'] = buildAbyss(-0.25).translate(roomScale/4, roomScale/-3.7, roomScale/-2);
    return data;
}

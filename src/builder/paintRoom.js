import * as THREE from 'three';
import { matLookup, defaultMat } from './materials';

function handleMats(obj) {
    if (!obj) {
        return {
            'default': defaultMat
        }
    }
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, matLookup(value)])
    );
}

//assign shaders to geo following map data
function paintGeo (geoDict, matDict = null) {
    const geoList = Object.entries(geoDict);
    const _matDict = handleMats(matDict);
    if (geoList){
        const outMeshList = [];
        for(var i in geoList){
            const el = geoList[i];
            outMeshList.push(new THREE.Mesh(el[1], 
                _matDict[[el[0]]] || _matDict['default'])
            );
            outMeshList[outMeshList.length -1].name = el[0];
        }
        return outMeshList;
    } else {
        throw new Error("Paint Error: missing geometry and/or materials");
    }
}
export {paintGeo}







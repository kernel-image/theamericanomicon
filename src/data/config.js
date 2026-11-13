const roomData = {
    "1":{
        "audio":"path",
        "materials":{
            "walls":"uv",
            "floor":"metal",
            "ceiling":"metal",
            "gate":"metal",
            "portal1":"metal",
            "portal2":"metal",
            "abyss1":"metal",
            "abyss2":"metal"
        },
        "camera":{
            "fov":135,
            "near":null,
            "far":null,
            "position": {
                x:0,
                y:0,
                z:0
            },
        }
        
    },
    "2":{
        "audio":"path",
        "materials":{
            "walls":"uv",
            "floor":"dirt",
            "ceiling":"metal",
            "gate":"uv",
            "portal1":"uv",
            "portal2":"uv",
            "abyss1":"wireframe",
            "abyss2":"wireframe"
        },
    },
    "3":{
        "audio":"path",
        "materials":{
            "walls":"wireframe",
            "floor":"dirt",
            "ceiling":"metal",
            "gate":"wireframe",
            "portal1":"wireframe",
            "portal2":"wireframe",
            "abyss1":"uv",
            "abyss2":"uv"
        },
    }
};

const cameraData = {
    "fov": 135,
    "near": null,
    "far": null,
    "position": {
        x: 0,
        y: 0,
        z: 0
    }
}

function getSceneData(key){
    return roomData[key];
}

function getCameraData(){
    return cameraData;
}

export { getSceneData, getCameraData }
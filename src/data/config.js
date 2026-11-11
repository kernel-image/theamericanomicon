const roomData = {
    "1":{
        "audio":"path",
        "materials":{
            "walls":"wireframe",
            "floor":"uv",
            "ceiling":"uv",
            "gate":"wireframe",
            "portal1":"wireframe",
            "portal2":"wireframe",
            "abyss1":"uv",
            "abyss2":"uv"
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
            "floor":"wireframe",
            "ceiling":"wireframe",
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
            "floor":"wireframe",
            "ceiling":"wireframe",
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
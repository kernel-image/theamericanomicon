const roomData = {
    "1":{
        "audio":"mp3/845950.mp3",
        "materials":{
            "walls":"particle",
            "floor":"wireframe",
            "ceiling":"wireframe",
            "gate":"wireframe",
            "portal1":"wireframe",
            "portal2":"wireframe",
            "abyss1":"wireframe",
            "abyss2":"wireframe"
        },
        "particles":[
            {
                shape: "box",
                maxParticles: 6,
                initialSpawnCount:6,
                initialEnergy:1,
                lifespan: -1,
                directionFn: () => [-1, 0],
                audioFilter: "all",
                posOffsetFn: () => [0.2, 0.5],
                sizeFn: () => [0.1/2.5, 0.1],
            }
        ]
    },
    "2":{
        "audio":"mp3/845942.mp3",
        "materials":{
            "walls":"simpleBoxes",
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
        "audio":"mp3/845943.mp3",
        "materials":{
            "walls":"uv",
            "floor":"dirt",
            "ceiling":"metal",
            "gate":"wireframe",
            "portal1":"wireframe",
            "portal2":"wireframe",
            "abyss1":"uv",
            "abyss2":"uv"
        },
    },
    "4":{
        "audio":"mp3/845944.mp3",
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
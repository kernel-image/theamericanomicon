import {float, int, sin, cos, TWO_PI} from 'three/tsl';

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
                shape: "circle",
                maxParticles: 6,
                initialSpawnCount:6,
                initialEnergy:0.1,
                lifespan: -1,
                directionFn: () => [-1, 0],
                audioFilter: "none",
                posOffsetFn: () => [0.2, 0.5],
                sizeFn: () => [0.1/2.5, 0.1],
            },
            {
                shape: "box",
                maxParticles: 16,
                initialSpawnCount:0,
                initialEnergy:1,
                lifespan: 4,
                directionFn: () => [0, -1],
                audioFilter: "low",
                posOffsetFn: () => [0.0, 0.5],
                sizeFn: () => [0.005, 0.01],
            },
            {
                shape: "circle",
                maxParticles: 32,
                initialSpawnCount:0,
                initialEnergy:1,
                lifespan: 6,
                directionFn: ({idx}) => [float(sin(idx)).mul(float(TWO_PI)), float(cos(idx)).div(TWO_PI)],
                audioFilter: "mid-low",
                posOffsetFn: () => [0.0, 0.5],
                sizeFn: ({idx, lifePct}) => [float(lifePct).mul(float(0.1)), int(idx).mul(float(0.1))],
            }/*
            {
                shape: "circle",
                maxParticles: 32,
                initialSpawnCount:0,
                initialEnergy:1,
                lifespan: 8,
                directionFn: ({idx, lifePct}) => [Math.atan(idx) * 2 / Math.PI * lifePct, Math.atan(idx) * -2 / Math.PI],
                audioFilter: "mid-high",
                posOffsetFn: () => [0.0, 0.5],
                sizeFn: ({idx, lifePct}) => [1/lifePct * Math.sin(idx)/(Math.PI*2), 1/lifePct],
            },
            {
                shape: "circle",
                maxParticles: 64,
                initialSpawnCount:0,
                initialEnergy:1,
                lifespan: 2,
                directionFn: ({idx, lifePct}) => [Math.random(idx) * lifePct, Math.random(idx) * lifePct],
                audioFilter: "high",
                posOffsetFn: () => [0.0, 0.5],
                sizeFn: ({idx, lifePct}) => [(1-lifePct)/10, (1 - lifePct)/10],
            },
            */
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
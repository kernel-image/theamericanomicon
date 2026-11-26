import {float, int, sin, cos, atan, TWO_PI, reciprocal, inverse, hash} from 'three/tsl';

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
                shape: "circle",
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
            }
        ]
    },
    "2":{
        "audio":"mp3/845942.mp3",
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
                maxParticles: 32,
                initialSpawnCount:0,
                initialEnergy:1,
                lifespan: 8,
                directionFn: ({idx, lifePct}) => [atan(int(idx)).mul(TWO_PI).mul(float(lifePct)), atan(int(idx)).mul(TWO_PI).mul(-1)],
                audioFilter: "high",
                posOffsetFn: () => [0.0, 0.5],
                sizeFn: ({idx, lifePct}) => [reciprocal(float(lifePct)).mul(sin(int(idx))).div(TWO_PI), reciprocal(float(lifePct))],
            },
            {
                shape: "circle",
                maxParticles: 64,
                initialSpawnCount:0,
                initialEnergy:1,
                lifespan: 2,
                directionFn: ({idx, lifePct}) => [hash(int(idx)).mul(float(lifePct)), hash(int(idx)).mul(float(lifePct))],
                audioFilter: "low",
                posOffsetFn: () => [0.0, 0.5],
                sizeFn: ({idx, lifePct}) => [float(lifePct).oneMinus().div(int(10)), float(lifePct).oneMinus().div(int(10))],
            }
        ]
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
    },
    "5":{
        "audio":"",
        "materials":{
            "walls":"simpleBoxes",
            "floor":"dirt",
            "ceiling":"metal",
            "gate":"wireframe",
            "portal1":"wireframe",
            "portal2":"wireframe",
            "abyss1":"uv",
            "abyss2":"uv"
        },
    },
    "6":{
        "audio":"mp3/845946.mp3",
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
    },
    "7":{
        "audio":"",
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
    },
    "8":{
        "audio":"",
        "materials":{
            "walls":"uv",
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
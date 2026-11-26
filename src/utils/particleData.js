import * as THREE from 'three';
import { uniformArray } from 'three/tsl';
import { getAudioFilter } from './audioProcessing';


const loadPartileConfig = (partiConfigData) => {

    return partiConfigData.map((el)=> { 
        return {
            shape: el.shape,
            maxParticles: el.maxParticles,
            initialSpawnCount: el.initialSpawnCount,
            initialEnergy: el.initialEnergy,
            lifespan: el.lifespan,
            audioFilter: getAudioFilter(el.audioFilter),
            // posFn: el.posFn,
            posOffsetFn: el.posOffsetFn,
            sizeFn: el.sizeFn,
            directionFn: el.directionFn,
        }
    });

}


const particleSystemMan = (bandConfiguarationObjects = [{ maxParticles: 100, initialSpawnCount: 0, initialEnergy: 1, audioFilter: null }]) => {

    const bands = [];

    const createSpawnData = (size, initialCount, initialEnergy = 1) => {
        const data = Array.from({ length: size }, () => new THREE.Vector2(-999.0, 0));
        for (var i = 0; i < initialCount; i++) {
            data[i] = new THREE.Vector2(0, initialEnergy);
        }
        return data;
    };

    bandConfiguarationObjects.forEach((config) => {

        const spawnData = createSpawnData(config.maxParticles, config.initialSpawnCount, config.initialEnergy);
        console.log(`spawnData length: ${spawnData.length}`); // 6
        console.log(`initial spawn count: ${config.initialSpawnCount}`); // 0
        bands.push({
            shape: config.shape,
            //maxParticles: spawnData.length,
            particleData: spawnData,
            spawnDataUniform: uniformArray(spawnData, 'vec2'),
            lifespan: config.lifespan,
            nextSlot: Number(config.initialSpawnCount) % (spawnData.length - 1),
            lastTriggerTime: -999.0,
            audioFilter: config.audioFilter,
            posOffsetFn: config.posOffsetFn,
            sizeFn: config.sizeFn,
            directionFn: config.directionFn,
        });

    });
    console.log(bands); // bands[1].nextSlot = NaN !?
    return bands;

}

export { particleSystemMan, loadPartileConfig }
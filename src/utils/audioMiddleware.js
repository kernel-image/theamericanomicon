import { uniformArray } from 'three/tsl';
import * as THREE from 'three';

function updateAudioSignal(analyser, freqData, elapsedTime, analysisFilters) {

  analyser.getByteFrequencyData(freqData);

  analysisFilters.forEach(band => {

    const energy = band.sampleFrequencies(freqData, band.startBin, band.endBin);

    if (energy > band.threshold && (elapsedTime - band.lastTriggerTime) > band.cooldown) {
        band.spawnData[band.nextSlot].set(elapsedTime, energy/255);
        band.nextSlot = (band.nextSlot + 1) % band.memory;
        band.lastTriggerTime = elapsedTime;
    }
  });
}

const analysisFilter = (memory, startBin, endBin, threshold = 200, cooldown = 0.2) => {
    const spawnData = Array.from({length: memory}, () => new THREE.Vector2(-999.0, 0));
    const spawnDataUniform = uniformArray(spawnData, 'vec2');
    let nextSlot = 0;
    let lastTriggerTime = -999.0;

    const sampleFrequencies = (freqData, binIdxStart, binIdxEnd) => {
        if (freqData?.length < 1) {
            console.log('no frequency data available');
            return;
        }
        if (binIdxStart < 0 || binIdxStart > binIdxEnd) {
            console.log('invalid frequency start bin');
            return;
        }
        if (binIdxEnd >= freqData.length) {
            console.log('invalid frequency end bin');
            return;
        }
        let sum = 0;
        for (var i = binIdxStart; i <= binIdxEnd; i++) {
            sum += freqData[i];
        }
        const numBins = 1 + binIdxEnd - binIdxStart;
        return sum / numBins; // 0-255 byte value
    }
    return {
        memory,
        startBin,
        endBin,
        threshold,
        cooldown,
        lastTriggerTime,
        spawnData,
        spawnDataUniform,
        nextSlot,
        sampleFrequencies
    }
};

export {updateAudioSignal, analysisFilter}




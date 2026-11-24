
function updateAudioSignal(analyser, freqData, elapsedTime, particleBands) {

  analyser.getByteFrequencyData(freqData);

  particleBands.forEach(band => {
    const audioFilter = band.audioFilter;
    const energy = audioFilter.sampleFrequencies(freqData, band.startBin, band.endBin);

    if (energy > audioFilter.threshold && (elapsedTime - band.lastTriggerTime) > audioFilter.cooldown) {
        band.spawnData[band.nextSlot].set(elapsedTime, energy/255);
        band.nextSlot = (band.nextSlot + 1) % band.memory;
        band.lastTriggerTime = elapsedTime;
    }
  });
}

const analysisFilter = (startBin, endBin, threshold = 200, cooldown = 0.2, method='avg') => {

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
        if (method == 'avg'){
            let sum = 0;
            for (var i = binIdxStart; i <= binIdxEnd; i++) {
                sum += freqData[i];
            }
            const numBins = 1 + binIdxEnd - binIdxStart;
            return sum / numBins / 255; // normalize 0-255 byte range

        } else if (method == 'max'){
            const sliced = freqData.slice(binIdxStart, binIdxEnd + 1);
            return Math.max(...sliced) / 255;
        }
        
    }
    return {
        startBin,
        endBin,
        threshold,
        cooldown,
        sampleFrequencies
    }
};

//presets assuming 12 band analyzer
const getAudioFilter = (key) => {
    switch (key.toLowerCase()){
        case 'low':
            return analysisFilter(0,3);
        case 'mid':
            return analysisFilter(4,7);
        case 'high':
            return analysisFilter(8,11);
        case 'none':
            return null;
        default:
            return analysisFilter(0,11);
    }
}

export {updateAudioSignal, getAudioFilter}




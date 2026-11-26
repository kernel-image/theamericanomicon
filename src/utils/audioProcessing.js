
function updateAudioSignal(analyser, freqData, elapsedTime, particleBands) {

  analyser.getByteFrequencyData(freqData);

    particleBands.forEach(band => {
        const audioFilter = band?.audioFilter;
        if (audioFilter) {

            const energy = audioFilter.sampleFrequencies(freqData, audioFilter.startBin, audioFilter.endBin);
            // console.log(`bins ${audioFilter.startBin} - ${audioFilter.endBin}:  energy ${energy} > threshold ${audioFilter.threshold} ? ${energy > audioFilter.threshold}`);
            // console.log(`elapsed time: ${elapsedTime} - last trigger: ${band.lastTriggerTime} > ${audioFilter.cooldown} ? ${(elapsedTime - band.lastTriggerTime) > audioFilter.cooldown}`)
            if (energy > audioFilter.threshold && (elapsedTime - band.lastTriggerTime) > audioFilter.cooldown) {

                band.particleData[band.nextSlot].set(elapsedTime, energy);
                band.nextSlot = (band.nextSlot + 1) % (band.particleData.length - 1);
                band.lastTriggerTime = elapsedTime;
                // console.log(`spawning in ${band.nextSlot} at ${elapsedTime}`);
            }
        }
    });
}

const analysisFilter = (startBin, endBin, threshold = 0.1, cooldown = 0.2, method='avg') => {

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

//presets assuming 16 band analyzer
const getAudioFilter = (key) => {
    switch (key.toLowerCase()){
        case 'low':
            return analysisFilter(0,3);
        case 'mid-low':
            return analysisFilter(4,7);
        case 'mid-high':
            return analysisFilter(8,11);
        case 'high':
            return analysisFilter(12,15);
        case 'none':
            return null;
        case 'all':
        default:
            return analysisFilter(0,15);
    }
}

export {updateAudioSignal, getAudioFilter}




import { getAudioPath } from "./sceneLoader";

const audioCtx = new AudioContext();
const audioEl = new Audio();
let analyzer, volume, progressCaptureId, fadeId, isMuted, freqData;
const progressCaptureInterval = 7000;
const trackProgress = {};

const initAudio = () => {

    document.body.addEventListener("click", () => {
        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    });

    const initStream = (ctx, element, url) => {
        console.log(`initializing audio with ${url}`);
        element.crossOrigin = 'anonymous';
        element.loop = false;
        element.src = url;
        element.addEventListener('ended', () => {
            setResumePoint(getTrackId(url), 0);
            // loop
            playAudioSrc();
        })
        return ctx.createMediaElementSource(element);
    }

    const wireAudioNodes = (ctx, source, intermediateNodes=[]) => {
        intermediateNodes.push(ctx.destination);
        intermediateNodes.reduce((acc, cur) => acc.connect(cur), source);
    }
    const path = getAudioPath();
    console.log(path);
    const source = initStream(audioCtx, audioEl, path);
    analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 32; // frequencyBinCount: 16
    volume = audioCtx.createGain();
    console.log(volume);
    wireAudioNodes(audioCtx, source, [analyzer, volume]);
    freqData = new Uint8Array(analyzer.frequencyBinCount);
    console.log("audio initialization complete");
}


const updateAudioSrc = (url) => {
    if (audioEl.src != url){
        console.log(`updating audio source to ${url}`);
        audioEl.src = url;
    }
}

const getTrackId = (srcPath) => {
    const splitPath = srcPath.split('/');
    const baseName = splitPath[splitPath.length -1];
    return baseName.split('.')[0];
}

const playAudioSrc = () => {
    const trackId = getTrackId(audioEl.src);
    const resumePoint = trackProgress[trackId] || 0;
    audioEl.currentTime = resumePoint < audioEl.duration ? resumePoint : 0;
    clearInterval(fadeId);
    if (!isMuted) volume.gain.value = 1;
    audioEl.play();
    progressCaptureId = setInterval(() => {
        setResumePoint(trackId);
    }, progressCaptureInterval);
}

const startSceneAudio = () => {
    const url = getAudioPath();
    updateAudioSrc(url);
    playAudioSrc();
}



const setResumePoint = (trackId, value=null) => {
    if (!value){
        trackProgress[trackId] = audioEl.currentTime;
    } else if (audioEl.duration && value < audioEl.duration && value >= 0){
        trackProgress[trackId] = value;
    } else {
        console.log(`resetting progress for track ${trackId}`);
        trackProgress[trackId] = 0;
    }
}

const toggleMute = () => {
    isMuted = !isMuted;
    if (isMuted){
        volume.gain.value = 0;
    } else {
        volume.gain.value = 1;
    }
    return isMuted;
}

const fadeOutAudio = (duration) => {
    const stepDuration = 10;
    const steps = (duration > stepDuration ? 
        duration : stepDuration) / stepDuration;
    const rate = volume.gain.value / steps;
    fadeId = setInterval(()=> {
        volume.gain.value -= rate;
        if (volume.gain.value < 0.01){
            volume.gain.value = 0;
            clearInterval(fadeId);
        }
    }, stepDuration);
}

const isPlaying = () => {
    if (audioCtx && audioEl && audioCtx.state === 'running' && !audioEl.paused){
        return true;
    }
    return false;
}

const getElapsedTime = () => {
    return audioCtx.currentTime;
}

const cancelAudioTrackProgressCapture = () => {
    clearInterval(progressCaptureId);
}

export {initAudio, isPlaying, toggleMute, fadeOutAudio, startSceneAudio, analyzer, freqData, getElapsedTime, cancelAudioTrackProgressCapture }




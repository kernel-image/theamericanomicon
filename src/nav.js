import { stateMan } from "./state";
import { initScene } from "./sceneLoader";
import { fadeIn, fadeOut } from "./utils/fadeInOut";
import { resetPosition, animateCam2Portal } from "./animator";
import { cancelAudioTrackProgressCapture, fadeOutAudio, startSceneAudio } from "./audioMan";

let selectedPortal = null;
const portalIds = ['abyss1', 'abyss2'];

function attemptNav() {
    if (selectedPortal) {
        animateCam2Portal(selectedPortal);
        switch (selectedPortal) {
            case portalIds[0]:
                stateMan.prevScene();
                swapScenes();
                break;
            case portalIds[1]:
                stateMan.nextScene();
                swapScenes();
                break;
        }
    }
}

function swapScenes() {
    cancelAudioTrackProgressCapture();
    fadeOut();
    fadeOutAudio();
    setTimeout(() => { 
        initScene();
        resetPosition();
        startScene();
    }, 1200);
}

function startScene() {
    fadeIn();
    startSceneAudio();
}

function setSelectedPortal(value){
    if (portalIds.indexOf(value) >= 0){
        selectedPortal = value;
    }else{
        //console.log(`invalid portal id: ${value}.  deselecting`);
        selectedPortal = null;
    }
}

function getSelectedPortal(){
    return selectedPortal
}

export { getSelectedPortal, setSelectedPortal, attemptNav, startScene }
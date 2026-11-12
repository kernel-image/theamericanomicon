import { stateMan } from "./state";
import { initScene } from "./sceneLoader";
import { fadeIn, fadeOut } from "./utils/fadeInOut";
import { resetPosition, animateCam2Portal } from "./animator";

let selectedPortal = null;
const portalIds = ['abyss1', 'abyss2'];

function attemptNav() {
    if (selectedPortal) {
        switch (selectedPortal) {
            case portalIds[0]:
                stateMan.prevScene();
                animateCam2Portal(selectedPortal);
                swapScenes();
                break;
            case portalIds[1]:
                stateMan.nextScene();
                animateCam2Portal(selectedPortal);
                swapScenes();
                break;
        }
    }
}

function swapScenes() {
    fadeOut();
    setTimeout(() => { 
        initScene();
        fadeIn();
        resetPosition();
    }, 1200);
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

export { getSelectedPortal, setSelectedPortal, attemptNav }
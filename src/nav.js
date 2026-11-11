import { stateMan } from "./state";
import { initScene } from "./sceneLoader";
import { fadeIn, fadeOut } from "./utils/fadeInOut";

let selectedPortal = null;
const portalIds = ['abyss1', 'abyss2'];

function attemptNav() {
    if (selectedPortal) {
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
    fadeOut();
    setTimeout(() => { 
        initScene();
        fadeIn();
    }, 1000);
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

const _stateMan = () => {
    let currentScene;
    const sceneIds = ["1","2","3"];
    const getNextSceneId = () => {
        if (sceneIds?.length > 0){
            const idx = sceneIds.indexOf(currentScene);
            if (idx < 0){
                //fallback to first scene on corrupted data
                return sceneIds[0];
            } else if (idx < sceneIds.length - 1){
                return sceneIds[idx + 1];
            } else {
                // return to beginning if idx is already at the end
                return sceneIds[0];
            }
        }
    }
    const getPreviousSceneId = () => {
        if (sceneIds?.length > 0){
            const idx = sceneIds.indexOf(currentScene);
            if (idx < 0){
                //fallback to first scene on corrupted data
                return sceneIds[0];
            } else if (idx > 0){
                return sceneIds[idx - 1];
            } else {
                // return to end if idx is already at the beginning
                return sceneIds[sceneIds.length -1];
            }
        }
    }

    const getCurrentScene = () => {
        return currentScene;
    }

    const nextScene = () => {
        currentScene = getNextSceneId();
        return currentScene;
    }

    const prevScene = () => {
        currentScene = getPreviousSceneId();
        return currentScene;
    }

    return {
        getCurrentScene,
        nextScene,
        prevScene,
    }
}

const stateMan = _stateMan();

export { stateMan }
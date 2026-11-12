import { buildGeo } from './buildRoom';
import { paintGeo } from './paintRoom';
import { getSceneData } from '../data/config';
import { stateMan } from '../state';

const roomBuilder = () => {
    const geo = buildGeo();
    const sceneData = getSceneData(stateMan.getCurrentScene());
    const mats = sceneData['materials']; 
    return paintGeo(geo, mats);
}

export {roomBuilder}
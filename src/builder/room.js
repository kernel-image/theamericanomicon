import { buildGeo } from './buildRoom';
import { paintGeo } from './paintRoom';
import { getSceneData } from '../data/config';
import { getCurrentScene } from '../state';

const geo = buildGeo();
const sceneData = getSceneData(getCurrentScene());
const mats = sceneData['materials'];
const room = paintGeo(geo, mats);
export {room}
import './style.css'
import * as THREE from 'three/webgpu';
import { getScene, getCamera, initScene } from './sceneLoader';
import { initFade } from './utils/fadeInOut';
import { stateMan } from './state';
import { raycastMan } from './raycaster';
import { animate, frame } from "motion";
import { threeEffect } from "motion/three";
import {initCamControls, updateCamControls} from './utils/camControl';
import { initRenderer, getRenderer } from './renderer';
import { updateAudioSignal} from './utils/audioProcessing';
import { initAudio, isPlaying, analyzer, freqData, getElapsedTime } from './audioMan';
import { initUI } from './ui';
import { getPartiSystem } from './sceneLoader';

async function init() {
  console.log(`scene: ${stateMan.nextScene()}`);
  initScene();
  initAudio();
  initFade();
  await initRenderer();
  window.addEventListener( 'resize', onWindowResize );
  initCamControls();
  raycastMan();
  animate.addEffect(threeEffect);
  initUI();
}

function onWindowResize() {
  const camera = getCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  getRenderer().setSize( window.innerWidth, window.innerHeight );
}

function update() {
  updateCamControls();
  if (isPlaying)
    updateAudioSignal(analyzer, freqData, getElapsedTime(), getPartiSystem());
  getRenderer().render( getScene(), getCamera() );
}

await init();
frame.render(() => {update()}, true);



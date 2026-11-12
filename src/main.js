import './style.css'
import * as THREE from 'three';
import { getScene, getCamera, initScene } from './sceneLoader';
import { fadeIn, initFade } from './utils/fadeInOut';
import { stateMan } from './state';
import { raycastMan } from './raycaster';
import { animate, frame } from "motion";
import { threeEffect } from "motion/three";
import {initCamControls, updateCamControls} from './utils/camControl';
import { initRenderer, getRenderer } from './renderer';


async function init() {
  console.log(`scene: ${stateMan.nextScene()}`);
  initScene();
  initFade();
  await initRenderer();
  window.addEventListener( 'resize', onWindowResize );
  initCamControls();
  raycastMan();
  animate.addEffect(threeEffect);
}

function onWindowResize() {
  const camera = getCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  getRenderer().setSize( window.innerWidth, window.innerHeight );
}

function update() {
  updateCamControls();
  getRenderer().render( getScene(), getCamera() );
}

await init();
frame.render(() => {update()}, true);
fadeIn();



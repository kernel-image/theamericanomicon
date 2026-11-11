import './style.css'
import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { getScene, getCamera, initScene } from './sceneLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { fadeIn, initFade } from './utils/fadeInOut';
import { stateMan } from './state';
import { raycastMan } from './raycaster';

const renderer = new WebGPURenderer({alpha: false});
let camControls;

async function init() {
  console.log(`scene: ${stateMan.nextScene()}`);
  initScene();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  initFade();
  await renderer.init();
  window.addEventListener( 'resize', onWindowResize );
  camControls = new createCamControl( getCamera() );
  camControls.target.set(0, 0, .01);
  raycastMan();
}

function createCamControl(camera) {

				const controls = new OrbitControls( camera, renderer.domElement );
        controls.enableRotate = true;
        controls.enableZoom = false;
				controls.enablePan = false;
        controls.enableDamping = true;
        controls.mouseButtons = {
          LEFT: THREE.MOUSE.ROTATE, 
          MIDDLE: THREE.MOUSE.NONE,
          RIGHT: THREE.MOUSE.NONE
        };

        return controls;
}


function onWindowResize() {
  const camera = getCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {
  camControls.update();
  renderer.render( getScene(), getCamera() );

}

await init();
renderer.setAnimationLoop( animate );
fadeIn();



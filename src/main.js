import './style.css'
import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { getScene, getCamera } from './sceneLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getCurrentScene } from './state';

const scene = getScene(getCurrentScene());
const camera = getCamera(getCurrentScene());
const renderer = new WebGPURenderer({alpha: false});
let camControls;

async function init() {
  
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  await renderer.init();
  window.addEventListener( 'resize', onWindowResize );
  camControls = new createCamControl( camera );
  camControls.target.set(0, 0, .01);


}

function createCamControl(camera){

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

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {
  camControls.update();
  renderer.render( scene, camera );

}

await init();
//renderer.render( scene, camera );
renderer.setAnimationLoop( animate );



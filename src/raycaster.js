import * as THREE from 'three';
import { getCamera, getPortals } from './sceneLoader';
import { setSelectedPortal, attemptNav } from './nav';

const raycastMan = () => {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isCooling = false;
    const cooldown = () => {
        isCooling = true;
        setTimeout(resetCooldown, 300)
    };
    let cooldownId;
    // console.log('hello raycaster');

    window.addEventListener('pointermove', (event) => {
        updatePointer(event.clientX, event.clientY);
        if (!isCooling) {
            cooldownId = cooldown();
            checkIntersect(getPortals(), handleIntersect);
        }
        //console.log(`moving pointer: (${pointer.x}, ${pointer.y})`);
    });

    window.addEventListener('click', (event) => {
        if (isCooling) {
            clearTimeout(cooldownId);
            isCooling = false;
        }
        checkIntersect(getPortals(), handleIntersect);
        attemptNav();
    });

    function resetCooldown() {
        isCooling = false;
    }

    function updatePointer(x, y) {
        pointer.x = (x / window.innerWidth) * 2 - 1;
        pointer.y = (y / window.innerHeight) * -2 + 1;
    }

    function checkIntersect(meshArray, callback) {
        raycaster.setFromCamera(pointer, getCamera());
        const intersects = raycaster.intersectObjects(meshArray);
        if (intersects.length > 0) {
            for (var i in intersects) {
                callback(intersects[i].object);
            }
            return true;
        }
        setSelectedPortal(null);
        return false;
    }

    function handleIntersect(mesh) {
        //console.log(`intersecting ${mesh.name}`);
        setSelectedPortal(mesh.name);
    }
}

export {raycastMan}


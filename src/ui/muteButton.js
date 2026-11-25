import muteIconRaw from '@/assets/icons/muteIcon.svg?raw';
import unmuteIconRaw from '@/assets/icons/muteIcon.svg?raw';
import { toggleMute } from '../audioMan';

let muteIcon, unmuteIcon;
const muteButton = document.createElement('button', {ariaLabel: 'mute'});


const initMuteButton = () => {
    muteButton.classList.add('muteButton');
    muteIcon = importSVG(muteIconRaw);
    unmuteIcon = importSVG(unmuteIconRaw);
    muteIcon.classList.add('mute');
    unmuteIcon.classList.add('unmute');
    const div = document.querySelector('.overlay');
    div.appendChild(muteButton);
    muteButton.appendChild(muteIcon);
    muteButton.appendChild(unmuteIcon);
    muteButton.onclick = handleClick;
}

const importSVG = (icon) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(icon, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    svgElement.setAttribute('aria-hidden', 'true');
    return svgElement;
}


const handleClick = () => {
    if (toggleMute()){
        unmuteIcon.style.visibility = 'visible';
        muteIcon.style.visibility = 'hidden';
    } else {
        unmuteIcon.style.visibility = 'hidden';
        muteIcon.style.visibility = 'visible';
    }
}

export {initMuteButton}
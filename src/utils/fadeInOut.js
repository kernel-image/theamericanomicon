const overlay = document.createElement('div');

function initFade() {
    overlay.className = 'overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 1.0)';
    overlay.style.opacity = 1;
    overlay.style.transition = 'backgroundColor 1s ease-in-out';
    overlay.style.pointerEvents = 'auto';
    overlay.style.zIndex = 100;
    document.body.appendChild(overlay);
}

function fadeOut () {
    overlay.style.pointerEvents = 'auto';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 1.0)'; 
}

function fadeIn () {
    overlay.style.pointerEvents = 'none';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)'; 
}

export { initFade, fadeIn, fadeOut }
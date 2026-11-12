const overlay = document.createElement('div');

function initFade() {
    overlay.style.position = 'absolute';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = 1;
    overlay.style.transition = 'opacity 1s ease-in-out';
    overlay.style.pointerEvents = 'auto';
    document.body.appendChild(overlay);
}

function fadeOut () {
    overlay.style.pointerEvents = 'auto';
    overlay.style.opacity = 1;
}

function fadeIn () {
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = 0;
}

export { initFade, fadeIn, fadeOut }
import { startScene } from "../nav";

const enterButton = document.createElement('button');

const initEnterButton = () => {
    enterButton.className = 'enter';
    enterButton.innerText = 'invoke the americanomicon';
    enterButton.onclick = handleClick;
    enterButton.zIndex = '101';
    const div = document.querySelector('div');
    div.appendChild(enterButton);
}

const handleClick = () => {
    console.log("manifest doom");
    enterButton.style.visibility = 'hidden';
    startScene();
}

export {initEnterButton}
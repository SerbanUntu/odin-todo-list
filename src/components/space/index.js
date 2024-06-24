import { addSelectedStyles, removeSelectedStyles } from '../sidebar';
import './index.css';

const main = document.querySelector('main');
let currentSpaceName = '';

export function loadSpace(name, space) {
  document.title = `${name} | @spaces`;
  main.innerHTML = '';
  document.body.style.background = `hsl(${space.hue}deg 15% 10% / 100%)`;
  if(currentSpaceName) removeSelectedStyles(currentSpaceName);
  addSelectedStyles(name, space);
  const domCurrentSpace = document.createElement('div');
  domCurrentSpace.classList.add('space-content');
  domCurrentSpace.innerHTML = `
    <h1 class="special"><span style="color: hsl(${space.hue}deg 90% 60% / 100%);">@</span>${name}</h1>
    <p class="text-50">${space.tasks.length} task${space.tasks.length !== 1 ? 's' : ''}</p>
  `;
  currentSpaceName = name;
  main.appendChild(domCurrentSpace);
}
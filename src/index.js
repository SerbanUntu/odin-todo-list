import './styles/reset.css';
import './styles/main.css';
import './styles/util.css';
import defaults from './data/init.json';
import { addSpaceButton, changeSpaceButton, removeSpaceButton, addSelectedStyles, removeSelectedStyles } from './components/sidebar';
import './components/new-space-dialog';
import './components/new-task-dialog';
import { Space } from './components/space';

const IGNORE_SAVE_FLAG = true;

let spaces = JSON.parse(localStorage.getItem('@spaces'));
let spacesOrder = JSON.parse(localStorage.getItem('@spaces-order'));

if(spaces === null || Object.entries(spaces).length === 0) {
  spaces = defaults.spaces;
} 

if(spacesOrder === null) {
  spacesOrder = defaults.order;
}

for(let name of spacesOrder) {
  addSpaceButton(name, spaces[name]);
}

loadSpace(spacesOrder[0], spaces[spacesOrder[0]]);

if(!IGNORE_SAVE_FLAG) {
  window.addEventListener("beforeunload", e => {
    e.preventDefault();
    localStorage.setItem('@spaces', JSON.stringify(spaces));
    const spaceButtonNames = document.querySelectorAll('.sidebar nav.space-navigation .name-and-labels p');
    let newOrder = [];
    spaceButtonNames.forEach(name => {
      newOrder.push(name.textContent.slice(1));
    });
    localStorage.setItem('@spaces-order', JSON.stringify(newOrder));
  });
}

export function addSpace(name, space) {
  spaces[name] = space;
  addSpaceButton(name, space);
  loadSpace(name, space);
}

export function editSpace(oldName, newName, newHue) {
  if(oldName !== newName) {
    spaces[newName] = spaces[oldName];
    delete spaces[oldName];
  }
  spaces[newName].hue = newHue;
  changeSpaceButton(oldName, newName, spaces[newName]);
  loadSpace(newName, spaces[newName]);
}

export function deleteSpace(name) {
  delete spaces[name];
  removeSpaceButton(name);
  loadSpace(spacesOrder[0], spaces[spacesOrder[0]]);
}

export function loadSpace(name, space) {
  const main = document.querySelector('main');
  let currentSpace = new Space(name, space.hue, space.auto, space.list, space.tasks);
  document.title = `${name} | @spaces`;
  main.innerHTML = '';
  document.body.style.background = `hsl(${space.hue}deg 15% 10% / 100%)`;
  if(Space.currentSpaceName) removeSelectedStyles(Space.currentSpaceName);
  addSelectedStyles(name);
  main.appendChild(currentSpace.getSpaceComponent());
}
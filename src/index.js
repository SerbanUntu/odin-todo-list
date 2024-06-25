import './styles/reset.css';
import './styles/main.css';
import './styles/util.css';
import defaults from './data/init.json';
import { addSpaceButton, changeSpaceButton, removeSpaceButton } from './components/sidebar';
import './components/new-space-dialog';
import './components/new-task-dialog';
import { loadSpace } from './components/space';

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
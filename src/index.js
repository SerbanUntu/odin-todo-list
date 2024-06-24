import './styles/reset.css';
import './styles/main.css';
import './styles/util.css';
import defaultSpaces from './data/init.json';
import { addSpaceButton } from './components/sidebar';
import './components/new-space-dialog';
import { loadSpace } from './components/space';

let spaces = JSON.parse(localStorage.getItem('@spaces'));

if(spaces === null) {
  spaces = defaultSpaces;
}

for(let [name, space] of Object.entries(spaces)) {
  addSpaceButton(name, space);
}

loadSpace(...Object.entries(spaces)[0]);

export function addSpace(name, space) {
  spaces[name] = space;
  addSpaceButton(name, space);
  loadSpace(name, space);
}
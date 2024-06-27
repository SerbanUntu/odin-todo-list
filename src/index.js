import './styles/reset.css';
import './styles/main.css';
import './styles/util.css';
import defaultSpaces from './data/init.json';
import { Sidebar } from './components/sidebar';
import './components/new-space-dialog';
import './components/new-task-dialog';
import { Space } from './components/space';
import { Saver } from './util/saver';

export class App {
  static IGNORE_SAVE_FLAG = false;

  static currentSpace;
  static spaces = Saver.getData('@spaces', defaultSpaces).map(
    space => new Space(space.name, space.hue, space.auto, space.list, space.sections)
  );

  static init() {
    for(let space of App.spaces) {
      Sidebar.addSpaceButton(space);
    }

    App.loadSpace(App.spaces[0]);

    window.addEventListener("beforeunload", e => {
      e.preventDefault();
      Saver.saveData('@spaces', App.spaces);
    });
    
    let credits = document.querySelector('.credits > small');
    credits.textContent = `©${(new Date()).getFullYear()} Serban Untu. Inspired by Todoist.`;
  }

  static addSpace(space) {
    App.spaces.push(space);
    Sidebar.addSpaceButton(space);
    App.loadSpace(space);
  }

  static editSpace(oldName, newName, newHue) {
    App.spaces.forEach((space, index) => {
      if(space.name === oldName) {
        if(oldName !== newName) {
          App.spaces[index].name = newName;
        }
        App.spaces[index].hue = newHue;
        Sidebar.changeSpaceButton(oldName, newName);
        App.loadSpace(App.spaces[index]);
      }
    });
  }

  static deleteSpace(name) {
    App.spaces.forEach((space, index) => {
      if(space.name === name) {
        App.spaces.splice(index, 1);
        Sidebar.removeSpaceButton(name);
        App.loadSpace(App.spaces[0]);
        return;
      }
    });
  }

  static loadSpace(space) {
    const main = document.querySelector('main');
    if(App.currentSpace) Sidebar.removeSelectedStyles(App.currentSpace.name);
    App.currentSpace = space;
    document.title = `${space.name} | @spaces`;
    main.innerHTML = '';
    document.body.style.background = `hsl(${space.hue}deg 15% 10% / 100%)`;
    Sidebar.addSelectedStyles(space.name);
    main.appendChild(App.currentSpace.getSpaceComponent());
    App.currentSpace.refreshSections();
  }
}

App.init();

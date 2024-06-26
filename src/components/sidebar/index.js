import { App } from "../..";
import './index.css';

export class Sidebar {
  static addSpaceButton(space) {
    const domNav = document.querySelector('nav.space-navigation');
    domNav.appendChild(space.getSidebarButtonComponent());
  }

  static changeSpaceButton(oldName, newName) {
    const currentButton = document.querySelector(`.space-button-${oldName}`);
    currentButton.classList.remove(`space-button-${oldName}`);
    currentButton.classList.add(`space-button-${newName}`);
    const buttonName = currentButton.querySelector('.name-and-labels > p');
    buttonName.textContent = `@${newName}`;
  }

  static removeSpaceButton(name) {
    const currentButton = document.querySelector(`.space-button-${name}`);
    currentButton.remove();
  }

  static addSelectedStyles(name) {
    const currentButton = document.querySelector(`.space-button-${name}`);
    if(currentButton) {
      currentButton.style.borderLeft = `4px solid hsl(${App.currentSpace.hue}deg 90% 60% / 100%)`;
      currentButton.style.background = `hsl(${App.currentSpace.hue}deg 90% 60% / 5%)`;
    }
  }

  static removeSelectedStyles(name) {
    const currentButton = document.querySelector(`.space-button-${name}`);
    if(currentButton) {
      currentButton.style.borderLeft = ``;
      currentButton.style.background = ``;
    }
  }
}
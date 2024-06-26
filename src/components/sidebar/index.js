import { App } from "../..";
import './index.css';
import settingsIconPath from '../../images/settings.svg';
import noIconPath from '../../images/no.svg';
import { loadEditDialog } from "../edit-space-dialog";

const domNav = document.querySelector('nav.space-navigation');

export function addSpaceButton(space) {
  const currentButton = document.createElement('div');
  currentButton.dataset.name = space.name;
  currentButton.dataset.hue = space.hue;
  currentButton.dataset.tasks = space.getTotalTasks();
  currentButton.classList.add('space-button');
  currentButton.innerHTML = `
    <div class="name-and-labels">
      <p class="space-button-name">@${space.name}</p>
    </div>
    <p class="tasks-count">${space.getTotalTasks() > 0 ? space.getTotalTasks() : 'None'}</p>
  `; //! Prevent HTML injection
  if(space.auto === false)
    currentButton.innerHTML += `<img class="settings-icon" src="${settingsIconPath}" alt="Settings">`;
  else
    currentButton.innerHTML += `<img class="no-icon" src="${noIconPath}" alt="Cannot edit">`;
  domNav.appendChild(currentButton);
  const domNameAndLabels = currentButton.querySelector('.name-and-labels');
  if(space.auto === "true") {
    const autoTag = document.createElement('div');
    autoTag.classList.add('tag', 'auto-tag');
    autoTag.textContent = 'auto';
    domNameAndLabels.appendChild(autoTag);
  }
  if(space.list === "true") {
    const listTag = document.createElement('div');
    listTag.classList.add('tag', 'list-tag');
    listTag.textContent = 'list';
    domNameAndLabels.appendChild(listTag);
  }
  currentButton.addEventListener('click', e => {
    e.preventDefault();
    App.loadSpace(space);
  });
  const domSettingsIcon = currentButton.querySelector('.settings-icon');
  if(domSettingsIcon) domSettingsIcon.addEventListener('click', e => {
    e.preventDefault();
    loadEditDialog(space);
  });
}

export function changeSpaceButton(oldName, newName, space) {
  const currentButton = document.querySelector(`.space-button[data-name="${oldName}"]`);
  currentButton.dataset.name = newName;
  currentButton.dataset.hue = space.hue;
  const buttonName = currentButton.querySelector('.name-and-labels > p');
  buttonName.textContent = `@${newName}`;
}

export function removeSpaceButton(name) {
  const currentButton = document.querySelector(`.space-button[data-name="${name}"]`);
  currentButton.remove();
}

export function addSelectedStyles(name) {
  const currentButton = document.querySelector(`.space-button[data-name="${name}"]`);
  if(currentButton) {
    currentButton.style.borderLeft = `4px solid hsl(${currentButton.dataset.hue}deg 90% 60% / 100%)`;
    currentButton.style.background = `hsl(${currentButton.dataset.hue}deg 90% 60% / 5%)`;
  }
}

export function removeSelectedStyles(name) {
  const currentButton = document.querySelector(`.space-button[data-name="${name}"]`);
  if(currentButton) {
    currentButton.style.borderLeft = ``;
    currentButton.style.background = ``;
  }
}
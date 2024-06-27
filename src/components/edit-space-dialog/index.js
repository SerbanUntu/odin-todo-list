import { App } from '../..';
import { addErrorMessage, removeErrorMessages } from '../new-space-dialog';
import './index.css';

const dialog = document.querySelector('dialog#edit-space-dialog');
const cancelButton = dialog.querySelector('.cancel-button');
const deleteButton = dialog.querySelector('.delete-button');
const form = dialog.querySelector('form');
const formName = dialog.querySelector('h1');
const nameInput = dialog.querySelector('.edit-space-name');
const hueInput = dialog.querySelector('.edit-space-hue');
const colorDisplay = dialog.querySelector('.color-display');

let oldName = '';

export function loadEditSpaceDialog(space) {
  removeErrorMessages(dialog);
  dialog.showModal();
  oldName = space.name;
  formName.textContent = `Edit @${space.name}`;
  nameInput.value = space.name;
  colorDisplay.style.background = `hsl(${space.hue}deg 90% 60% / 100%)`;
  hueInput.value = space.hue;
}

cancelButton.addEventListener('click', e => {
  e.preventDefault();
  dialog.close();
});

deleteButton.addEventListener('click', e => {
  e.preventDefault();
  let name = prompt(`To permanently delete @${oldName}, type "delete"`);
  if(name === 'delete') {
    App.deleteSpace(oldName);
    dialog.close();
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  removeErrorMessages(dialog);
  let flag = true;
  App.spaces.forEach(space => {
    if(space.name === nameInput.value && space.name !== oldName)
      flag = false;
  });
  if(!flag)
    addErrorMessage("This name already belongs to a space", form);
  else {
    App.editSpace(oldName, nameInput.value, hueInput.value);
    dialog.close();
  }
});

hueInput.addEventListener('input', e => {
  e.preventDefault();
  colorDisplay.style.background = `hsl(${hueInput.value}deg 90% 60% / 100%)`;
});
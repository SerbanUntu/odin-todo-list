import { App } from "../..";
import { Space } from "../space";
import './index.css';

const newSpaceButton = document.querySelector('.new-space');
const dialog = document.querySelector('dialog#new-space-dialog');
const cancelButton = dialog.querySelector('.cancel-button');
const form = dialog.querySelector('form');
const nameInput = dialog.querySelector('.new-space-name');
const hueInput = dialog.querySelector('.new-space-hue');
const colorDisplay = dialog.querySelector('.color-display');

newSpaceButton.addEventListener('click', e => {
  e.preventDefault();
  removeErrorMessages(dialog);
  colorDisplay.style.background = `var(--red)`;
  dialog.showModal();
  form.reset();
});

cancelButton.addEventListener('click', e => {
  e.preventDefault();
  dialog.close();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  removeErrorMessages(dialog);
  let flag = true;
  App.spaces.forEach(space => {
    if(space.name === nameInput.value)
      flag = false;
  });
  if(!flag)
    addErrorMessage("This name already belongs to a space", form);
  else {
    const newSpace = new Space(nameInput.value, hueInput.value, false, false);
    App.addSpace(newSpace);
    dialog.close();
  }
});

hueInput.addEventListener('input', e => {
  e.preventDefault();
  colorDisplay.style.background = `hsl(${hueInput.value}deg 90% 60% / 100%)`;
});

export function removeErrorMessages(dialogElement) {
  let oldErrorMessages = dialogElement.querySelectorAll('.error-message');
  if(oldErrorMessages) {
    oldErrorMessages.forEach(message => {
      message.remove();
    });
  }
}

export function addErrorMessage(text, formElement) {
  let errorMessage = document.createElement('div');
  errorMessage.classList.add('error-message', 'text-red', 'text-center');
  errorMessage.textContent = text;
  formElement.appendChild(errorMessage);
}
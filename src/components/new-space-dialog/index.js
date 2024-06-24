import { addSpace } from "../..";
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
  const newSpace = {
    hue: hueInput.value,
    auto: false,
    list: false,
    tasks: []
  };
  addSpace(nameInput.value, newSpace);
  dialog.close();
});

hueInput.addEventListener('input', e => {
  e.preventDefault();
  colorDisplay.style.background = `hsl(${hueInput.value}deg 90% 60% / 100%)`;
});
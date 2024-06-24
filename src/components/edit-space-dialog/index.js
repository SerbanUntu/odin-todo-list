import { deleteSpace, editSpace } from '../..';
import './index.css';

const dialog = document.querySelector('dialog#edit-space-dialog');
const cancelButton = dialog.querySelector('.cancel-button');
const deleteButton = dialog.querySelector('.delete-button');
const form = dialog.querySelector('form');
const formName = dialog.querySelector('h1');
const nameInput = dialog.querySelector('.new-space-name');
const hueInput = dialog.querySelector('.new-space-hue');
const colorDisplay = dialog.querySelector('.color-display');

let oldName = '';

export function loadEditDialog(name, space) {
  dialog.showModal();
  oldName = name;
  formName.textContent = `Edit @${name}`;
  nameInput.value = name;
  colorDisplay.style.background = `hsl(${space.hue}deg 90% 60% / 100%)`;
  hueInput.value = space.hue;
}

cancelButton.addEventListener('click', e => {
  e.preventDefault();
  dialog.close();
});

deleteButton.addEventListener('click', e => {
  e.preventDefault();
  deleteSpace(oldName);
  dialog.close();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  editSpace(oldName, nameInput.value, hueInput.value);
  dialog.close();
});

hueInput.addEventListener('input', e => {
  e.preventDefault();
  colorDisplay.style.background = `hsl(${hueInput.value}deg 90% 60% / 100%)`;
});
import { App } from '../..';

const dialog = document.querySelector('dialog#transfer-task-dialog');
const cancelButton = dialog.querySelector('.cancel-button');
const form = dialog.querySelector('form');
const fromInputSection = dialog.querySelector('.from-space-section');
const select = dialog.querySelector('.to-space-name');

let currentTask;

export function loadTransferTaskDialog(task) {
  fromInputSection.innerHTML = `
    <label for="from-space-name">from</label>
    <input id="from-space-name" class="from-space-name" name="from" type="text" value="${App.currentSpace.name}" required maxlength="70" disabled>
  `;
  select.innerHTML = '';
  App.spaces.forEach(space => {
    let currentOption = document.createElement('option');
    currentOption.value = space.name;
    currentOption.textContent = space.name;
    if(App.currentSpace.name !== space.name) select.appendChild(currentOption);
  });
  form.reset();
  currentTask = task;
  dialog.showModal();
}

cancelButton.addEventListener('click', e => {
  e.preventDefault();
  dialog.close();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  App.currentSpace.transferTask(currentTask, select.value);
  dialog.close();
});

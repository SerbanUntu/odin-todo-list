import { App } from '../..';
import { Icon } from '../../util/icon';

const dialog = document.querySelector('dialog#edit-task-dialog');
const cancelButton = dialog.querySelector('.cancel-button');
const form = dialog.querySelector('form');
const formName = dialog.querySelector('h1');
const nameInput = dialog.querySelector('.edit-task-name');
const descriptionInput = dialog.querySelector('.edit-task-description');
const dateInput = dialog.querySelector('.edit-task-date');
const optionsContainer = dialog.querySelector('.options');

let currentTask;

export function loadEditTaskDialog(task) {
  form.reset();
  optionsContainer.innerHTML = '';
  ['high', 'medium', 'low', 'none'].forEach(priority => {
    if(task.priority === priority) {
      optionsContainer.innerHTML += `
        <div class="input-wrapper">
          <input type="radio" name="priority" id="edit-task-radio-priority-${priority}" value="${priority}" class="radio-priority-${priority} round" checked>
        </div>
      `;
    } else {
      optionsContainer.innerHTML += `
        <div class="input-wrapper">
          <input type="radio" name="priority" id="edit-task-radio-priority-${priority}" value="${priority}" class="radio-priority-${priority} round">
        </div>
      `;
    }
  });
  const radioWrappers = dialog.querySelectorAll('.input-wrapper');
  radioWrappers.forEach(wrapper => {
    const tickIcon = (new Icon('tick').getComponent());
    wrapper.appendChild(tickIcon);
  });
  currentTask = task;
  formName.textContent = `Edit task in @${App.currentSpace.name}`;
  nameInput.value = task.name;
  descriptionInput.value = task.description;
  dateInput.value = task.dueDate;
  dialog.showModal();
}

cancelButton.addEventListener('click', e => {
  e.preventDefault();
  dialog.close();
});

form.addEventListener('submit', e => {
  const priorityInputs = dialog.querySelectorAll('input[name="priority"]');
  e.preventDefault();
  let priorityInputValue;
  priorityInputs.forEach(input => {
    if(input.checked)
      priorityInputValue = input.value;
  });
  currentTask.edit(nameInput.value, descriptionInput.value, priorityInputValue, dateInput.value);
  dialog.close();
});

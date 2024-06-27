import { App } from '../..';
import { Task } from '../task';
import { Icon } from '../../util/icon';
import './index.css';

const addTaskButton = document.querySelector('.add-task');
const dialog = document.querySelector('dialog#new-task-dialog');
const cancelButton = dialog.querySelector('.cancel-button');
const form = dialog.querySelector('form');
const formName = dialog.querySelector('h1');
const radioWrappers = dialog.querySelectorAll('.input-wrapper');
const nameInput = dialog.querySelector('.new-task-name');
const descriptionInput = dialog.querySelector('.new-task-description');
const dateInput = dialog.querySelector('.new-task-date');
const priorityInput = dialog.querySelectorAll('input[name="priority"]');

addTaskButton.addEventListener('click', e => {
  e.preventDefault();
  dialog.showModal();
  formName.textContent = `New task in @${App.currentSpace.name}`;
  form.reset();
});

cancelButton.addEventListener('click', e => {
  e.preventDefault();
  dialog.close();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  let priorityInputValue;
  priorityInput.forEach(input => {
    if(input.checked)
      priorityInputValue = input.value;
  });
  let newTask = new Task(nameInput.value, descriptionInput.value, priorityInputValue, dateInput.value, false);
  App.currentSpace.addTask(newTask);
  dialog.close();
});

radioWrappers.forEach(wrapper => {
  const tickIcon = (new Icon('tick').getComponent());
  wrapper.appendChild(tickIcon);
});
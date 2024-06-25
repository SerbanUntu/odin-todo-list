import { currentSpaceName } from '../space';
import './index.css';

const addTaskButton = document.querySelector('.add-task');
const dialog = document.querySelector('dialog#new-task-dialog');
const cancelButton = dialog.querySelector('.cancel-button');
const form = dialog.querySelector('form');
const formName = dialog.querySelector('h1');
const radioWrappers = dialog.querySelectorAll('.input-wrapper');

addTaskButton.addEventListener('click', e => {
  e.preventDefault();
  dialog.showModal();
  formName.textContent = `New task in @${currentSpaceName}`;
  form.reset();
});

cancelButton.addEventListener('click', e => {
  e.preventDefault();
  dialog.close();
});

radioWrappers.forEach(wrapper => {
  const tick = document.createElement('div');
  tick.classList.add('svg-wrapper');
  tick.innerHTML = `
    <svg class="svg" width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.708 0L4.8 7.908L1.692 4.812L0 6.504L4.8 11.304L14.4 1.704L12.708 0Z" />
    </svg>
  `;
  wrapper.appendChild(tick);
});
import { addSelectedStyles, removeSelectedStyles } from '../sidebar';
import { Task } from '../task';
import './index.css';

const main = document.querySelector('main');
let currentSpaceName = '';

export function loadSpace(name, space) {
  document.title = `${name} | @spaces`;
  main.innerHTML = '';
  document.body.style.background = `hsl(${space.hue}deg 15% 10% / 100%)`;
  if(currentSpaceName) removeSelectedStyles(currentSpaceName);
  addSelectedStyles(name);
  const domCurrentSpace = document.createElement('div');
  domCurrentSpace.classList.add('space-content');
  domCurrentSpace.innerHTML = `
    <h1 class="special"><span style="color: hsl(${space.hue}deg 90% 60% / 100%);">@</span>${name}</h1>
    <p class="text-50">${space.tasks.length === 0 ? 'No' : space.tasks.length} task${space.tasks.length !== 1 ? 's' : ''}</p>
  `;
  currentSpaceName = name;
  domCurrentSpace.appendChild(getSectionComponent("Today", space.hue, space.tasks));
  main.appendChild(domCurrentSpace);
}

function getSectionComponent(name, hue, tasks) {
  const currentSection = document.createElement('section');
  currentSection.classList.add('task-section');
  currentSection.innerHTML = `
    <h3>${name}</h3>
    <hr style="background: hsl(${hue}deg 90% 60% / 100%);">
  `;
  for(let task of tasks) {
    let currentTask = new Task(task.name, task.description, task.priority, task.dueDate, task.completed);
    currentSection.appendChild(currentTask.getTaskComponent());
  }
  return currentSection;
}
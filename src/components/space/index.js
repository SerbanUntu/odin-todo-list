import { Task } from '../task';
import './index.css';

export class Space {
  static currentSpaceName = '';
  static currentSpace;
  name;
  hue;
  auto;
  list;
  tasks;
  sections;

  constructor(name, hue, auto, list, tasks) {
    this.name = name;
    this.hue = hue;
    this.auto = auto;
    this.list = list;
    this.tasks = tasks;
    this.sections = {};
    this.setSectionsProperty();
  }

  setSectionsProperty() {
    let tasksObject = {
      "Overdue": [],
      "Today": [],
      "Tomorrow": [],
      "This Week": [],
      "Next Week": [],
      "Upcoming": []
    };
    for(let task of this.tasks) {
      let currentTask = new Task(task.name, task.description, task.priority, task.dueDate, task.completed);
      tasksObject[currentTask.getSectionName()].push(currentTask);
    }
    ["Overdue", "Today", "Tomorrow", "This Week", "Next Week", "Upcoming"].forEach(sectionName => {
      this.sections[sectionName] = new Section(sectionName, this.hue, tasksObject[sectionName]);
    });
  }

  getSpaceComponent() {
    let domCurrentSpace = document.createElement('div');
    domCurrentSpace.classList.add('space-content');
    domCurrentSpace.innerHTML = `
      <h1 class="special"><span style="color: hsl(${this.hue}deg 90% 60% / 100%);">@</span>${this.name}</h1>
      <p class="text-50">${this.tasks.length === 0 ? 'No' : this.tasks.length} task${this.tasks.length !== 1 ? 's' : ''}</p>
    `;
    Space.currentSpaceName = this.name;
    Space.currentSpace = this;
    ["Overdue", "Today", "Tomorrow", "This Week", "Next Week", "Upcoming"].forEach(sectionName => {
      let sectionComponent = this.sections[sectionName].getSectionComponent();
      if(this.sections[sectionName].tasks.length === 0)
        sectionComponent.style.display = 'none';
      domCurrentSpace.appendChild(sectionComponent);
    });
    return domCurrentSpace;
  }

}

class Section {
  name;
  hue;
  tasks;

  constructor(name, hue, tasks) {
    this.name = name;
    this.hue = hue;
    this.tasks = tasks;
  }

  getSectionComponent() {
    const currentSection = document.createElement('section');
    currentSection.classList.add('task-section', `task-section-${this.name.toLowerCase().replace(/\s/g, '')}`);
    currentSection.innerHTML = `
      <h3>${this.name}</h3>
      <hr style="background: hsl(${this.hue}deg 90% 60% / 100%);">
    `;

    for(let task of this.tasks) {
      let currentTask = new Task(task.name, task.description, task.priority, task.dueDate, task.completed);
      currentSection.appendChild(currentTask.getTaskComponent());
    }
    return currentSection;
  }

  addTask(name, description, priority, dueDate, completed) {
    let currentTask = new Task(name, description, priority, dueDate, completed);
    let component = document.querySelector(`.task-section-${this.name.toLowerCase().replace(/\s/g, '')}`);
    if(component.style.display === 'none')
      component.style.display = 'flex';
    component.appendChild(currentTask.getTaskComponent());
  }
}
import { App } from '../..';
import { Task } from '../task';
import './index.css';

export class Space {
  name;
  hue;
  auto;
  list;
  sections;

  constructor(name, hue, auto, list, tasks, sections = null) {
    this.name = name;
    this.hue = hue;
    this.auto = auto;
    this.list = list;
    if(sections !== null) {
      Section.sectionNames.forEach(sectionName => {
        sections[sectionName] = new Section(sections[sectionName].name, sections[sectionName].tasks.map(
          task => new Task(task.name, task.description, task.priority, task.dueDate, task.completed)
        ));
      });
      this.sections = sections;
    }
    else this.setSectionsProperty(tasks);
  }

  setSectionsProperty(tasks) {
    this.sections = {};
    let tasksObject = {
      "Overdue": [],
      "Today": [],
      "Tomorrow": [],
      "This Week": [],
      "Next Week": [],
      "Upcoming": []
    };
    for(let task of tasks) {
      let currentTask = new Task(task.name, task.description, task.priority, task.dueDate, task.completed);
      tasksObject[currentTask.getSectionName()].push(currentTask);
    }
    Section.sectionNames.forEach(sectionName => {
      this.sections[sectionName] = new Section(sectionName, tasksObject[sectionName]);
    });
  }

  getSpaceComponent() {
    let domCurrentSpace = document.createElement('div');
    let totalTasks = this.getTotalTasks();
    domCurrentSpace.classList.add('space-content');
    domCurrentSpace.innerHTML = `
      <h1 class="special"><span style="color: hsl(${this.hue}deg 90% 60% / 100%);">@</span>${this.name}</h1>
      <p class="text-50">${totalTasks === 0 ? 'No' : totalTasks} task${totalTasks !== 1 ? 's' : ''}</p>
    `;
    Section.sectionNames.forEach(sectionName => {
      let sectionComponent = this.sections[sectionName].getSectionComponent();
      if(this.sections[sectionName].tasks.length === 0)
        sectionComponent.style.display = 'none';
      domCurrentSpace.appendChild(sectionComponent);
    });
    return domCurrentSpace;
  }

  getTotalTasks() {
    let result = 0;
    Section.sectionNames.forEach(name => {
      result += this.sections[name].tasks.length;
    });
    return result;
  }

  addTask(task) {
    this.sections[task.getSectionName()].addTask(task);
  }

}

class Section {
  static sectionNames = ["Overdue", "Today", "Tomorrow", "This Week", "Next Week", "Upcoming"];
  name;
  tasks;

  constructor(name, tasks) {
    this.name = name;
    this.tasks = tasks;
  }

  getSectionComponent() {
    const currentSection = document.createElement('section');
    currentSection.classList.add('task-section', `task-section-${this.name.toLowerCase().replace(/\s/g, '')}`);
    currentSection.innerHTML = `
      <h3>${this.name}</h3>
      <hr style="background: hsl(${App.currentSpace.hue}deg 90% 60% / 100%);">
    `;

    for(let task of this.tasks) {
      let currentTask = new Task(task.name, task.description, task.priority, task.dueDate, task.completed);
      currentSection.appendChild(currentTask.getTaskComponent());
    }
    return currentSection;
  }

  addTask(task) {
    this.tasks.push(task);
    let component = document.querySelector(`.task-section-${this.name.toLowerCase().replace(/\s/g, '')}`);
    if(component.style.display === 'none')
      component.style.display = 'flex';
    component.appendChild(task.getTaskComponent());
  }
}
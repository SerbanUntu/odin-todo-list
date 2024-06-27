import { App } from '../..';
import { Task } from '../task';
import './index.css';
import { loadEditDialog } from "../edit-space-dialog";
import { Icon } from '../../util/icon';

export class Space {
  name;
  hue;
  auto;
  list;
  sections;

  constructor(name, hue, auto, list, sections = Space.defaultSections()) {
    this.name = name;
    this.hue = hue;
    this.auto = auto;
    this.list = list;
    this.sections = [];
    sections.forEach(section => {
      let currentSection = new Section(section.name, []);
      section.tasks.forEach(task => {
        currentSection.tasks.push(new Task(task.name, task.description, task.priority, task.dueDate, task.completed, task.id));
      });
      this.sections.push(currentSection);
    })
    this.refreshSections();
  }

  static defaultSections = () => {
    let result = [];
    Section.sectionNames.forEach(name => {
      result.push({ name, tasks: [] });
    });
    return result;
  }

  getSpaceComponent() {
    this.refreshSections();
    let domCurrentSpace = document.createElement('div');
    let totalTasks = this.getTotalTasks();
    domCurrentSpace.classList.add('space-content');
    domCurrentSpace.innerHTML = `
      <h1 class="special"><span style="color: hsl(${this.hue}deg 90% 60% / 100%);">@</span>${this.name}</h1>
      <p class="text-50 space-total-tasks">${totalTasks === 0 ? 'No' : totalTasks} task${totalTasks !== 1 ? 's' : ''}</p>
    `;
    this.sections.forEach(section => {
      let sectionComponent = section.getSectionComponent();
      domCurrentSpace.appendChild(sectionComponent);
    });
    return domCurrentSpace;
  }

  getSidebarButtonComponent() {
    const currentButton = document.createElement('div');
    currentButton.dataset.tasks = this.getTotalTasks();
    currentButton.classList.add('space-button', `space-button-${this.name}`);
    currentButton.innerHTML = `
      <div class="name-and-labels">
        <p class="space-button-name">@${this.name}</p>
      </div>
      <p class="tasks-count">${this.getTotalTasks() > 0 ? this.getTotalTasks() : 'None'}</p>
    `; //! Prevent HTML injection
    if(!this.auto) {
      let settingsIcon = new Icon('settings');
      currentButton.appendChild(settingsIcon.getComponent());
    } else {
      let noIcon = new Icon('no', true);
      currentButton.appendChild(noIcon.getComponent());

    }
    const domNameAndLabels = currentButton.querySelector('.name-and-labels');
    if(this.auto) {
      const autoTag = document.createElement('div');
      autoTag.classList.add('tag', 'auto-tag');
      autoTag.textContent = 'auto';
      domNameAndLabels.appendChild(autoTag);
    }
    if(this.list) {
      const listTag = document.createElement('div');
      listTag.classList.add('tag', 'list-tag');
      listTag.textContent = 'list';
      domNameAndLabels.appendChild(listTag);
    }
    currentButton.addEventListener('click', e => {
      e.preventDefault();
      App.loadSpace(this);
    });
    const domSettingsIcon = currentButton.querySelector('.settings-icon');
    if(domSettingsIcon) domSettingsIcon.addEventListener('click', e => {
      e.preventDefault();
      loadEditDialog(this);
    });
    return currentButton;
  }

  getTotalTasks() {
    let result = 0;
    this.sections.forEach(section => {
      result += section.tasks.length;
    });
    return result;
  }

  addTask(task) {
    const sectionName = task.getSectionName();
    this.sections.forEach((section, index) => {
      if(section.name === sectionName)
        this.sections[index].addTask(task);
    });
    this.updateTaskNumberDependencies();
  }

  deleteTask(task) {
    const sectionName = task.getSectionName();
    const sectionIndex = Section.getIndexFromSectionName(sectionName);
    this.sections[sectionIndex].tasks.forEach((sectionTask, taskIndex) => {
      if(task.id === sectionTask.id) {
        this.sections[sectionIndex].tasks.splice(taskIndex, 1);
        if(this.sections[sectionIndex].tasks.length === 0) {
          let currentSection = this.sections[sectionIndex].getSectionComponentReference();
          currentSection.dataset.tasks = 0;
        }
      }
    });
    this.updateTaskNumberDependencies();
  }

  moveTask(taskIndex, fromSectionIndex, toSectionIndex) {
    let task = this.sections[fromSectionIndex].tasks[taskIndex];
    this.sections[fromSectionIndex].tasks.splice(taskIndex, 1);
    this.sections[toSectionIndex].tasks.push(task);
  }

  refreshSections() {
    this.sections.forEach((section, sectionIndex) => {
      section.tasks.forEach((task, taskIndex) => {
        if(task.getSectionName() !== section.name) {
          this.moveTask(taskIndex, sectionIndex, Section.getIndexFromSectionName(task.getSectionName()));
        }
      });
    });
  }

  updateTaskNumberDependencies() {
    let spaceButton = document.querySelector(`.space-button-${this.name}`);
    let spaceButtonText = spaceButton.querySelector(`.tasks-count`);
    let totalTasksText = document.querySelector('.space-total-tasks');
    const totalTasks = this.getTotalTasks();
    spaceButton.dataset.tasks = totalTasks;
    spaceButtonText.textContent = `${totalTasks > 0 ? totalTasks : 'None'}`;
    totalTasksText.textContent = `${totalTasks === 0 ? 'No' : totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
  }

}

class Section {
  static sectionNames = ["Overdue", "Today", "This Week", "Next Week", "Upcoming"];
  name;
  tasks;

  constructor(name, tasks) {
    this.name = name;
    this.tasks = tasks;
  }

  static getIndexFromSectionName(name) {
    let result = -1;
    Section.sectionNames.forEach((sectionName, index) => {
      if(sectionName === name) {
        result = index;
        return;
      }
    });
    return result;
  }

  getSectionComponent() {
    const currentSection = document.createElement('section');
    currentSection.classList.add('task-section', `task-section-${this.name.toLowerCase().replace(/\s/g, '')}`);
    currentSection.dataset.tasks = this.tasks.length;
    currentSection.innerHTML = `
      <h3>${this.name}</h3>
      <hr style="background: hsl(${App.currentSpace.hue}deg 90% 60% / 100%);">
    `;

    for(let task of this.tasks)
      currentSection.appendChild(task.getTaskComponent());
    return currentSection;
  }

  getSectionComponentReference() {
    return document.querySelector(`.task-section-${this.name.toLowerCase().replace(/\s/g, '')}`);
  }

  addTask(task) {
    this.tasks.push(task);
    let component = this.getSectionComponentReference();
    console
    component.dataset.tasks = this.tasks.length;
    component.appendChild(task.getTaskComponent());
  }
}
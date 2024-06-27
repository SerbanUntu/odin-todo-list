import { App } from '../..';
import { Task } from '../task';
import './index.css';
import { loadEditSpaceDialog } from "../edit-space-dialog";
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
  }

  static defaultSections = () => {
    let result = [];
    Section.sectionNames.forEach(name => {
      result.push({ name, tasks: [] });
    });
    return result;
  }

  getSpaceComponent() {
    let domCurrentSpace = document.createElement('div');
    let totalTasks = this.getTotalTasksLeft();
    domCurrentSpace.classList.add('space-content');
    //! Prevent injection
    domCurrentSpace.innerHTML = `
      <h1 class="special"><span style="color: hsl(${this.hue}deg 90% 60% / 100%);">@</span>${this.name}</h1>
      <p class="text-50 space-total-tasks">${totalTasks === 0 ? 'No' : totalTasks} task${totalTasks !== 1 ? 's' : ''} left</p>
    `;
    this.sections.forEach(section => {
      let sectionComponent = section.getSectionComponent();
      domCurrentSpace.appendChild(sectionComponent);
    });
    return domCurrentSpace;
  }

  getSidebarButtonComponent() {
    const currentButton = document.createElement('div');
    currentButton.dataset.tasks = this.getTotalTasksLeft();
    currentButton.classList.add('space-button', `space-button-${this.name}`);
    currentButton.innerHTML = `
      <div class="name-and-labels">
        <p class="space-button-name">@${this.name}</p>
      </div>
      <p class="tasks-count">${this.getTotalTasksLeft() > 0 ? this.getTotalTasksLeft() : 'None'}</p>
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
      loadEditSpaceDialog(this);
    });
    return currentButton;
  }

  getTotalTasksLeft() {
    let result = 0;
    this.sections.forEach(section => {
      section.tasks.forEach(task => { result += task.completed === false ? 1 : 0 });
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
    const section = this.sections[sectionIndex];
    let getTaskComponent = document.querySelector(`.task-${task.id}`);
    getTaskComponent.remove();
    section.tasks.splice(task.getIndex(), 1);
    let sectionComponent = section.getSectionComponentReference();
    sectionComponent.dataset.tasks = section.tasks.length;
    this.updateTaskNumberDependencies();
  }

  transferTask(task, spaceName) {
    let toSpace;
    App.spaces.forEach(space => {
      if(space.name === spaceName) {
        toSpace = space;
        return;
      }
    });
    toSpace.addTask(task);
    toSpace.updateTaskNumberDependencies();
    this.deleteTask(task);
  }

  refreshSections() {
    let flag = true;
    this.sections.forEach((section, sectionIndex) => {
      section.tasks.forEach((task, taskIndex) => {
        if(task.getSectionName() !== section.name) {
          let oldSectionIndex = sectionIndex;
          let newSectionIndex = Section.getIndexFromSectionName(task.getSectionName());
          let oldTaskComponent = document.querySelector(`.task-${task.id}`);
          let sectionComponent = section.getSectionComponentReference();
          oldTaskComponent.remove();
          this.sections[oldSectionIndex].tasks.splice(taskIndex, 1);
          this.sections[newSectionIndex].addTask(task);
          sectionComponent.dataset.tasks = section.tasks.length;
          flag = false;
          return;
        }
      });
    });
    if(!flag) this.refreshSections();
  }

  updateTaskNumberDependencies() {
    let spaceButton = document.querySelector(`.space-button-${this.name}`);
    let spaceButtonText = spaceButton.querySelector(`.tasks-count`);
    let totalTasksText = document.querySelector('.space-total-tasks');
    const totalTasks = this.getTotalTasksLeft();
    spaceButton.dataset.tasks = totalTasks;
    spaceButtonText.textContent = `${totalTasks > 0 ? totalTasks : 'None'}`;
    totalTasksText.textContent = `${totalTasks === 0 ? 'No' : totalTasks} task${totalTasks !== 1 ? 's' : ''} left`;
  }
}

export class Section {
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
    //! Prevent injection
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
    component.dataset.tasks = this.tasks.length;
    component.appendChild(task.getTaskComponent());
  }
}
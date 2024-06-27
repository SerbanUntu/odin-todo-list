import './index.css';
import { App } from '../..';
import { Icon } from '../../util/icon';
import { Section } from '../space'
import { loadEditTaskDialog } from '../edit-task-dialog';
import { loadTransferTaskDialog } from '../transfer-task-dialog';

export class Task {
  name;
  description;
  priority;
  dueDate;
  completed;
  id;

  constructor(name, description, priority, dueDate, completed, id = Date.now()) {
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate || Task.formatDate(new Date());
    this.completed = completed;
    this.id = id;
  }

  static formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  getDaysUntilToday() {
    return parseInt((new Date(Task.formatDate(new Date())) - new Date(this.dueDate)) / 86_400_000); // Reset hours and minutes
  }
 
  getDaysUntilEndOfWeek() {
    let dayOfWeek = (new Date()).getDay();
    if(dayOfWeek === 0) dayOfWeek = 7;
    return 7 - dayOfWeek;
  }

  getSectionName() {
    const daysUntilToday = this.getDaysUntilToday();
    const daysUntilEndOfWeek = this.getDaysUntilEndOfWeek();
    if(daysUntilToday === 0)
      return 'Today';
    if(daysUntilToday > 0)
      return 'Overdue';
    if(daysUntilToday >= -daysUntilEndOfWeek)
      return 'This Week';
    if(daysUntilToday >= -daysUntilEndOfWeek - 7)
      return 'Next Week';
    return 'Upcoming';
  }

  getTagContent() {
    switch(this.getDaysUntilToday()) {
      case 1:
        return 'yesterday';
      case 0:
        return 'today';
      case -1:
        return 'tomorrow';
    }
    return this.dueDate;
  }

  getTagStyle() {
    const daysUntilToday = this.getDaysUntilToday();
    const daysUntilEndOfWeek = this.getDaysUntilEndOfWeek();
    switch(daysUntilToday) {
      case 1:
        return 'yesterday';
      case 0:
        return 'today';
      case -1:
        return 'tomorrow';
    }
    if(daysUntilToday > 1)
      return 'overdue';
    if(daysUntilToday >= -daysUntilEndOfWeek)
        return 'this-week';
    return 'after-this-week';
  }

  getIndex() {
    let result = -1;
    const sectionName = this.getSectionName();
    const sectionIndex = Section.getIndexFromSectionName(sectionName);
    App.currentSpace.sections[sectionIndex].tasks.forEach((sectionTask, taskIndex) => {
      if(this.id === sectionTask.id) {
        result = taskIndex;
        return;
      }
    });
    return result;
  }

  getTaskComponent() {
    const taskComponent = document.createElement('article');
    taskComponent.classList.add('task', `task-${this.id}`);
    taskComponent.innerHTML = `
      <div class="task-body">
        <button class="priority-bubble priority-${this.priority} round"></button>
        <p class="large" title="${this.name}"></p>
      </div>
      <p class="desc"></p>
    `;
    taskComponent.querySelector('p.large').textContent = this.name;
    taskComponent.querySelector('p.desc').textContent = this.description;
    taskComponent.dataset.completed = this.completed;
    const taskBody = taskComponent.querySelector('.task-body');
    const priorityBubble = taskComponent.querySelector('.priority-bubble');
    priorityBubble.addEventListener('click', e => {
      e.preventDefault();
      this.completed = !this.completed;
      taskComponent.dataset.completed = taskComponent.dataset.completed === 'true' ? 'false' : 'true';
      App.currentSpace.updateTaskNumberDependencies();
    });
    let tickIcon = (new Icon('tick')).getComponent();
    priorityBubble.appendChild(tickIcon);
    taskBody.appendChild(this.getDateTagComponent());
    let editIcon = (new Icon('edit')).getComponent();
    editIcon.title = 'Edit';
    editIcon.addEventListener('click', e => {
      e.preventDefault();
      loadEditTaskDialog(this);
    });
    let transferIcon = (new Icon('transfer')).getComponent();
    transferIcon.title = 'Transfer to another space';
    transferIcon.addEventListener('click', e => {
      e.preventDefault();
      if(App.spaces.length > 1) loadTransferTaskDialog(this);
    });
    let deleteIcon = (new Icon('delete')).getComponent();
    deleteIcon.title = 'Delete';
    deleteIcon.addEventListener('click', e => {
      e.preventDefault();
      this.delete();
    });
    taskBody.appendChild(editIcon);
    taskBody.appendChild(transferIcon);
    taskBody.appendChild(deleteIcon);
    return taskComponent;
  }

  getTaskComponentReference() {
    return document.querySelector(`.task-${this.id}`);
  }

  getDateTagComponent() {
    const tagComponent = document.createElement('div');
    tagComponent.textContent = this.getTagContent();
    tagComponent.classList.add('tag', `${this.getTagStyle()}-tag`);
    return tagComponent;
  }

  delete() {
    App.currentSpace.deleteTask(this);
  }

  edit(name, description, priority, dueDate) {
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    const component = this.getTaskComponentReference();
    const priorityBubble = component.querySelector('.priority-bubble');
    const taskName = component.querySelector('p.large');
    const descriptionComponent = component.querySelector('p.desc');
    const oldTag = component.querySelector(`.tag`);
    const newTag = this.getDateTagComponent();
    const editIcon = component.querySelector('.edit-icon');
    const taskBody = component.querySelector('.task-body');
    oldTag.remove();
    priorityBubble.classList.remove('priority-high', 'priority-medium', 'priority-low', 'priority-none');
    priorityBubble.classList.add('priority-bubble', `priority-${this.priority}`, 'round');
    taskName.textContent = this.name;
    descriptionComponent.textContent = this.description;
    taskBody.insertBefore(newTag, editIcon);
    App.currentSpace.refreshSections();
  }
}
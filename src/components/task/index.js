import './index.css';
import { App } from '../..';
import { Icon } from '../../util/icon';

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

  getTaskComponent() {
    const taskComponent = document.createElement('div');
    taskComponent.classList.add('task', `task-${this.id}`);
    taskComponent.innerHTML = `
      <div class="task-body">
        <div class="priority-bubble priority-${this.priority}"></div>
        <p class="large">${this.name}</p>
      </div>
      <small class="desc">${this.description}</small>
    `;
    taskComponent.dataset.completed = this.completed;
    const taskBody = taskComponent.querySelector('.task-body');
    const priorityBubble = taskComponent.querySelector('.priority-bubble');
    priorityBubble.addEventListener('click', e => {
      e.preventDefault();
      this.completed = !this.completed;
      taskComponent.dataset.completed = taskComponent.dataset.completed === 'true' ? 'false' : 'true';
    });
    let tickIcon = (new Icon('tick')).getComponent();
    priorityBubble.appendChild(tickIcon);
    taskBody.appendChild(this.getDateTagComponent());
    let editIcon = (new Icon('edit')).getComponent();
    let transferIcon = (new Icon('transfer')).getComponent();
    let deleteIcon = (new Icon('delete')).getComponent();
    deleteIcon.addEventListener('click', e => {
      e.preventDefault();
      this.delete();
    });
    taskBody.appendChild(editIcon);
    taskBody.appendChild(transferIcon);
    taskBody.appendChild(deleteIcon);
    return taskComponent;
  }

  getDateTagComponent() {
    const tagComponent = document.createElement('div');
    tagComponent.textContent = this.getTagContent();
    tagComponent.classList.add('tag', `${this.getTagStyle()}-tag`);
    return tagComponent;
  }

  delete() {
    App.currentSpace.deleteTask(this);
    const taskComponent = document.querySelector(`.task-${this.id}`);
    taskComponent.remove();
  }
}
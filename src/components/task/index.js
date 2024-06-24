import './index.css';
import editIconPath from '../../images/edit.svg';
import transferIconPath from '../../images/transfer.svg';

class DateTag {
  constructor(formattedDate) {
    this.formattedDate = formattedDate;
  }

  getDateTagComponent() {
    function setTag(text, identifier) {
      tagComponent.textContent = text;
      tagComponent.classList.add(`${identifier}-tag`);
    }

    const dayDifference = parseInt((new Date(Task.formatDate(new Date())) - new Date(this.formattedDate)) / 86_400_000); // Reset hours and minutes
    let dayOfWeek = (new Date()).getDay();
    if(dayOfWeek === 0) dayOfWeek = 7;
    const maxDayDifference = 7 - dayOfWeek;
    const tagComponent = document.createElement('div');
    tagComponent.classList.add('tag');
    switch(dayDifference) {
      case 1:
        setTag('yesterday', 'yesterday');
        break;
      case 0:
        setTag('today', 'today');
        break;
      case -1:
        setTag('tomorrow', 'tomorrow');
        break;
    }
    if(dayDifference > 1)
      setTag(this.formattedDate, 'overdue');
    if(dayDifference < -1) {
      if(dayDifference >= -maxDayDifference)
        setTag(this.formattedDate, 'this-week');
      else
        setTag(this.formattedDate, 'after-this-week');
    }
    return tagComponent;
  }
}

export class Task {
  constructor(name, description, priority, dueDate, completed) {
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate || Task.formatDate(new Date());
    this.completed = completed;
  }

  static formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  getTaskComponent() {
    const taskComponent = document.createElement('div');
    taskComponent.classList.add('task');
    taskComponent.innerHTML = `
      <div class="task-body">
        <div class="priority-bubble priority-${this.priority}">
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.708 0L4.8 7.908L1.692 4.812L0 6.504L4.8 11.304L14.4 1.704L12.708 0Z"/>
          </svg>
        </div>
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
    const dateTag = new DateTag(this.dueDate);
    taskBody.appendChild(dateTag.getDateTagComponent());
    let editIcon = new Image();
    editIcon.src = editIconPath;
    editIcon.classList.add('edit-icon');
    let transferIcon = new Image();
    transferIcon.src = transferIconPath;
    transferIcon.classList.add('transfer-icon');
    taskBody.appendChild(editIcon);
    taskBody.appendChild(transferIcon);
    return taskComponent;
  }
}
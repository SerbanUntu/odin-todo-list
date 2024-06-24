import { loadSpace } from "../space";
import './index.css';

const domNav = document.querySelector('nav.space-navigation');

export function addSpaceButton(name, space) {
  const currentButton = document.createElement('div');
  currentButton.dataset.name = name;
  currentButton.classList.add('space-button');
  currentButton.innerHTML = `
    <div class="name-and-labels">
      <p>@${name}</p>
    </div>
    <p>${space.tasks.length}</p>
  `; //! Prevent HTML injection
  domNav.appendChild(currentButton);
  const domNameAndLabels = currentButton.querySelector('.name-and-labels');
  if(space.auto === "true") {
    const autoTag = document.createElement('div');
    autoTag.classList.add('tag', 'auto-tag');
    autoTag.innerText = 'auto';
    domNameAndLabels.appendChild(autoTag);
  }
  if(space.list === "true") {
    const listTag = document.createElement('div');
    listTag.classList.add('tag', 'list-tag');
    listTag.innerText = 'list';
    domNameAndLabels.appendChild(listTag);
  }
  currentButton.addEventListener('click', e => {
    e.preventDefault();
    loadSpace(name, space);
  });
}

export function addSelectedStyles(name, space) {
  const currentButton = document.querySelector(`.space-button[data-name="${name}"]`);
  currentButton.style.borderLeft = `4px solid hsl(${space.hue}deg 90% 60% / 100%)`;
  currentButton.style.background = `hsl(${space.hue}deg 90% 60% / 5%)`;
}

export function removeSelectedStyles(name) {
  const currentButton = document.querySelector(`.space-button[data-name="${name}"]`);
  currentButton.style.borderLeft = ``;
  currentButton.style.background = ``;
}
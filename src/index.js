import './styles/reset.css';
import './styles/style.css';
import defaultProjects from './components/init.json';

const domNav = document.querySelector('nav.project-navigation');

let projects = JSON.parse(localStorage.getItem('@spaces-projects'));

if(projects === null) {
  projects = defaultProjects;
}

for(let [name, project] of Object.entries(projects)) {
  const currentButton = document.createElement('div');
  currentButton.classList.add('project-button');
  currentButton.innerHTML = `
    <div class="name-and-labels">
      <p>@${name}</p>
    </div>
    <p>${project.tasks.length}</p>
  `;
  domNav.appendChild(currentButton);
  currentButton.addEventListener('click', e => {
    e.preventDefault();
    currentButton.style.borderLeft = `4px solid hsl(${project.hue}deg 90% 60% / 100%)`;
    currentButton.style.background = `hsl(${project.hue}deg 90% 60% / 5%)`;
  });
}
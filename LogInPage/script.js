const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

const userBox = document.querySelector('.user-box');
const settingsMenu = document.createElement('div');
const logoutOption = document.createElement('a');

settingsMenu.classList.add('settings-menu');
logoutOption.classList.add('logout-option');
logoutOption.innerText = 'Logout';

userBox.addEventListener('click', () => {
  settingsMenu.style.display = 'block';
});

document.addEventListener('click', (event) => {
  if (!userBox.contains(event.target) && !settingsMenu.contains(event.target)) {
    settingsMenu.style.display = 'none';
  }
});

settingsMenu.appendChild(logoutOption);
userBox.appendChild(settingsMenu);
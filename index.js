import { updateChecker } from './update-checker.js';

updateChecker();

const welcomeText = document.createElement('h3');
welcomeText.textContent = "Hello from index.js!";
document.body.appendChild(welcomeText);
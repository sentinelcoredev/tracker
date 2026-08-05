import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
let table1Data = new Array(100).fill(false);
let table2Data = new Array(100).fill(false);
// table 1
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('buttonGrid');
  const progressBar = document.getElementById('progressBar');
  let count = 0;

  for (let i = 1; i <= 100; i++) {
    const btn = document.createElement('button');
    btn.className = 'tracker-btn';
    btn.textContent = "Month " + i;
    
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      count = document.querySelectorAll('.tracker-btn.active').length;
      const percent = Math.round((count / 100) * 100);
      progressBar.style.width = percent + '%';
      progressBar.textContent = percent + '%';
    });
    
    grid.appendChild(btn);
  }
});
//table 2
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('buttonGrid2');
  const progressBar = document.getElementById('progressBar2');
  let count = 0;

  for (let i = 1; i <= 100; i++) {
    const btn = document.createElement('button');
    btn.className = 'tracker-btn';
    btn.textContent = "Month " + i;
    
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      count = document.querySelectorAll('.tracker-btn.active').length;
      const percent = Math.round((count / 100) * 100);
      progressBar.style.width = percent + '%';
      progressBar.textContent = percent + '%';
    });
    
    grid.appendChild(btn);
  }
});

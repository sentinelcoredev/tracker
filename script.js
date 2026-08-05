import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const docRef = doc(db, "trackers", "investmentData");

// Default initial state for 100 months each
let trackerState = {
  list1: new Array(100).fill(false),
  list2: new Array(100).fill(false)
};

document.addEventListener('DOMContentLoaded', async () => {
  await loadTrackerData();
  
  setupGrid('buttonGrid', 'progressBar', 'list1');
  setupGrid('buttonGrid2', 'progressBar2', 'list2');
});

// Load saved button states from Firestore
async function loadTrackerData() {
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      trackerState = docSnap.data();
    }
  } catch (error) {
    console.error("Error fetching tracker data:", error);
  }
}

// Save current button states to Firestore
async function saveTrackerData() {
  try {
    await setDoc(docRef, trackerState);
  } catch (error) {
    console.error("Error saving tracker data:", error);
  }
}

// Reusable function to initialize and track each grid independently
function setupGrid(gridId, progressBarId, stateKey) {
  const grid = document.getElementById(gridId);
  const progressBar = document.getElementById(progressBarId);

  grid.innerHTML = ''; // Clear existing DOM elements

  for (let i = 0; i < 100; i++) {
    const btn = document.createElement('button');
    btn.className = 'tracker-btn';
    btn.textContent = "Month " + (i + 1);

    // Apply active class if stored as true in Firestore state
    if (trackerState[stateKey][i]) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', async () => {
      btn.classList.toggle('active');
      trackerState[stateKey][i] = btn.classList.contains('active');

      updateProgressBar(grid, progressBar);
      await saveTrackerData();
    });

    grid.appendChild(btn);
  }

  updateProgressBar(grid, progressBar);
}

// Scoped progress bar updater
function updateProgressBar(gridElement, progressBarElement) {
  const activeCount = gridElement.querySelectorAll('.tracker-btn.active').length;
  const percent = Math.round((activeCount / 100) * 100);
  progressBarElement.style.width = percent + '%';
  progressBarElement.textContent = percent + '%';
}
console.log("Script loaded and event listeners set up.");
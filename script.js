import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const docRef = doc(db, "trackers", "investmentData");

const CONFIG = [
  {
    gridId: 'buttonGrid',
    progressBarId: 'progressBar',
    stateKey: 'list1',
    length: 100 // List 1 has 100 months
  },
  {
    gridId: 'buttonGrid2',
    progressBarId: 'progressBar2',
    stateKey: 'list2',
    length: 36  // List 2 has 36 months
  }
];

// Initialize dynamic tracker state object
let trackerState = {};

document.addEventListener('DOMContentLoaded', async () => {
  // Setup default state based on configuration length
  CONFIG.forEach(tracker => {
    trackerState[tracker.stateKey] = new Array(tracker.length).fill(false);
  });

  await loadTrackerData();
  
  // Render each configured grid dynamically
  CONFIG.forEach(tracker => {
    setupGrid(tracker);
  });
});

// Load saved button states from Firestore
async function loadTrackerData() {
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const savedData = docSnap.data();
      // Merge saved data while retaining structural length array integrity
      CONFIG.forEach(tracker => {
        if (savedData[tracker.stateKey]) {
          trackerState[tracker.stateKey] = savedData[tracker.stateKey];
        }
      });
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

// Reusable function to initialize each grid based on its unique configuration
function setupGrid({ gridId, progressBarId, stateKey, length }) {
  const grid = document.getElementById(gridId);
  const progressBar = document.getElementById(progressBarId);

  if (!grid || !progressBar) return;

  grid.innerHTML = ''; // Clear existing DOM elements

  for (let i = 0; i < length; i++) {
    const btn = document.createElement('button');
    btn.className = 'tracker-btn';
    btn.textContent = "Month " + (i + 1);

    // Apply active class if stored as true in state
    if (trackerState[stateKey][i]) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', async () => {
      btn.classList.toggle('active');
      trackerState[stateKey][i] = btn.classList.contains('active');

      updateProgressBar(grid, progressBar, length);
      await saveTrackerData();
    });

    grid.appendChild(btn);
  }

  updateProgressBar(grid, progressBar, length);
}

// Progress bar updater scaled to the specific list's total length
function updateProgressBar(gridElement, progressBarElement, totalLength) {
  const activeCount = gridElement.querySelectorAll('.tracker-btn.active').length;
  const percent = Math.round((activeCount / totalLength) * 100);
  progressBarElement.style.width = percent + '%';
  progressBarElement.textContent = percent + '%';
}

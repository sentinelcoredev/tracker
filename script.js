import { db } from "./firebase.js";
import { 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// ⚙️ CONFIGURATION & CONSTANTS
// ==========================================

const DATABASE_COLLECTION = "trackers"; 
const DEFAULT_DOC_ID = "default_user"; // Replace with your desired document ID

const CONFIG = [
  { 
    gridId: 'buttonGrid', 
    progressBarId: 'progressBar', 
    stateKey: 'list1', 
    length: 60 
  },
  { 
    gridId: 'buttonGrid2', 
    progressBarId: 'progressBar2', 
    stateKey: 'list2', 
    length: 11  
  }
];

let trackerState = {};

// Initialize application on load
init();

async function init() {
  resetTrackerState();
  await loadTrackerData(DEFAULT_DOC_ID);
  renderGrids();
}

// ==========================================
// 💾 FIRESTORE DATA MANAGEMENT
// ==========================================

function resetTrackerState() {
  trackerState = {};
  CONFIG.forEach(tracker => {
    trackerState[tracker.stateKey] = new Array(tracker.length).fill(false);
  });
}

export async function loadTrackerData(docId) {
  const userDocRef = doc(db, DATABASE_COLLECTION, docId);

  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const savedData = docSnap.data();
      
      CONFIG.forEach(tracker => {
        if (savedData[tracker.stateKey]) {
          const savedArray = savedData[tracker.stateKey];
          for (let i = 0; i < tracker.length; i++) {
            if (savedArray[i] !== undefined) {
              trackerState[tracker.stateKey][i] = savedArray[i];
            }
          }
        }
      });
    }
    return trackerState;
  } catch (error) {
    console.error("Error fetching tracker data:", error);
  }
}

export async function saveTrackerData(docId, updatedState) {
  const userDocRef = doc(db, DATABASE_COLLECTION, docId);
  try {
    await setDoc(userDocRef, updatedState || trackerState, { merge: true });
  } catch (error) {
    console.error("Error saving tracker data:", error);
  }
}

// ==========================================
// 🎨 UI RENDER FUNCTIONS
// ==========================================

function renderGrids() {
  CONFIG.forEach(tracker => setupGrid(tracker));
}

function setupGrid({ gridId, progressBarId, stateKey, length }) {
  const grid = document.getElementById(gridId);
  const progressBar = document.getElementById(progressBarId);
  if (!grid || !progressBar) return;

  grid.innerHTML = '';

  for (let i = 0; i < length; i++) {
    const btn = document.createElement('button');
    btn.className = 'tracker-btn';
    btn.textContent = "Month " + (i + 1);

    if (trackerState[stateKey] && trackerState[stateKey][i]) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', async () => {
      btn.classList.toggle('active');
      trackerState[stateKey][i] = btn.classList.contains('active');

      updateProgressBar(grid, progressBar, length);
      await saveTrackerData(DEFAULT_DOC_ID);
    });

    grid.appendChild(btn);
  }

  updateProgressBar(grid, progressBar, length);
}

function updateProgressBar(gridElement, progressBarElement, totalLength) {
  const activeCount = gridElement.querySelectorAll('.tracker-btn.active').length;
  const percent = Math.round((activeCount / totalLength) * 100);
  progressBarElement.style.width = percent + '%';
  progressBarElement.textContent = percent + '%';
}

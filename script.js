import { db, auth, googleProvider } from "./firebase.js";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// ⚙️ CONFIGURATION & CONSTANTS
// ==========================================

const DATABASE_COLLECTION = "trackers"; 

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

let currentUser = null;
let trackerState = {};

// UI elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');

// ==========================================
// 🔐 AUTHENTICATION & INITIALIZATION
// ==========================================

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    userName.textContent = `Hello, ${user.displayName || 'User'}`;
    loginBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    
    await loadTrackerData();
  } else {
    currentUser = null;
    loginBtn.style.display = 'inline-block';
    userInfo.style.display = 'none';
    
    resetTrackerState();
  }
  
  renderGrids();
});

loginBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Login failed:", error.code, error.message);
    alert(`Authentication failed: ${error.message}`);
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
  }
});

// ==========================================
// 💾 FIRESTORE DATA MANAGEMENT
// ==========================================

function resetTrackerState() {
  trackerState = {};
  CONFIG.forEach(tracker => {
    trackerState[tracker.stateKey] = new Array(tracker.length).fill(false);
  });
}

async function loadTrackerData() {
  if (!currentUser) return;
  
  resetTrackerState();
  const userDocRef = doc(db, DATABASE_COLLECTION, currentUser.uid);

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
  } catch (error) {
    console.error("Error fetching tracker data:", error);
  }
}

async function saveTrackerData() {
  if (!currentUser) {
    alert("Please sign in to save your progress!");
    return;
  }

  const userDocRef = doc(db, DATABASE_COLLECTION, currentUser.uid);
  try {
    await setDoc(userDocRef, trackerState, { merge: true });
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
      if (!currentUser) {
        alert("Please sign in to modify tracking data.");
        return;
      }
      
      btn.classList.toggle('active');
      trackerState[stateKey][i] = btn.classList.contains('active');

      updateProgressBar(grid, progressBar, length);
      await saveTrackerData();
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
// State variables
let arrayData = [];
let isSearching = false;
let searchInterval = null;

// DOM Elements
const inputContainer = document.getElementById("inputContainer");
const elementInput = document.getElementById("elementInput");
const insertBtn = document.getElementById("insertBtn");
const deleteBtn = document.getElementById("deleteBtn");
const targetInput = document.getElementById("targetInput");
const targetDisplay = document.getElementById("targetDisplay");
const arrayStage = document.getElementById("arrayStage");
const statusBox = document.getElementById("statusBox");
const beginSearchBtn = document.getElementById("beginSearchBtn");
const newSearchBtn = document.getElementById("newSearchBtn");

// Live update "Your Target = {number}" in top-right corner
targetInput.addEventListener("input", () => {
  const val = targetInput.value.trim();
  targetDisplay.textContent = val !== "" ? val : "—";
  clearStatusAndGlow();
});

// Allow pressing Enter inside elementInput to insert
elementInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    insertBtn.click();
  }
});

// Insert Button Logic
insertBtn.addEventListener("click", () => {
  if (isSearching) return;

  const rawValue = elementInput.value.trim();
  if (rawValue === "") return;

  const num = Number(rawValue);
  if (Number.isNaN(num)) return;

  // Special Case (iii): Check ascending order constraint
  if (arrayData.length > 0 && num < arrayData[arrayData.length - 1]) {
    alert("Please Enter the elements in ascending order");
    resetEverything();
    return;
  }

  clearStatusAndGlow();
  arrayData.push(num);
  elementInput.value = "";
  elementInput.focus();
  renderArray();
});

// Delete Button Logic (removes last inserted element like a queue/stack tail or matching value)
deleteBtn.addEventListener("click", () => {
  if (isSearching) return;
  if (arrayData.length === 0) return;

  const rawValue = elementInput.value.trim();
  if (rawValue !== "") {
    const numToRemove = Number(rawValue);
    const idx = arrayData.indexOf(numToRemove);
    if (idx !== -1) {
      arrayData.splice(idx, 1);
    } else {
      arrayData.pop();
    }
    elementInput.value = "";
  } else {
    arrayData.pop();
  }

  clearStatusAndGlow();
  renderArray();
});

// Render the array elements with indices 0..n-1 and optional lo, up, mid pointers
function renderArray(pointers = null) {
  arrayStage.innerHTML = "";

  if (arrayData.length === 0) {
    const placeholder = document.createElement("p");
    placeholder.className = "empty-placeholder";
    placeholder.textContent = "Insert ascending numbers on the left to build the array...";
    arrayStage.appendChild(placeholder);
    return;
  }

  arrayData.forEach((value, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "element-wrapper";

    // Apply fading and highlights during search iterations
    if (pointers) {
      const { lo, up, mid } = pointers;
      if (index < lo || index > up) {
        wrapper.classList.add("faded");
      }
      if (index === mid) {
        wrapper.classList.add("is-mid");
      }
    }

    // Top pointer: (↓mid)
    const topPointer = document.createElement("div");
    topPointer.className = "pointer-top";
    if (pointers && index === pointers.mid) {
      topPointer.textContent = "↓mid";
    }

    // Number Tile
    const box = document.createElement("div");
    box.className = "array-box";
    box.textContent = value;

    // Index Label
    const indexLabel = document.createElement("div");
    indexLabel.className = "index-label";
    indexLabel.textContent = index;

    // Bottom pointers: (↑lo) and/or (↑up)
    const bottomPointer = document.createElement("div");
    bottomPointer.className = "pointer-bottom";
    if (pointers) {
      const labels = [];
      if (index === pointers.lo) labels.push("↑lo");
      if (index === pointers.up) labels.push("↑up");
      bottomPointer.innerHTML = labels.join("<br>");
    }

    wrapper.appendChild(topPointer);
    wrapper.appendChild(box);
    wrapper.appendChild(indexLabel);
    wrapper.appendChild(bottomPointer);
    arrayStage.appendChild(wrapper);
  });
}

// Begin Search Button Logic
beginSearchBtn.addEventListener("click", () => {
  if (isSearching) return;

  // Special Case (i): User hits "Begin Search" without entering any element
  if (arrayData.length === 0) {
    showStatus("Please Enter Numbers to Search", "warning");
    inputContainer.classList.add("glow-alert");
    elementInput.focus();
    return;
  }

  const rawTarget = targetInput.value.trim();
  if (rawTarget === "") {
    showStatus("Please Enter a Target Number to Search", "warning");
    inputContainer.classList.add("glow-alert");
    targetInput.focus();
    return;
  }

  const target = Number(rawTarget);
  targetDisplay.textContent = target;
  clearStatusAndGlow();

  startBinarySearch(target);
});

// Step-by-step animated Binary Search
function startBinarySearch(target) {
  isSearching = true;
  setControlsDisabled(true);

  let lo = 0;
  let up = arrayData.length - 1;
  let comparisons = 0;
  const startTime = performance.now();

  const executeStep = () => {
    if (lo > up) {
      const elapsedMs = (performance.now() - startTime).toFixed(2);
      finishSearch(false, -1, comparisons, elapsedMs);
      return;
    }

    const mid = Math.floor((lo + up) / 2);
    comparisons++;

    // Render current pass with ↑lo, ↑up, ↓mid, faded out parts, and sea-green glow on mid
    renderArray({ lo, up, mid });

    if (arrayData[mid] === target) {
      const elapsedMs = (performance.now() - startTime).toFixed(2);
      setTimeout(() => {
        finishSearch(true, mid, comparisons, elapsedMs);
      }, 650);
      return;
    }

    if (arrayData[mid] < target) {
      lo = mid + 1;
    } else {
      up = mid - 1;
    }

    searchInterval = setTimeout(executeStep, 1200);
  };

  executeStep();
}

// Display exact required success/failure messages from the blueprint
function finishSearch(found, foundIndex, comparisons, timeMs) {
  isSearching = false;
  searchInterval = null;
  setControlsDisabled(false);

  if (found) {
    const msg =
      `Search is Successful, item found at index: ${foundIndex}<br>` +
      `Total comparison(s): ${comparisons} | Time taken: ${timeMs} ms`;
    showStatus(msg, "success");
  } else {
    // Fade entire array when target is absent
    renderArray({ lo: 1, up: 0, mid: -1 });
    const msg =
      `Search is Unsuccessful, item not found.<br>` +
      `Total comparison(s): ${comparisons} | Time taken: ${timeMs} ms`;
    showStatus(msg, "failure");
  }
}

// Begin New Search Button Logic
newSearchBtn.addEventListener("click", () => {
  // Special Case (ii): Alert if search is currently running, continue after OK
  if (isSearching) {
    alert("A search is going on, Please Wait");
    return;
  }

  resetEverything();
});

// Helper Functions
function resetEverything() {
  if (searchInterval) {
    clearTimeout(searchInterval);
    searchInterval = null;
  }
  isSearching = false;
  arrayData = [];
  elementInput.value = "";
  targetInput.value = "";
  targetDisplay.textContent = "—";
  setControlsDisabled(false);
  clearStatusAndGlow();
  renderArray();
}

function showStatus(htmlMessage, type) {
  statusBox.innerHTML = htmlMessage;
  statusBox.className = `status-box ${type}`;
}

function clearStatusAndGlow() {
  statusBox.className = "status-box hidden";
  statusBox.innerHTML = "";
  inputContainer.classList.remove("glow-alert");
}

function setControlsDisabled(disabled) {
  elementInput.disabled = disabled;
  insertBtn.disabled = disabled;
  deleteBtn.disabled = disabled;
  targetInput.disabled = disabled;
  beginSearchBtn.disabled = disabled;
}
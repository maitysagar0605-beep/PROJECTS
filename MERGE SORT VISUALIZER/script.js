// State Variables
let arrayData = [];
let isSorting = false;
let comparisonCount = 0;

// DOM Elements
const inputCard = document.getElementById("inputCard");
const numberInput = document.getElementById("numberInput");
const insertBtn = document.getElementById("insertBtn");
const deleteBtn = document.getElementById("deleteBtn");

const totalElementsText = document.getElementById("totalElementsText");
const statusBanner = document.getElementById("statusBanner");
const emptyPlaceholder = document.getElementById("emptyPlaceholder");
const initialArrayRow = document.getElementById("initialArrayRow");

const treeWrapper = document.getElementById("treeWrapper");
const treeStage = document.getElementById("treeStage");
const treeLevels = document.getElementById("treeLevels");
const treeSvg = document.getElementById("treeSvg");

const sortedStage = document.getElementById("sortedStage");
const sortedArrayRow = document.getElementById("sortedArrayRow");
const summaryCard = document.getElementById("summaryCard");
const metricsLine = document.getElementById("metricsLine");

const beginSortBtn = document.getElementById("beginSortBtn");
const newSortBtn = document.getElementById("newSortBtn");

// Utility: Delay for smooth animation
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Show Banner Message
function showBanner(message, type = "sea-green") {
  statusBanner.textContent = message;
  statusBanner.classList.remove("hidden", "info-gold");
  if (type === "gold") {
    statusBanner.classList.add("info-gold");
  }
}

function hideBanner() {
  statusBanner.classList.add("hidden");
}

// Render Initial Queue Array with 0-based Indices
function renderInitialArray(highlightMidIndex = -1) {
  totalElementsText.textContent = `Total Elements = ${arrayData.length}`;
  initialArrayRow.innerHTML = "";

  if (arrayData.length === 0) {
    emptyPlaceholder.classList.remove("hidden");
    return;
  }

  emptyPlaceholder.classList.add("hidden");

  arrayData.forEach((num, idx) => {
    const unit = document.createElement("div");
    unit.className = "element-unit";

    const box = document.createElement("div");
    box.className = "element-box";
    if (idx === highlightMidIndex) {
      box.classList.add("midpoint-glow");
    }
    box.textContent = num;

    const indexLabel = document.createElement("span");
    indexLabel.className = "element-index";
    indexLabel.textContent = idx;

    unit.appendChild(box);
    unit.appendChild(indexLabel);
    initialArrayRow.appendChild(unit);
  });
}

// Insert Numbers (Supports single number or comma/space-separated batch)
function handleInsert() {
  if (isSorting) {
    alert("A sort is going on, Please Wait");
    return;
  }

  const raw = numberInput.value.trim();
  if (!raw) return;

  const tokens = raw.split(/[\s,]+/).filter(Boolean);
  const validNumbers = [];

  for (const token of tokens) {
    const parsed = Number(token);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      validNumbers.push(parsed);
    }
  }

  if (validNumbers.length === 0) {
    showBanner("Please enter valid numeric values only.", "gold");
    return;
  }

  // Clear previous sort artifacts if user adds elements after a completed sort
  resetVisualStages();
  hideBanner();
  inputCard.classList.remove("glow-warning");

  arrayData.push(...validNumbers);
  numberInput.value = "";
  renderInitialArray();
}

// Delete Last Inserted Element
function handleDelete() {
  if (isSorting) {
    alert("A sort is going on, Please Wait");
    return;
  }

  if (arrayData.length === 0) return;

  resetVisualStages();
  hideBanner();
  arrayData.pop();
  renderInitialArray();
}

// Check if array is already sorted in ascending order
function isAlreadySorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

// Reset Tree, Sorted Array, and Summary Cards
function resetVisualStages() {
  treeWrapper.classList.add("hidden");
  treeLevels.innerHTML = "";
  treeSvg.innerHTML = "";
  sortedStage.classList.add("hidden");
  sortedArrayRow.innerHTML = "";
  summaryCard.classList.add("hidden");
}

// Draw SVG Connector Lines Between Parent & Child Sub-array Nodes
function drawTreeConnectors() {
  treeSvg.innerHTML = "";
  const stageRect = treeStage.getBoundingClientRect();
  treeSvg.setAttribute("width", treeStage.scrollWidth);
  treeSvg.setAttribute("height", treeStage.scrollHeight);

  const nodes = treeLevels.querySelectorAll(".subarray-node[data-parent]");
  nodes.forEach((childNode) => {
    const parentId = childNode.getAttribute("data-parent");
    const parentNode = document.getElementById(parentId);
    if (!parentNode) return;

    const pRect = parentNode.getBoundingClientRect();
    const cRect = childNode.getBoundingClientRect();

    const x1 = pRect.left - stageRect.left + pRect.width / 2;
    const y1 = pRect.bottom - stageRect.top;
    const x2 = cRect.left - stageRect.left + cRect.width / 2;
    const y2 = cRect.top - stageRect.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "rgba(176, 184, 206, 0.45)");
    line.setAttribute("stroke-width", "1.6");
    treeSvg.appendChild(line);
  });
}

// Build & Animate Divide and Conquer Merge Sort
async function startMergeSort() {
  if (isSorting) {
    alert("A sort is going on, Please Wait");
    return;
  }

  // Special Case 1: Empty Array
  if (arrayData.length === 0) {
    showBanner("Please Enter Numbers", "sea-green");
    inputCard.classList.add("glow-warning");
    numberInput.focus();
    return;
  }

  inputCard.classList.remove("glow-warning");
  resetVisualStages();
  hideBanner();

  // Special Case 3: Already Sorted Array (Display message and exit early)
  if (arrayData.length >= 1 && isAlreadySorted(arrayData)) {
    showBanner("The List is Already Sorted!!", "gold");
    return;
  }

  isSorting = true;
  comparisonCount = 0;
  const startTime = performance.now();

  treeWrapper.classList.remove("hidden");

  // Highlight initial midpoint in the top array
  const rootMid = Math.floor((arrayData.length - 1) / 2);
  renderInitialArray(rootMid);

  // Pre-build levels structure so tree renders cleanly top-down
  const levelContainers = [];
  function getLevelRow(depth) {
    if (!levelContainers[depth]) {
      const row = document.createElement("div");
      row.className = "tree-level-row";
      treeLevels.appendChild(row);
      levelContainers[depth] = row;
    }
    return levelContainers[depth];
  }

  let nodeCounter = 0;

  function createSubarrayNode(arr, depth, parentId = null, highlightMid = -1) {
    const row = getLevelRow(depth);
    const nodeId = `node-${++nodeCounter}`;

    const node = document.createElement("div");
    node.className = "subarray-node active-divide";
    node.id = nodeId;
    if (parentId) {
      node.setAttribute("data-parent", parentId);
    }

    arr.forEach((val, i) => {
      const cell = document.createElement("div");
      cell.className = "node-cell";
      if (i === highlightMid && arr.length > 1) {
        cell.classList.add("midpoint-cell");
      }
      cell.textContent = val;
      node.appendChild(cell);
    });

    row.appendChild(node);
    drawTreeConnectors();
    return node;
  }

  function updateNodeValues(node, newArr, stateClass) {
    node.classList.remove("active-divide", "active-merge", "node-merged");
    if (stateClass) node.classList.add(stateClass);
    node.innerHTML = "";
    newArr.forEach((val) => {
      const cell = document.createElement("div");
      cell.className = "node-cell";
      cell.textContent = val;
      node.appendChild(cell);
    });
  }

  // Recursive Divide & Conquer Visualizer
  async function mergeSortVisual(subArr, depth, parentId) {
    const midIndex = Math.floor((subArr.length - 1) / 2);
    const currentNode = createSubarrayNode(subArr, depth, parentId, midIndex);
    await sleep(480);

    if (subArr.length <= 1) {
      updateNodeValues(currentNode, subArr, "node-merged");
      return subArr;
    }

    const slicePoint = Math.ceil(subArr.length / 2);
    const leftHalf = subArr.slice(0, slicePoint);
    const rightHalf = subArr.slice(slicePoint);

    const sortedLeft = await mergeSortVisual(leftHalf, depth + 1, currentNode.id);
    const sortedRight = await mergeSortVisual(rightHalf, depth + 1, currentNode.id);

    // Conquer / Merge Phase
    updateNodeValues(currentNode, [...sortedLeft, ...sortedRight], "active-merge");
    await sleep(420);

    const merged = [];
    let i = 0;
    let j = 0;

    while (i < sortedLeft.length && j < sortedRight.length) {
      comparisonCount++;
      if (sortedLeft[i] <= sortedRight[j]) {
        merged.push(sortedLeft[i]);
        i++;
      } else {
        merged.push(sortedRight[j]);
        j++;
      }
    }

    while (i < sortedLeft.length) {
      merged.push(sortedLeft[i]);
      i++;
    }

    while (j < sortedRight.length) {
      merged.push(sortedRight[j]);
      j++;
    }

    updateNodeValues(currentNode, merged, "node-merged");
    drawTreeConnectors();
    await sleep(420);

    return merged;
  }

  const finalSorted = await mergeSortVisual([...arrayData], 0, null);
  const endTime = performance.now();
  const elapsedMs = (endTime - startTime).toFixed(2);

  // Render Final Sorted Array with Indices
  renderInitialArray(-1);
  sortedStage.classList.remove("hidden");
  sortedArrayRow.innerHTML = "";

  finalSorted.forEach((num, idx) => {
    const unit = document.createElement("div");
    unit.className = "element-unit";

    const box = document.createElement("div");
    box.className = "element-box sorted-glow";
    box.textContent = num;

    const indexLabel = document.createElement("span");
    indexLabel.className = "element-index";
    indexLabel.textContent = idx;

    unit.appendChild(box);
    unit.appendChild(indexLabel);
    sortedArrayRow.appendChild(unit);
  });

  // Display Completion Summary
  metricsLine.textContent = `Total comparison(s): ${comparisonCount} | Time taken: ${elapsedMs} ms`;
  summaryCard.classList.remove("hidden");

  isSorting = false;
}

// Begin New Sort / Full Reset
function handleNewSort() {
  // Special Case 2: Alert if sorting is currently in progress
  if (isSorting) {
    alert("A sort is going on, Please Wait");
    return;
  }

  arrayData = [];
  comparisonCount = 0;
  numberInput.value = "";
  inputCard.classList.remove("glow-warning");
  hideBanner();
  resetVisualStages();
  renderInitialArray();
}

// Event Listeners
insertBtn.addEventListener("click", handleInsert);
deleteBtn.addEventListener("click", handleDelete);
beginSortBtn.addEventListener("click", startMergeSort);
newSortBtn.addEventListener("click", handleNewSort);

numberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleInsert();
  }
});

window.addEventListener("resize", () => {
  if (!treeWrapper.classList.contains("hidden")) {
    drawTreeConnectors();
  }
});

// Initialize Empty View
renderInitialArray();
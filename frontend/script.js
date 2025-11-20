// API Configuration
const API_BASE_URL = "https://summarization-service-fljf.onrender.com";

// DOM Elements
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const textInput = document.getElementById("textInput");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const styleButtons = document.querySelectorAll(".style-btn");
const summarizeBtn = document.getElementById("summarizeBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const apiStatus = document.getElementById("apiStatus");

// State Elements
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const errorText = document.getElementById("errorText");
const successState = document.getElementById("successState");
const emptyState = document.getElementById("emptyState");
const summaryOutput = document.getElementById("summaryOutput");
const summaryMeta = document.getElementById("summaryMeta");

// Current state
let currentStyle = "brief";
let currentSummary = "";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  checkAPIHealth();
});

// Setup Event Listeners
function setupEventListeners() {
  fileInput.addEventListener("change", handleFileUpload);
  textInput.addEventListener("input", handleTextInput);

  styleButtons.forEach((btn) => {
    btn.addEventListener("click", () => handleStyleChange(btn));
  });

  summarizeBtn.addEventListener("click", handleSummarize);
  clearBtn.addEventListener("click", handleClear);
  copyBtn.addEventListener("click", handleCopy);
  downloadBtn.addEventListener("click", handleDownload);
}

// Check API Health
async function checkAPIHealth() {
  try {
    apiStatus.textContent = "Connecting...";
    apiStatus.className = "api-badge";

    const response = await fetch(`${API_BASE_URL}/health`);

    if (response.ok) {
      const data = await response.json();
      apiStatus.textContent = `✓ Connected - ${data.provider}`;
      apiStatus.classList.add("connected");
    } else {
      throw new Error("Server not responding");
    }
  } catch (error) {
    apiStatus.textContent = "✗ Server Offline";
    apiStatus.classList.add("error");
    showError(
      "Cannot connect to backend server. Please ensure:\n1. Backend server is running (python app.py)\n2. Server is on port 5000"
    );
  }
}

// Handle File Upload
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  const validExtensions = [".txt", ".md", ".json", ".pdf"];
  const fileExtension = "." + file.name.split(".").pop().toLowerCase();

  if (!validExtensions.includes(fileExtension)) {
    showError(
      "Invalid file type. Please upload .txt, .md, .pdf or .json files."
    );
    fileInput.value = "";
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    showError("File is too large. Maximum size is 5MB.");
    fileInput.value = "";
    return;
  }

  try {
    const text = await file.text();
    textInput.value = text;
    fileName.textContent = `📄 ${file.name}`;
    updateTextStats();
    hideAllStates();
    showEmptyState();
  } catch (error) {
    showError("Error reading file. Please try again.");
    fileInput.value = "";
  }
}

// Handle Text Input
function handleTextInput() {
  updateTextStats();
}

// Update Text Statistics
function updateTextStats() {
  const text = textInput.value;
  const chars = text.length;
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  charCount.textContent = chars;
  wordCount.textContent = words;

  // Enable/disable summarize button
  summarizeBtn.disabled = chars < 50;

  // Clear file name if text is cleared
  if (chars === 0) {
    fileName.textContent = "";
  }
}

// Handle Style Change
function handleStyleChange(button) {
  styleButtons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
  currentStyle = button.dataset.style;
}

// Handle Summarize
async function handleSummarize() {
  const text = textInput.value.trim();

  // Validation
  if (!text) {
    showError("Please enter some text to summarize.");
    return;
  }

  if (text.length < 50) {
    showError("Text is too short. Please provide at least 50 characters.");
    return;
  }

  if (text.length > 50000) {
    showError("Text is too long. Please limit to 50,000 characters.");
    return;
  }

  // Show loading state
  hideAllStates();
  loadingState.classList.remove("hidden");
  summarizeBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        style: currentStyle,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate summary");
    }

    // Store current summary
    currentSummary = data.summary;

    // Show success state
    hideAllStates();
    successState.classList.remove("hidden");
    summaryOutput.textContent = data.summary;

    // Show metadata
    summaryMeta.innerHTML = `
            <strong>Style:</strong> ${capitalizeFirst(data.style)} | 
            <strong>Model:</strong> ${data.model} | 
            <strong>Tokens used:</strong> ${data.tokens_used}
        `;
  } catch (error) {
    showError(error.message);
  } finally {
    summarizeBtn.disabled = false;
  }
}

// Handle Clear
function handleClear() {
  textInput.value = "";
  fileInput.value = "";
  fileName.textContent = "";
  currentSummary = "";
  updateTextStats();
  hideAllStates();
  showEmptyState();

  // Reset to brief style
  styleButtons.forEach((btn) => btn.classList.remove("active"));
  styleButtons[0].classList.add("active");
  currentStyle = "brief";
}

// Handle Copy
async function handleCopy() {
  try {
    await navigator.clipboard.writeText(currentSummary);

    // Show feedback
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = '<span class="btn-icon">✓</span> Copied!';
    copyBtn.style.background = "#22c55e";

    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
      copyBtn.style.background = "";
    }, 2000);
  } catch (error) {
    showError(
      "Failed to copy to clipboard. Please try selecting and copying manually."
    );
  }
}

// Handle Download
function handleDownload() {
  try {
    const blob = new Blob([currentSummary], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary_${currentStyle}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show feedback
    const originalHTML = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span class="btn-icon">✓</span> Downloaded!';
    downloadBtn.style.background = "#22c55e";

    setTimeout(() => {
      downloadBtn.innerHTML = originalHTML;
      downloadBtn.style.background = "";
    }, 2000);
  } catch (error) {
    showError("Failed to download summary.");
  }
}

// Show Error
function showError(message) {
  hideAllStates();
  errorText.textContent = message;
  errorState.classList.remove("hidden");
}

// Hide All States
function hideAllStates() {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  successState.classList.add("hidden");
  emptyState.classList.add("hidden");
}

// Show Empty State
function showEmptyState() {
  emptyState.classList.remove("hidden");
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

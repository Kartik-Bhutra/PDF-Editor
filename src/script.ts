import { loadPDF } from "./scripts/render";
import { initEventListeners } from "./scripts/ui";
import { removePdfDoc } from "./scripts/state";

const uploadBtn = document.getElementById("upload-btn") as HTMLButtonElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const uploadZone = document.getElementById("upload-zone") as HTMLDivElement;
const uploadPage = document.getElementById("upload-page") as HTMLDivElement;
const pdfEditor = document.getElementById("pdf-editor") as HTMLDivElement;
const sidebar = document.getElementById("sidebar") as HTMLElement;
const toolbarHeader = document.querySelector(".toolbar-header") as HTMLElement;
const bottomToolbar = document.getElementById("bottom-toolbar") as HTMLElement;
const loadNewBtn = document.getElementById("load-new-btn") as HTMLButtonElement;
const confirmModal = document.getElementById("confirm-modal") as HTMLDivElement;
const confirmYes = document.getElementById("confirm-yes") as HTMLButtonElement;
const confirmNo = document.getElementById("confirm-no") as HTMLButtonElement;
const currentFileEl = document.getElementById("current-file") as HTMLElement;

function updateFileName(file: File) {
  currentFileEl.textContent = file.name;
  currentFileEl.classList.remove("hidden");
}

const showUploadView = () => {
  toolbarHeader.style.display = "none";
  pdfEditor.style.display = "none";
  sidebar.style.display = "none";
  bottomToolbar.style.display = "none";
  uploadPage.style.display = "flex";
};

const showEditorView = () => {
  uploadPage.style.display = "none";
  toolbarHeader.style.display = "flex";
  pdfEditor.style.display = "flex";
  sidebar.style.display = "block";
  bottomToolbar.style.display = "flex";
};

const handleFileSelect = async (file: File | null) => {
  if (file) {
    showEditorView();
    updateFileName(file);
    await loadPDF(file);
  }
};

loadNewBtn.addEventListener("click", () => {
  confirmModal.classList.remove("hidden");
});

confirmNo.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
});

confirmYes.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  removePdfDoc();
  fileInput.value = "";
  fileInput.click();
});

if (uploadBtn && fileInput) {
  fileInput.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    handleFileSelect(file);
    target.value = "";
  });

  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });
}

if (uploadZone) {
  uploadZone.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : null;
    handleFileSelect(file);
  });

  uploadZone.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();
  });
}

showUploadView();
initEventListeners();

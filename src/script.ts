const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("file-input");
const uploadZone = document.getElementById("upload-zone");
const uploadPage = document.getElementById("upload-page");

if (uploadBtn && fileInput) {
  fileInput.addEventListener("change", async (e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (uploadPage && file) {
      uploadPage.classList.add("hidden");
    }
  });
  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });
}

if (uploadZone) {
  uploadZone.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : null;
    if (uploadPage && file) {
      uploadPage.classList.add("hidden");
    }
  });
  uploadZone.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();
  });
}

import { state, setCurrentPageNum } from "./state";
import { renderPage } from "./render";

const prevPageBtn = document.getElementById("prev-page-btn") as HTMLButtonElement;
const nextPageBtn = document.getElementById("next-page-btn") as HTMLButtonElement;
const pageNumInput = document.getElementById("page-num-input") as HTMLInputElement;
const totalPagesSpan = document.getElementById("total-pages-span") as HTMLSpanElement;
const thumbnailContainer = document.getElementById("thumbnail-container") as HTMLDivElement;
const zoomInBtn = document.getElementById("zoom-in-btn") as HTMLButtonElement;
const zoomOutBtn = document.getElementById("zoom-out-btn") as HTMLButtonElement;
const zoomLevel = document.getElementById("zoom-level") as HTMLInputElement;

const updatePageIndicator = () => {
  pageNumInput.value = state.currentPageNum.toString();
  totalPagesSpan.textContent = `/ ${state.totalPages}`;
};

const updateNavButtons = () => {
  prevPageBtn.disabled = state.currentPageNum <= 1;
  nextPageBtn.disabled = state.currentPageNum >= state.totalPages;
};

const updateActiveThumbnail = () => {
  const currentActive = thumbnailContainer.querySelector(".active");
  if (currentActive) {
    currentActive.classList.remove("active");
  }

  const newActive = thumbnailContainer.querySelector(`[data-page-num="${state.currentPageNum}"]`);
  if (newActive) {
    newActive.classList.add("active");
  }
};

export const updateUiForNewPage = () => {
  updatePageIndicator();
  updateNavButtons();
  updateActiveThumbnail();
};

const zoomPage = (zoomIn: boolean) => {
  const fixedStep = 0.1;
  const minZoom = 0.1;
  const maxZoom = 10;

  if (zoomIn) {
    state.zoomScale = Math.min(state.zoomScale + fixedStep, maxZoom);
  } else {
    state.zoomScale = Math.max(state.zoomScale - fixedStep, minZoom);
  }

  const percent = (state.zoomScale * 100).toFixed(0);
  zoomLevel.value = percent;
};

const goToPage = (newPageNum: number) => {
  setCurrentPageNum(newPageNum);
  renderPage(state.currentPageNum);
  updateUiForNewPage();
};

export const initEventListeners = () => {
  prevPageBtn.addEventListener("click", () => {
    if (state.currentPageNum > 1) {
      goToPage(state.currentPageNum - 1);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if (state.currentPageNum < state.totalPages) {
      goToPage(state.currentPageNum + 1);
    }
  });

  pageNumInput.addEventListener("change", () => {
    const newPage = parseInt(pageNumInput.value, 10);
    goToPage(newPage);
  });

  zoomLevel.addEventListener("change", () => {
    let newZoom = parseInt(zoomLevel.value, 10);
    if (isNaN(newZoom) || newZoom < 10 || newZoom > 1000) {
      newZoom = 100;
    }
    state.zoomScale = newZoom / 100;
    zoomLevel.value = newZoom.toString();
    renderPage(state.currentPageNum);
  });

  thumbnailContainer.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const thumbnailItem = target.closest(".thumbnail-item") as HTMLDivElement | null;
    if (thumbnailItem && thumbnailItem.dataset.pageNum) {
      const newPage = parseInt(thumbnailItem.dataset.pageNum, 10);
      goToPage(newPage);
    }
  });

  zoomInBtn.addEventListener("click", () => {
    zoomPage(true);
    renderPage(state.currentPageNum);
  });

  zoomOutBtn.addEventListener("click", () => {
    zoomPage(false);
    renderPage(state.currentPageNum);
  });
};

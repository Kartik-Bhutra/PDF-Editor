import { state, setCurrentPageNum } from "./state";
import { renderPage } from "./render";

const prevPageBtn = document.getElementById("prev-page-btn") as HTMLButtonElement;
const nextPageBtn = document.getElementById("next-page-btn") as HTMLButtonElement;
const pageNumInput = document.getElementById("page-num-input") as HTMLInputElement;
const totalPagesSpan = document.getElementById("total-pages-span") as HTMLSpanElement;
const thumbnailContainer = document.getElementById("thumbnail-container") as HTMLDivElement;

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

  thumbnailContainer.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const thumbnailItem = target.closest(".thumbnail-item") as HTMLDivElement | null;
    if (thumbnailItem && thumbnailItem.dataset.pageNum) {
      const newPage = parseInt(thumbnailItem.dataset.pageNum, 10);
      goToPage(newPage);
    }
  });
};

import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface AppState {
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  currentPageNum: number;
  totalPages: number;
  zoomScale: number;
}

export const state: AppState = {
  pdfDoc: null,
  currentPageNum: 1,
  totalPages: 0,
  zoomScale: 1.5,
};

export const setPdfDoc = (pdfDoc: pdfjsLib.PDFDocumentProxy) => {
  state.pdfDoc = pdfDoc;
  state.totalPages = pdfDoc.numPages;
  state.currentPageNum = 1;
};

export const setCurrentPageNum = (pageNum: number) => {
  if (state.pdfDoc && pageNum > 0 && pageNum <= state.totalPages) {
    state.currentPageNum = pageNum;
  }
};

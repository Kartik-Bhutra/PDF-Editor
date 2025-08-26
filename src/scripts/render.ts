import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { setPdfDoc, state } from "./state";
import { updateUiForNewPage } from "./ui";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const pdfCanvas = document.getElementById("pdf-canvas") as HTMLCanvasElement;
const thumbnailContainer = document.getElementById("thumbnail-container") as HTMLDivElement;

export const renderPage = async (pageNum: number) => {
  if (!state.pdfDoc || pageNum < 1 || pageNum > state.totalPages) {
    return;
  }

  const page = await state.pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: state.zoomScale });
  const context = pdfCanvas.getContext("2d")!;

  pdfCanvas.height = viewport.height;
  pdfCanvas.width = viewport.width;

  await page.render({ canvasContext: context, canvas: pdfCanvas, viewport }).promise;
};

const renderThumbnails = async () => {
  if (!state.pdfDoc) {
    return;
  }
  thumbnailContainer.innerHTML = "";

  const fragment = document.createDocumentFragment();
  const renderQueue: (() => Promise<void>)[] = [];

  for (let i = 1; i <= state.totalPages; i++) {
    const page = await state.pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 0.8 });

    const thumbnailItem = document.createElement("div");
    thumbnailItem.className = "thumbnail-item";
    thumbnailItem.dataset.pageNum = i.toString();

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const pageNumText = document.createElement("p");
    pageNumText.textContent = `Page ${i}`;

    thumbnailItem.appendChild(canvas);
    thumbnailItem.appendChild(pageNumText);
    fragment.appendChild(thumbnailItem);

    renderQueue.push(() => page.render({ canvasContext: context, canvas, viewport }).promise);
  }

  thumbnailContainer.appendChild(fragment);

  await Promise.all(renderQueue.map((task) => task()));
};

export const loadPDF = async (file: File) => {
  const fileReader = new FileReader();

  fileReader.onload = async function () {
    const typedarray = new Uint8Array(this.result as ArrayBuffer);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;

    setPdfDoc(pdf);
    await renderThumbnails();
    await renderPage(1);
    updateUiForNewPage();
  };

  fileReader.readAsArrayBuffer(file);
};

import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Memory cache for parsed PDF document promises to prevent re-parsing buffer
let cachedBuffer = null;
let cachedPdfPromise = null;
const pageImageCache = new Map();

/**
 * Gets or creates the cached PDF document from the ArrayBuffer.
 */
function getPdfDocument(buffer) {
  if (!buffer || buffer.byteLength === 0) {
    throw new Error('PDF buffer is empty or detached.');
  }
  if (cachedBuffer === buffer && cachedPdfPromise) {
    return cachedPdfPromise;
  }
  cachedBuffer = buffer;
  pageImageCache.clear();
  const typedarray = new Uint8Array(buffer.slice(0));
  const loadingTask = pdfjsLib.getDocument({ data: typedarray });
  cachedPdfPromise = loadingTask.promise.catch((err) => {
    cachedBuffer = null;
    cachedPdfPromise = null;
    throw err;
  });
  return cachedPdfPromise;
}

/**
 * Renders thumbnail of a specific page to an HTML Canvas with caching.
 * @param {ArrayBuffer} buffer 
 * @param {number} pageNum 1-based page number
 * @param {HTMLCanvasElement} canvas 
 * @param {number} targetWidth 
 * @returns {Promise<void>}
 */
export async function renderPageThumbnail(buffer, pageNum, canvas, targetWidth = 260) {
  if (!canvas || !buffer || !pageNum) return;

  const cacheKey = `${pageNum}_${targetWidth}`;
  const ctx = canvas.getContext('2d');

  // Check if we have an in-memory cached image bitmap or data url
  if (pageImageCache.has(cacheKey)) {
    const cachedImg = pageImageCache.get(cacheKey);
    canvas.width = cachedImg.width;
    canvas.height = cachedImg.height;
    canvas.style.width = cachedImg.cssWidth;
    canvas.style.height = cachedImg.cssHeight;
    ctx.drawImage(cachedImg.bitmap, 0, 0);
    return;
  }

  try {
    const pdf = await getPdfDocument(buffer);
    const page = await pdf.getPage(pageNum);

    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const scale = targetWidth / unscaledViewport.width;
    const viewport = page.getViewport({ scale });

    const outputScale = window.devicePixelRatio || 1;
    const canvasWidth = Math.floor(viewport.width * outputScale);
    const canvasHeight = Math.floor(viewport.height * outputScale);
    const cssWidth = Math.floor(viewport.width) + 'px';
    const cssHeight = Math.floor(viewport.height) + 'px';

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = cssWidth;
    canvas.style.height = cssHeight;

    ctx.scale(outputScale, outputScale);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Cache the rendered bitmap for instantaneous re-display
    if (window.createImageBitmap) {
      createImageBitmap(canvas).then((bitmap) => {
        pageImageCache.set(cacheKey, {
          bitmap,
          width: canvasWidth,
          height: canvasHeight,
          cssWidth,
          cssHeight,
        });
      }).catch(() => {});
    }
  } catch (err) {
    console.warn(`Could not render thumbnail for page ${pageNum}:`, err);
    throw err;
  }
}

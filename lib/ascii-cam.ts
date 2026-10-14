/**
 * ASCII Cam engine: webcam (or an uploaded photo / video) to coloured ASCII,
 * in the browser. With `person` on, a MediaPipe selfie-segmentation model finds
 * the person in each frame; only they become characters and the room behind
 * stays as real video.
 *
 * Plain TypeScript with no React, so the render loop never re-renders a
 * component. The UI talks to it through `createAsciiCam` and the callbacks.
 */

export type AsciiOptions = {
  cols: number;
  contrast: number;
  ramp: string;
  color: boolean;
  edges: boolean;
  invert: boolean;
  person: boolean;
};

export const RAMPS = [
  { label: "Classic", value: " .,:;i1tfLCG08@" },
  { label: "Simple", value: " .:-=+*#%@" },
  { label: "Blocks", value: " ░▒▓█" },
  { label: "Binary", value: " 01" },
  { label: "Dots", value: " .·•●" },
] as const;

export const DEFAULT_OPTIONS: AsciiOptions = {
  cols: 120,
  contrast: 1.3,
  ramp: RAMPS[0].value,
  color: true,
  edges: false,
  invert: false,
  person: true,
};

type Callbacks = {
  onStats: (text: string) => void;
  onModel: (text: string) => void;
  onError: (text: string) => void;
  onRunning: (running: boolean) => void;
};

type Mask = { data: Float32Array; w: number; h: number; mirrored: boolean };
type ConfidenceMask = { getAsFloat32Array(): Float32Array; width: number; height: number };
type Segmenter = {
  segmentForVideo(
    src: HTMLCanvasElement,
    timestamp: number,
    callback: (result: { confidenceMasks?: ConfidenceMask[] }) => void,
  ): void;
  close(): void;
};

const MP = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
const MODEL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";
const CHAR_ASPECT = 0.55; // a monospace cell is roughly twice as tall as it is wide
const SEG_EVERY_MS = 66; // run the model ~15 times a second; the grid redraws every frame
const SCREEN = "#050a14";
const INK = "#e2e8f0";

// Loaded from the CDN at runtime, outside the bundler.
const importFromUrl = new Function("url", "return import(url)") as (
  url: string,
) => Promise<{
  FilesetResolver: { forVisionTasks(path: string): Promise<unknown> };
  ImageSegmenter: { createFromOptions(files: unknown, options: object): Promise<Segmenter> };
}>;

export function createAsciiCam(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  getOptions: () => AsciiOptions,
  cb: Callbacks,
) {
  const ctx = canvas.getContext("2d")!;
  const sample = document.createElement("canvas");
  const sctx = sample.getContext("2d", { willReadFrequently: true })!;
  const segCv = document.createElement("canvas");
  const segCtx = segCv.getContext("2d")!;
  const maskCv = document.createElement("canvas");
  const mctx = maskCv.getContext("2d")!;
  const font = getComputedStyle(canvas).fontFamily || "monospace";

  let stream: MediaStream | null = null;
  let image: HTMLImageElement | null = null;
  let objectUrl: string | null = null;
  let running = false;
  let frozen = false;
  let raf = 0;
  let rows = 0;
  let lines: string[] = [];
  let frames = 0;
  let lastStats = performance.now();
  let seg: Segmenter | null = null;
  let segLoading: Promise<void> | null = null;
  let segT = 0;
  let lastMask: Mask | null = null;
  let lastSegAt = 0;

  // ---------------------------------------------------------------- model --
  function loadModel() {
    if (segLoading) return segLoading;
    cb.onModel("loading person model");
    segLoading = (async () => {
      const { FilesetResolver, ImageSegmenter } = await importFromUrl(`${MP}/vision_bundle.mjs`);
      const files = await FilesetResolver.forVisionTasks(`${MP}/wasm`);
      const make = (delegate: "CPU" | "GPU") =>
        ImageSegmenter.createFromOptions(files, {
          baseOptions: { modelAssetPath: MODEL, delegate },
          runningMode: "VIDEO",
          outputConfidenceMasks: true,
          outputCategoryMask: false,
        });
      // CPU (XNNPACK) beats GPU here: the model is tiny and reading the mask back from the GPU stalls.
      try {
        seg = await make("CPU");
      } catch {
        seg = await make("GPU");
      }
      cb.onModel("");
    })().catch(() => {
      segLoading = null;
      cb.onModel("person model unavailable, showing the full frame");
    });
    return segLoading;
  }

  // Runs the model on a small copy of the frame, mirrored exactly like the
  // character grid, so mask pixel (u, v) lines up with grid cell (u, v).
  function personMask(src: CanvasImageSource, sw: number, sh: number): Mask | null {
    if (!getOptions().person || !seg) return null;
    const mirrored = !image;
    const now = performance.now();
    if (lastMask && lastMask.mirrored === mirrored && now - lastSegAt < SEG_EVERY_MS) return lastMask;
    const mw = 256;
    const mh = Math.max(16, Math.round((256 * sh) / sw));
    if (segCv.width !== mw || segCv.height !== mh) {
      segCv.width = mw;
      segCv.height = mh;
    }
    segCtx.save();
    if (mirrored) {
      segCtx.translate(mw, 0);
      segCtx.scale(-1, 1);
    }
    segCtx.drawImage(src, 0, 0, mw, mh);
    segCtx.restore();
    let mask: Mask | null = null;
    segT = Math.max(segT + 1, now); // timestamps must keep increasing
    try {
      seg.segmentForVideo(segCv, segT, (r) => {
        const m = r.confidenceMasks?.[0];
        if (m) mask = { data: m.getAsFloat32Array().slice(), w: m.width, h: m.height, mirrored };
      });
    } catch {
      return lastMask;
    }
    if (mask) {
      lastMask = mask;
      lastSegAt = now;
    }
    return mask ?? lastMask;
  }

  // -------------------------------------------------------------- sources --
  async function startCamera() {
    cleanupSource();
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      video.srcObject = stream;
      await video.play();
      begin();
    } catch (e) {
      const name = (e as DOMException)?.name;
      cb.onError(
        name === "NotAllowedError"
          ? "Camera access was blocked. Allow the camera in your browser's address bar, or try a photo or video instead."
          : `No camera available (${name ?? "error"}). You can still try a photo or video.`,
      );
    }
  }

  function startFile(file: File) {
    cleanupSource();
    objectUrl = URL.createObjectURL(file);
    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => {
        image = img;
        begin();
      };
      img.src = objectUrl;
    } else {
      video.srcObject = null;
      video.src = objectUrl;
      video.loop = true;
      video.play().then(begin, () => cb.onError("This video could not be played."));
    }
  }

  function cleanupSource() {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    image = null;
    lastMask = null;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }

  function begin() {
    running = true;
    frozen = false;
    cb.onRunning(true);
    if (getOptions().person) loadModel();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    video.pause();
    cleanupSource();
    cb.onRunning(false);
    cb.onStats("idle");
  }

  // --------------------------------------------------------------- render --
  function tick() {
    if (!running) return;
    if (!frozen) draw();
    frames++;
    const now = performance.now();
    if (now - lastStats > 500) {
      const fps = Math.round((frames * 1000) / (now - lastStats));
      cb.onStats(`${frozen ? "frozen · " : ""}${fps} fps · ${getOptions().cols}×${rows}`);
      frames = 0;
      lastStats = now;
    }
    raf = requestAnimationFrame(tick);
  }

  function draw() {
    const o = getOptions();
    const src: HTMLImageElement | HTMLVideoElement = image ?? video;
    const sw = image ? image.naturalWidth : video.videoWidth;
    const sh = image ? image.naturalHeight : video.videoHeight;
    if (!sw || !sh) return;
    const cols = o.cols;
    rows = Math.max(10, Math.round(cols * (sh / sw) * CHAR_ASPECT));
    sample.width = cols;
    sample.height = rows;
    sctx.save();
    if (!image) {
      sctx.translate(cols, 0); // mirror the webcam like a selfie
      sctx.scale(-1, 1);
    }
    sctx.drawImage(src, 0, 0, cols, rows);
    sctx.restore();
    const px = sctx.getImageData(0, 0, cols, rows).data;

    const lum = new Float32Array(cols * rows);
    for (let i = 0, j = 0; i < lum.length; i++, j += 4) {
      let l = (0.2126 * px[j] + 0.7152 * px[j + 1] + 0.0722 * px[j + 2]) / 255;
      l = (l - 0.5) * o.contrast + 0.5;
      lum[i] = l < 0 ? 0 : l > 1 ? 1 : l;
    }

    let conf: Float32Array | null = null;
    const mask = personMask(src, sw, sh);
    if (mask) {
      conf = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) {
        const my = Math.min(mask.h - 1, (((y + 0.5) / rows) * mask.h) | 0);
        for (let x = 0; x < cols; x++) {
          const mx = Math.min(mask.w - 1, (((x + 0.5) / cols) * mask.w) | 0);
          conf[y * cols + x] = mask.data[my * mask.w + mx];
        }
      }
      stretchInside(lum, conf);
    }
    const field = o.edges ? sobel(lum, cols, rows) : lum;

    const ramp = o.ramp;
    const n = ramp.length - 1;
    lines = new Array(rows);
    for (let y = 0; y < rows; y++) {
      let s = "";
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        let v = field[i];
        if (o.invert) v = 1 - v;
        if (conf) {
          const c = conf[i];
          if (c < 0.35) {
            s += " "; // background
            continue;
          }
          if (c < 0.65) v *= (c - 0.35) / 0.3; // soft edge around the silhouette
          s += ramp[Math.max(1, Math.round(v * n))]; // every person cell gets a glyph
        } else {
          s += ramp[Math.max(0, Math.round(v * n))];
        }
      }
      lines[y] = s;
    }
    paint(src, sw, sh, px, cols, o, o.person ? mask : null);
  }

  /** Auto-levels from the person's cells only, so the face uses the whole character range. */
  function stretchInside(l: Float32Array, conf: Float32Array) {
    const hist = new Uint32Array(64);
    let total = 0;
    for (let i = 0; i < l.length; i++)
      if (conf[i] > 0.5) {
        hist[Math.min(63, (l[i] * 64) | 0)]++;
        total++;
      }
    if (total < 30) return;
    let lo = 0;
    let hi = 63;
    let acc = 0;
    for (; lo < 63; lo++) if ((acc += hist[lo]) > total * 0.03) break;
    acc = 0;
    for (; hi > 0; hi--) if ((acc += hist[hi]) > total * 0.03) break;
    const a = lo / 64;
    const span = Math.max(0.05, (hi + 1) / 64 - a);
    for (let i = 0; i < l.length; i++) {
      const v = (l[i] - a) / span;
      l[i] = v < 0 ? 0 : v > 1 ? 1 : v;
    }
  }

  function sobel(l: Float32Array, w: number, h: number) {
    const o = new Float32Array(w * h);
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const gx = -l[i - w - 1] - 2 * l[i - 1] - l[i + w - 1] + l[i - w + 1] + 2 * l[i + 1] + l[i + w + 1];
        const gy = -l[i - w - 1] - 2 * l[i - w] - l[i - w + 1] + l[i + w - 1] + 2 * l[i + w] + l[i + w + 1];
        const m = Math.hypot(gx, gy);
        o[i] = m < 0.25 ? 0 : Math.min(1, (m - 0.25) * 1.2); // keep outlines, drop weak gradients
      }
    return o;
  }

  function paint(
    src: HTMLImageElement | HTMLVideoElement,
    sw: number,
    sh: number,
    px: Uint8ClampedArray,
    cols: number,
    o: AsciiOptions,
    mask: Mask | null,
  ) {
    const stage = canvas.parentElement!;
    const W0 = stage.clientWidth;
    const H0 = stage.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    let W = W0;
    let H = (W0 * sh) / sw;
    if (H > H0) {
      H = H0;
      W = (H0 * sw) / sh;
    }
    const pw = Math.round(W * dpr);
    const ph = Math.round(H * dpr);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (o.person) {
      // real frame as the backdrop
      ctx.save();
      if (!image) {
        ctx.translate(W, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(src, 0, 0, W, H);
      ctx.restore();
      if (!mask) return; // model still loading: plain video for now
      // dark silhouette under the glyphs, feathered by the mask's confidence
      if (maskCv.width !== mask.w || maskCv.height !== mask.h) {
        maskCv.width = mask.w;
        maskCv.height = mask.h;
      }
      const img = mctx.createImageData(mask.w, mask.h);
      const d = img.data;
      for (let i = 0; i < mask.data.length; i++) {
        const c = mask.data[i];
        const a = c < 0.3 ? 0 : c > 0.7 ? 1 : (c - 0.3) / 0.4;
        d[i * 4] = 5;
        d[i * 4 + 1] = 10;
        d[i * 4 + 2] = 20;
        d[i * 4 + 3] = a * 240;
      }
      mctx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(maskCv, 0, 0, W, H);
    } else {
      ctx.fillStyle = SCREEN;
      ctx.fillRect(0, 0, W, H);
    }

    const cw = W / cols;
    const ch = H / rows;
    ctx.font = `${Math.min(ch, cw / 0.6)}px ${font}`;
    ctx.textBaseline = "top";
    for (let y = 0; y < rows; y++) {
      const line = lines[y];
      for (let x = 0; x < cols; x++) {
        const g = line[x];
        if (g === " ") continue;
        if (o.color) {
          const j = (y * cols + x) * 4;
          // floor at 80 keeps dark hair and clothes readable on the dark silhouette
          ctx.fillStyle = `rgb(${(80 + px[j] * 0.69) | 0},${(80 + px[j + 1] * 0.69) | 0},${(80 + px[j + 2] * 0.69) | 0})`;
        } else ctx.fillStyle = INK;
        ctx.fillText(g, x * cw, y * ch);
      }
    }
  }

  return {
    startCamera,
    startFile,
    stop,
    loadModel,
    toggleFreeze() {
      if (running) frozen = !frozen;
      return frozen;
    },
    text: () => lines.join("\n"),
    png: () => canvas.toDataURL("image/png"),
    destroy() {
      stop();
      seg?.close();
      seg = null;
    },
  };
}

export type AsciiCam = ReturnType<typeof createAsciiCam>;

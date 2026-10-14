"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Copy, ImageDown, Pause, Play, Square, Upload, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import {
  createAsciiCam,
  DEFAULT_OPTIONS,
  RAMPS,
  type AsciiCam as Engine,
  type AsciiOptions,
} from "@/lib/ascii-cam";
import { mascotReact } from "@/lib/mascot";

const toggles: { key: "person" | "color" | "edges" | "invert"; label: string }[] = [
  { key: "person", label: "ASCII only on people" },
  { key: "color", label: "Colour" },
  { key: "edges", label: "Edges" },
  { key: "invert", label: "Invert" },
];

export function AsciiCam() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [opts, setOpts] = useState<AsciiOptions>(DEFAULT_OPTIONS);
  const optsRef = useRef(opts);
  const [running, setRunning] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [stats, setStats] = useState("idle");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    optsRef.current = opts;
  }, [opts]);

  useEffect(() => {
    const engine = createAsciiCam(canvasRef.current!, videoRef.current!, () => optsRef.current, {
      onStats: setStats,
      onModel: setModel,
      onError: setError,
      onRunning: (r) => {
        setRunning(r);
        if (r) setError("");
      },
    });
    engineRef.current = engine;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.target !== document.body) return;
      e.preventDefault();
      setFrozen(engine.toggleFreeze());
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      engine.destroy();
    };
  }, []);

  const set = <K extends keyof AsciiOptions>(key: K, value: AsciiOptions[K]) => {
    setOpts((o) => ({ ...o, [key]: value }));
    if (key === "person" && value) engineRef.current?.loadModel();
  };

  const command =
    `ascii-cam --cols ${opts.cols}` +
    (opts.color ? " --color" : "") +
    (opts.person ? " --person" : "") +
    (opts.edges ? " --edges" : "") +
    (opts.invert ? " --invert" : "");

  async function copyText() {
    try {
      await navigator.clipboard.writeText(engineRef.current?.text() ?? "");
      toast.success("ASCII copied to clipboard");
    } catch {
      toast.error("Could not copy. Your browser blocked clipboard access.");
    }
  }

  function toggleFreeze() {
    setFrozen(engineRef.current?.toggleFreeze() ?? false);
  }

  function stopCam() {
    engineRef.current?.stop();
    setFrozen(false);
  }

  function savePng() {
    const url = engineRef.current?.png();
    if (!url) return;
    const a = document.createElement("a");
    a.download = "ascii-cam.png";
    a.href = url;
    a.click();
    mascotReact("delighted", 900);
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">lab</p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">ASCII Cam</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Turn on your camera and you become characters, coloured from the video, while the room
        behind you stays as it is. A person-segmentation model runs on your device, so nothing
        you film leaves the browser.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
        <div className="flex items-center gap-3 border-b border-border px-4 py-2.5 font-mono text-xs">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="min-w-0 truncate">
            <span className="font-semibold text-orange-400">ryan@huy</span>
            <span className="text-muted-foreground">:~$ </span>
            <span className="text-accent">{command}</span>
          </span>
          <span className="ml-auto shrink-0 tabular-nums text-muted-foreground">
            {model || stats}
          </span>
        </div>

        <div className="relative grid aspect-[16/10] w-full place-items-center overflow-hidden bg-[#050a14]">
          <canvas ref={canvasRef} className="max-h-full max-w-full font-mono" />
          {!running ? (
            <div className="absolute inset-0 grid place-items-center bg-[#050a14] p-6 text-center">
              <div className="max-w-md">
                <p className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
                  you, in <span className="text-sky-400">ASCII</span>
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  Sit facing a window or a lamp. Even light on your face gives the cleanest
                  characters.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => engineRef.current?.startCamera()}
                    className="inline-flex items-center gap-2 rounded-md bg-sky-400 px-4 py-2 text-sm font-semibold text-[#0b1220] transition hover:bg-sky-300"
                  >
                    <Camera className="size-4" /> Turn on camera
                  </button>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400"
                  >
                    <Upload className="size-4" /> Try a photo or video
                  </button>
                </div>
                {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) engineRef.current?.startFile(f);
          e.target.value = "";
        }}
      />
      <video ref={videoRef} playsInline muted className="hidden" />

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          {toggles.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={opts[t.key]}
              onClick={() => set(t.key, !opts[t.key])}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                opts[t.key]
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-muted-foreground">
          Detail
          <input
            type="range"
            min={50}
            max={200}
            value={opts.cols}
            onChange={(e) => set("cols", Number(e.target.value))}
            className="w-28 accent-sky-400"
          />
          <span className="w-8 font-mono text-xs tabular-nums text-foreground">{opts.cols}</span>
        </label>
        <label className="flex items-center gap-2 text-muted-foreground">
          Contrast
          <input
            type="range"
            min={50}
            max={250}
            value={Math.round(opts.contrast * 100)}
            onChange={(e) => set("contrast", Number(e.target.value) / 100)}
            className="w-28 accent-sky-400"
          />
          <span className="w-8 font-mono text-xs tabular-nums text-foreground">
            {opts.contrast.toFixed(1)}
          </span>
        </label>
        <label className="flex items-center gap-2 text-muted-foreground">
          Charset
          <select
            value={opts.ramp}
            onChange={(e) => set("ramp", e.target.value)}
            className="rounded-md border border-border bg-card px-2 py-1 text-foreground"
          >
            {RAMPS.map((r) => (
              <option key={r.label} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton disabled={!running} onClick={toggleFreeze} icon={frozen ? Play : Pause}>
          {frozen ? "Resume" : "Freeze"}
        </ActionButton>
        <ActionButton disabled={!running} onClick={copyText} icon={Copy}>
          Copy text
        </ActionButton>
        <ActionButton disabled={!running} onClick={savePng} icon={ImageDown}>
          Save PNG
        </ActionButton>
        <ActionButton disabled={!running} onClick={stopCam} icon={Square}>
          Stop
        </ActionButton>
      </div>

      <div className="mt-10 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
        <p>
          <span className="font-mono text-xs text-accent">segment</span>
          <br />
          Google&apos;s MediaPipe selfie segmenter marks which pixels are you, about 15 times a
          second, on the CPU.
        </p>
        <p>
          <span className="font-mono text-xs text-accent">grid</span>
          <br />
          Each frame shrinks to a grid of cells. Brightness inside your outline is re-levelled so
          your face uses the full character range.
        </p>
        <p>
          <span className="font-mono text-xs text-accent">glyph</span>
          <br />
          Each cell&apos;s brightness picks a character from{" "}
          <code className="font-mono text-foreground">{" .,:;i1tfLCG08@"}</code> and its colour
          comes from the pixel underneath.
        </p>
      </div>
      <p className="mt-6 font-mono text-xs text-muted-foreground">
        Tip: press <kbd className="rounded border border-border px-1">space</kbd> to freeze a frame.
      </p>
    </section>
  );
}

function ActionButton({
  disabled,
  onClick,
  icon: Icon,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition enabled:hover:border-accent/50 enabled:hover:text-foreground disabled:opacity-40"
    >
      <Icon className="size-3.5" /> {children}
    </button>
  );
}

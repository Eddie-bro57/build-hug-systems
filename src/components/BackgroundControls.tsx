import { useEffect, useRef, useState } from "react";
import { Sliders, X, RotateCcw } from "lucide-react";

const STORAGE_KEY = "doguide.bg.controls.v1";
const DEFAULTS = { glow: 100, orbs: 100 };

type Settings = { glow: number; orbs: number };

function load(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const v = JSON.parse(raw) as Partial<Settings>;
    return {
      glow: typeof v.glow === "number" ? v.glow : DEFAULTS.glow,
      orbs: typeof v.orbs === "number" ? v.orbs : DEFAULTS.orbs,
    };
  } catch {
    return DEFAULTS;
  }
}

function apply({ glow, orbs }: Settings) {
  const root = document.documentElement;
  root.style.setProperty("--bg-glow", String(glow / 100));
  root.style.setProperty("--bg-orbs", String(orbs / 100));
}

export function BackgroundControls() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Load + apply on mount
  useEffect(() => {
    const s = load();
    setSettings(s);
    apply(s);
  }, []);

  // Persist + apply on change
  useEffect(() => {
    apply(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  // Click-outside / Esc to close
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (
        popoverRef.current && !popoverRef.current.contains(t) &&
        buttonRef.current && !buttonRef.current.contains(t)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const reset = () => setSettings(DEFAULTS);

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Background controls"
          className="card-elev mb-3 w-72 rounded-2xl p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Background</div>
            <div className="flex items-center gap-1">
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                aria-label="Reset to defaults"
                type="button"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                aria-label="Close"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <label className="block">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium">Glow intensity</span>
              <span className="text-muted-foreground">{settings.glow}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={settings.glow}
              onChange={(e) =>
                setSettings((s) => ({ ...s, glow: Number(e.target.value) }))
              }
              className="w-full accent-[color:var(--color-primary)]"
              aria-label="Glow intensity"
            />
          </label>

          <label className="mt-3 block">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium">Orb density</span>
              <span className="text-muted-foreground">{settings.orbs}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={settings.orbs}
              onChange={(e) =>
                setSettings((s) => ({ ...s, orbs: Number(e.target.value) }))
              }
              className="w-full accent-[color:var(--color-primary)]"
              aria-label="Orb density"
            />
          </label>

          <p className="mt-3 text-[11px] text-muted-foreground">
            Lower these for better readability. Saved on this device.
          </p>
        </div>
      )}

      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Adjust background"
        aria-expanded={open}
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/80 text-foreground shadow-md backdrop-blur transition hover:bg-white"
      >
        <Sliders className="h-5 w-5" />
      </button>
    </div>
  );
}

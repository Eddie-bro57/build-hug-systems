import { Link } from "@tanstack/react-router";
import { Compass, Heart } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Compass className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold tracking-tight">DoGuide</div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Learn anything, step by step
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground md:gap-6">
          <Link to="/" className="hidden hover:text-foreground md:inline">Home</Link>
          <a href="/#categories" className="hidden hover:text-foreground md:inline">Categories</a>
          <a href="/#how" className="hidden hover:text-foreground md:inline">How it works</a>
          <Link
            to="/saved"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/70 px-3 py-1.5 text-foreground hover:bg-white"
          >
            <Heart className="h-4 w-4 text-rose-500" /> Saved
          </Link>
        </nav>
      </div>
    </header>
  );
}

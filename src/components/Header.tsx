import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

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
        <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <a href="#categories" className="hover:text-foreground">Categories</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
        </nav>
      </div>
    </header>
  );
}

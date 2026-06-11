import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Bookmark, User } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { to: "/search", label: "Search", icon: Search, match: (p: string) => p.startsWith("/search") },
  { to: "/profile", label: "Saved", icon: Bookmark, match: (p: string) => p.startsWith("/profile") },
  { to: "/profile", label: "Profile", icon: User, match: () => false },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/90 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-6xl items-stretch justify-around">
        {tabs.slice(0, 3).map((t) => {
          const Icon = t.icon;
          const active = t.match(pathname);
          return (
            <li key={t.label} className="flex-1">
              <Link
                to={t.to}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

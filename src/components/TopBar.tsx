import { Link, useNavigate } from "@tanstack/react-router";
import { Compass, LogOut, Sparkles, Zap } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { QuickFixDialog } from "@/components/QuickFixDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar({ showSearch = true }: { showSearch?: boolean }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signin");
  const [quickOpen, setQuickOpen] = useState(false);
  const [q, setQ] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    navigate({ to: "/search", search: { q: v } });
  };

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Account";

  return (
    <>
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:gap-4 md:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Compass className="h-5 w-5" />
            </div>
            <div className="hidden leading-tight sm:block">
              <div className="text-base font-bold tracking-tight">DoGuide</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Learn anything
              </div>
            </div>
          </Link>

          {showSearch && (
            <form onSubmit={onSubmit} className="flex flex-1 items-center">
              <div className="flex w-full items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search any task…"
                  className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </div>
            </form>
          )}

          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            title="QuickFix: 30-second answer"
          >
            <Zap className="h-3.5 w-3.5" /> QuickFix
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                  aria-label="Account menu"
                >
                  {displayName.charAt(0).toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">My profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => {
                  setAuthMode("signin");
                  setAuthOpen(true);
                }}
              >
                Sign in
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setAuthMode("signup");
                  setAuthOpen(true);
                }}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} />
      <QuickFixDialog open={quickOpen} onOpenChange={setQuickOpen} />
    </>
  );
}

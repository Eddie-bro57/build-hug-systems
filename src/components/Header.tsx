import { Link } from "@tanstack/react-router";
import { Compass, Heart, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signin");

  const openAuth = (mode: "signup" | "signin") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Account";

  return (
    <>
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
          <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground md:gap-4">
            <Link to="/" className="hidden hover:text-foreground md:inline">Home</Link>
            <a href="/#categories" className="hidden hover:text-foreground md:inline">Categories</a>
            <a href="/#how" className="hidden hover:text-foreground md:inline">How it works</a>
            <Link
              to="/saved"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/70 px-3 py-1.5 text-foreground hover:bg-white"
            >
              <Heart className="h-4 w-4 text-rose-500" /> Saved
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-2.5 py-1.5 text-foreground hover:bg-white"
                    aria-label="Account menu"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden max-w-[120px] truncate md:inline">{displayName}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/saved" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" /> Saved guides
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void signOut()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={() => openAuth("signin")}
                >
                  Sign in
                </Button>
                <Button size="sm" onClick={() => openAuth("signup")}>
                  <UserIcon className="mr-1.5 h-4 w-4" /> Sign up
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} />
    </>
  );
}

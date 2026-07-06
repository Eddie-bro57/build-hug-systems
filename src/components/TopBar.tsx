import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Search, Zap, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { QuickFixDialog } from "@/components/QuickFixDialog";
import { VoiceSearchButton } from "@/components/VoiceSearchButton";
import { XpHud } from "@/components/XpHud";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function TopBar({ showSearch = true }: { showSearch?: boolean }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signin");
  const [quickOpen, setQuickOpen] = useState(false);
  const [q, setQ] = useState("");

  const qc = useQueryClient();

  const notifications = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notifications" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications" as any)
        .update({ read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications", user?.id] });
    }
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from("notifications" as any)
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications", user?.id] });
      toast.success("All notifications marked as read!");
    }
  });

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
      <header className="sticky top-0 z-40 px-4 pt-2 md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 px-4 py-3 shadow-[0_8px_32px_rgba(31,38,135,0.07)] backdrop-blur-xl md:gap-6 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src={logo}
              alt="DoGuide"
              className="h-9 w-9 rounded-xl shadow-md"
              width={36}
              height={36}
            />
            <div className="hidden leading-tight sm:block">
              <div className="text-base font-bold tracking-tight md:text-lg">DoGuide</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Learn anything
              </div>
            </div>
          </Link>

          {/* Search */}
          {showSearch && (
            <form onSubmit={onSubmit} className="flex flex-1 items-center gap-2">
              <div className="group relative flex w-full items-center rounded-2xl border-0 bg-white/50 ring-1 ring-slate-200 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-primary">
                <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground group-focus-within:text-primary" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search any task…"
                  className="flex-1 bg-transparent py-2.5 pl-2 pr-2 text-sm outline-none placeholder:text-muted-foreground"
                />
                <VoiceSearchButton
                  className="mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  onTranscript={(t) => {
                    setQ(t);
                    navigate({ to: "/search", search: { q: t } });
                  }}
                />
              </div>
            </form>
          )}

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2 md:gap-4">
            <XpHud />

            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setAuthMode("signin");
                  setAuthOpen(true);
                } else {
                  setQuickOpen(true);
                }
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-white px-2.5 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted"
              title="QuickFix: 30-second answer"
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" />{" "}
              <span className="hidden sm:inline">QuickFix</span>
            </button>

            {/* Notification Bell */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-white text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer shadow-sm"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {notifications.data && notifications.data.filter((n: any) => !n.read).length > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                        {notifications.data.filter((n: any) => !n.read).length}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-2xl border border-border/80 bg-white/95 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-border/60 bg-slate-50/50 px-4 py-3">
                    <span className="text-sm font-bold text-slate-800">Notifications</span>
                    {notifications.data && notifications.data.some((n: any) => !n.read) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllAsRead.mutate();
                        }}
                        disabled={markAllAsRead.isPending}
                        className="text-xs font-semibold text-primary hover:underline cursor-pointer disabled:opacity-60"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-border/40">
                    {notifications.isLoading ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-xs">Loading notifications...</span>
                      </div>
                    ) : !notifications.data || notifications.data.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-muted-foreground">
                        <span className="text-2xl mb-1">🎉</span>
                        <p className="text-xs font-semibold text-slate-700">All caught up!</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">No new notifications right now.</p>
                      </div>
                    ) : (
                      notifications.data.map((item: any) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (!item.read) {
                              markAsRead.mutate(item.id);
                            }
                            if (item.link) {
                              navigate({ to: item.link });
                            }
                          }}
                          className={`group flex items-start gap-2.5 px-4 py-3.5 text-left cursor-pointer transition-colors ${
                            item.read ? "bg-white hover:bg-slate-50/50" : "bg-primary/5 hover:bg-primary/10"
                          }`}
                        >
                          <div className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary transition-opacity opacity-0 group-hover:opacity-100" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <p className={`text-xs font-bold text-slate-800 leading-tight ${item.read ? "" : "text-primary"}`}>
                                {item.title}
                              </p>
                              {!item.read && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed break-words">
                              {item.body}
                            </p>
                            <span className="block text-[9px] text-muted-foreground/60 mt-1 font-medium">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="hidden h-6 w-px bg-border md:block" />

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
                    <Link to="/profile" className="cursor-pointer">
                      My profile
                    </Link>
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
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} />
      <QuickFixDialog open={quickOpen} onOpenChange={setQuickOpen} />
    </>
  );
}

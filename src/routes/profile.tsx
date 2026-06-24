import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Bookmark, CheckCircle2, Flame, Loader2, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { xpToNextLevel } from "@/lib/gamification";
import { AuthModal } from "@/components/AuthModal";
import { UnauthenticatedBlock } from "@/components/UnauthenticatedBlock";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "My profile — DoGuide" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const qc = useQueryClient();

  const profile = useQuery({
    queryKey: ["my-profile", user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, handle, bio, xp, level, streak_days, reputation")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const skills = useQuery({
    queryKey: ["my-skills", user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("skill_levels")
        .select("category, xp, level")
        .eq("user_id", user!.id)
        .order("xp", { ascending: false });
      return data ?? [];
    },
  });

  const achievements = useQuery({
    queryKey: ["my-achievements", user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_achievements")
        .select("unlocked_at, achievement:achievements(code, title, description, icon)")
        .eq("user_id", user!.id)
        .order("unlocked_at", { ascending: false });
      return data ?? [];
    },
  });

  const saved = useQuery({
    queryKey: ["my-saved", user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_guides")
        .select("saved_at, guide:guides(id, title, summary, category, difficulty, time_minutes)")
        .eq("user_id", user!.id)
        .order("saved_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const progress = useQuery({
    queryKey: ["my-progress", user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guide_progress")
        .select("is_completed, completed_steps, updated_at, guide:guides(id, title, category, steps)")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Profile edit
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (profile.data) {
      setHandle(profile.data.handle ?? "");
      setBio(profile.data.bio ?? "");
      setDisplayName(profile.data.display_name ?? "");
    }
  }, [profile.data]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const cleanHandle = handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          handle: cleanHandle || null,
          bio: bio.trim() || null,
        })
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile saved");
      setEditing(false);
      qc.invalidateQueries({ queryKey: ["my-profile", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopBar />
      <section className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">My profile</h1>

        {loading ? (
          <Loader2 className="mt-6 h-5 w-5 animate-spin text-muted-foreground" />
        ) : !user ? (
          <UnauthenticatedBlock
            title="Your Learner Profile"
            description="Sign in to view your learning dashboard, track completed guides, check your active streak, and display your unlocked achievements."
            onSignIn={() => setAuthOpen(true)}
          />
        ) : !profile.data ? (
          <Loader2 className="mt-6 h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <>
            {/* Identity + XP HUD */}
            <div className="card-elev mt-5 rounded-3xl p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                  {(profile.data.display_name ?? user.email ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-bold">{profile.data.display_name ?? user.email}</div>
                  {profile.data.handle ? (
                    <Link
                      to="/creator/$handle"
                      params={{ handle: profile.data.handle }}
                      className="text-sm text-primary hover:underline"
                    >
                      @{profile.data.handle}
                    </Link>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Pick a handle to claim your creator page.
                    </p>
                  )}
                  {profile.data.bio && <p className="mt-2 text-sm">{profile.data.bio}</p>}
                  <button
                    type="button"
                    onClick={() => setEditing((v) => !v)}
                    className="mt-3 text-xs font-semibold text-primary hover:underline"
                  >
                    {editing ? "Cancel" : "Edit profile"}
                  </button>
                </div>
              </div>

              {editing && (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name"
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="handle (letters, numbers, underscore)"
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Short bio"
                    className="w-full resize-none rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    disabled={saveProfile.isPending}
                    onClick={() => saveProfile.mutate()}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {saveProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </button>
                </div>
              )}

              {/* XP bar */}
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Stat icon={<Sparkles className="h-3.5 w-3.5" />} label={`Level ${profile.data.level}`} />
                  <Stat icon={<Trophy className="h-3.5 w-3.5" />} label={`${profile.data.xp} XP`} />
                  <Stat icon={<Flame className="h-3.5 w-3.5 text-amber-600" />} label={`${profile.data.streak_days}-day streak`} />
                  <Stat icon={<Award className="h-3.5 w-3.5 text-emerald-600" />} label={`${profile.data.reputation} rep`} />
                </div>
                {(() => {
                  const { needed, nextAt } = xpToNextLevel(profile.data!.xp, profile.data!.level);
                  const prevAt = (profile.data!.level - 1) * (profile.data!.level - 1) * 50;
                  const span = Math.max(1, nextAt - prevAt);
                  const pct = Math.min(100, Math.round(((profile.data!.xp - prevAt) / span) * 100));
                  return (
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Level {profile.data!.level}</span>
                        <span>{needed} XP to level {profile.data!.level + 1}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-gradient-to-r from-primary to-amber-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Skill levels */}
            {skills.data && skills.data.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Skill levels
                </h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {skills.data.map((s) => (
                    <div key={s.category} className="card-elev rounded-2xl p-4">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.category}</div>
                      <div className="mt-1 flex items-end justify-between">
                        <span className="text-lg font-bold">Lv {s.level}</span>
                        <span className="text-xs text-muted-foreground">{s.xp} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            <div className="mt-8">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Trophy className="h-4 w-4" /> Achievements
              </h2>
              {achievements.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : achievements.data && achievements.data.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {achievements.data.map((row, i) => {
                    const ach = (row as { achievement: { title: string; description: string } | null }).achievement;
                    if (!ach) return null;
                    return (
                      <div key={i} className="card-elev rounded-2xl p-3 text-center">
                        <Trophy className="mx-auto h-6 w-6 text-amber-500" />
                        <div className="mt-1 text-sm font-semibold">{ach.title}</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{ach.description}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Finish guides, comment, and build streaks to unlock badges.
                </p>
              )}
            </div>

            {/* Saved */}
            <div className="mt-8">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Bookmark className="h-4 w-4" /> Saved guides
              </h2>
              {saved.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : saved.data && saved.data.length > 0 ? (
                <ul className="space-y-2">
                  {saved.data.map((row) => {
                    const g = row.guide as { id: string; title: string; summary: string; category: string; difficulty: string; time_minutes: number } | null;
                    if (!g) return null;
                    return (
                      <li key={g.id}>
                        <Link
                          to="/guide/$id"
                          params={{ id: g.id }}
                          className="card-elev block rounded-2xl p-4 hover:-translate-y-0.5"
                        >
                          <div className="text-xs uppercase tracking-wider text-muted-foreground">
                            {g.category} · {g.difficulty} · {g.time_minutes} min
                          </div>
                          <div className="mt-1 font-semibold">{g.title}</div>
                          <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{g.summary}</div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No saved guides yet.</p>
              )}
            </div>

            {/* Continue learning */}
            <div className="mt-8">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" /> Continue learning
              </h2>
              {progress.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : progress.data && progress.data.length > 0 ? (
                <ul className="space-y-2">
                  {progress.data.map((row) => {
                    const g = row.guide as { id: string; title: string; category: string; steps: unknown[] } | null;
                    if (!g) return null;
                    const total = Array.isArray(g.steps) ? g.steps.length : 0;
                    const doneArr = (row.completed_steps as number[]) ?? [];
                    const pct = total === 0 ? 0 : Math.round((doneArr.length / total) * 100);
                    return (
                      <li key={g.id}>
                        <Link
                          to="/guide/$id"
                          params={{ id: g.id }}
                          className="card-elev block rounded-2xl p-4 hover:-translate-y-0.5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                                {g.category}
                              </div>
                              <div className="mt-1 truncate font-semibold">{g.title}</div>
                            </div>
                            <div className="text-right text-xs font-semibold text-primary">
                              {pct}%
                            </div>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Start a guide and your progress will show up here.
                </p>
              )}
            </div>
          </>
        )}
      </section>
      <BottomNav />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode="signin" />
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 font-medium">
      {icon} {label}
    </span>
  );
}

import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, CheckCircle2, Loader2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "My profile — DoGuide" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    // Soft redirect via UI
  }

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

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopBar />
      <section className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">My profile</h1>

        {!user ? (
          <div className="card-elev mt-6 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Sign in to track progress and save guides.
            </p>
          </div>
        ) : (
          <>
            <div className="card-elev mt-5 rounded-2xl p-5">
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </div>
              <div className="mt-1 font-medium">{user.email}</div>
            </div>

            <div className="mt-6">
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
                          <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {g.summary}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No saved guides yet.</p>
              )}
            </div>

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
    </div>
  );
}

import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  Clock,
  Gauge,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Loader2,
  PlayCircle,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { GuideComments } from "@/components/GuideComments";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { troubleshoot } from "@/lib/ai.functions";
import { awardXp, checkAchievements } from "@/lib/gamification";

export const Route = createFileRoute("/guide/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    // Best-effort view counter (RLS lets unauth bump? No — skip if not authorized.)
    return { guide: data };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.guide.title} — DoGuide` },
            { name: "description", content: loaderData.guide.summary },
            { property: "og:title", content: loaderData.guide.title },
            { property: "og:description", content: loaderData.guide.summary },
          ],
        }
      : { meta: [] },
  component: GuidePage,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Guide not found.</div>
  ),
});

type Step = { title: string; detail: string };

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-rose-100 text-rose-700",
};

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const { user } = useAuth();
  const qc = useQueryClient();
  const router = useRouter();
  const [mode, setMode] = useState<"step" | "quick">("step");

  const steps = (guide.steps as Step[]) ?? [];
  const tips = (guide.tips as string[]) ?? [];
  const materials = (guide.materials as string[]) ?? [];

  // Saved
  const saved = useQuery({
    queryKey: ["saved", guide.id, user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("saved_guides")
        .select("guide_id")
        .eq("guide_id", guide.id)
        .eq("user_id", user!.id)
        .maybeSingle();
      return !!data;
    },
  });

  const toggleSave = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to save");
      if (saved.data) {
        await supabase.from("saved_guides").delete().eq("guide_id", guide.id).eq("user_id", user.id);
      } else {
        await supabase.from("saved_guides").insert({ guide_id: guide.id, user_id: user.id });
        await checkAchievements(user.id);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved", guide.id] }),
  });

  // Progress
  const progress = useQuery({
    queryKey: ["progress", guide.id, user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("guide_progress")
        .select("completed_steps, is_completed")
        .eq("guide_id", guide.id)
        .eq("user_id", user!.id)
        .maybeSingle();
      return data ?? { completed_steps: [] as number[], is_completed: false };
    },
  });

  const completed = new Set<number>(((progress.data?.completed_steps as number[]) ?? []) as number[]);

  const saveProgress = useMutation({
    mutationFn: async (next: number[]) => {
      if (!user) return { wasCompleted: false, isNowCompleted: false };
      const wasCompleted = progress.data?.is_completed ?? false;
      const isNowCompleted = next.length === steps.length && steps.length > 0;
      await supabase.from("guide_progress").upsert(
        {
          user_id: user.id,
          guide_id: guide.id,
          completed_steps: next,
          is_completed: isNowCompleted,
          completed_at: isNowCompleted ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,guide_id" },
      );
      return { wasCompleted, isNowCompleted };
    },
    onSuccess: async (result, next) => {
      qc.invalidateQueries({ queryKey: ["progress", guide.id] });
      if (!user) return;
      // award XP for newly completed step
      const prev = (progress.data?.completed_steps as number[] | undefined) ?? [];
      if (next.length > prev.length) {
        await awardXp(5, guide.category);
      }
      // bonus when guide completed for the first time
      if (result.isNowCompleted && !result.wasCompleted) {
        await awardXp(50, guide.category);
      }
      await checkAchievements(user.id);
    },
  });

  const toggleStep = (i: number) => {
    if (!user) return;
    const next = new Set(completed);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    saveProgress.mutate([...next].sort((a, b) => a - b));
  };

  const pct = steps.length === 0 ? 0 : Math.round((completed.size / steps.length) * 100);

  // Votes
  const votes = useQuery({
    queryKey: ["guide-votes", guide.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("guide_votes")
        .select("user_id", { count: "exact", head: true })
        .eq("guide_id", guide.id);
      return count ?? 0;
    },
  });

  const myVote = useQuery({
    queryKey: ["my-vote", guide.id, user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("guide_votes")
        .select("guide_id")
        .eq("guide_id", guide.id)
        .eq("user_id", user!.id)
        .maybeSingle();
      return !!data;
    },
  });

  const toggleVote = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to upvote");
      if (myVote.data) {
        await supabase.from("guide_votes").delete().eq("guide_id", guide.id).eq("user_id", user.id);
      } else {
        await supabase.from("guide_votes").insert({ guide_id: guide.id, user_id: user.id });
        await awardXp(2);
        await checkAchievements(user.id);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guide-votes", guide.id] });
      qc.invalidateQueries({ queryKey: ["my-vote", guide.id] });
    },
  });

  const videoUrl = guide.video_query
    ? `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(guide.video_query)}`
    : null;

  // Troubleshooter
  const [showTrouble, setShowTrouble] = useState(false);
  const [problem, setProblem] = useState("");
  const callTrouble = useServerFn(troubleshoot);
  const trouble = useMutation({
    mutationFn: (p: string) =>
      callTrouble({ data: { guideTitle: guide.title, problem: p } }),
  });

  useEffect(() => {
    router.invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopBar showSearch />
      <section className="mx-auto max-w-3xl px-5 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">{guide.title}</h1>
        <p className="mt-2 text-muted-foreground">{guide.summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium ${
              difficultyColor[guide.difficulty] ?? "bg-muted text-foreground"
            }`}
          >
            <Gauge className="h-3.5 w-3.5" /> {guide.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium">
            <Clock className="h-3.5 w-3.5" /> {guide.time_minutes} min
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium">
            <ListChecks className="h-3.5 w-3.5" /> {steps.length} steps
          </span>
          <span className="rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground">
            {guide.category}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Mode toggle */}
          <div className="inline-flex rounded-full border border-border bg-white p-1 text-xs font-medium">
            <button
              onClick={() => setMode("step")}
              className={`rounded-full px-3 py-1 ${mode === "step" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <BookOpen className="mr-1 inline h-3.5 w-3.5" /> Step-by-step
            </button>
            <button
              onClick={() => setMode("quick")}
              className={`rounded-full px-3 py-1 ${mode === "quick" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <Sparkles className="mr-1 inline h-3.5 w-3.5" /> Quick
            </button>
          </div>

          <button
            onClick={() => toggleSave.mutate()}
            disabled={!user || toggleSave.isPending}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60"
            title={user ? "Save guide" : "Sign in to save"}
          >
            {saved.data ? (
              <>
                <BookmarkCheck className="h-4 w-4 text-primary" /> Saved
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" /> Save
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleVote.mutate()}
            disabled={!user || toggleVote.isPending}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium disabled:opacity-60 ${
              myVote.data
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-white hover:bg-muted"
            }`}
            title={user ? "Upvote this guide" : "Sign in to upvote"}
          >
            <ThumbsUp className="h-4 w-4" /> {votes.data ?? 0}
          </button>

          <button
            onClick={() => setShowTrouble((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <HelpCircle className="h-4 w-4" /> I'm stuck
          </button>
        </div>

        {user && steps.length > 0 && (
          <div className="mt-4 rounded-xl border border-border bg-white p-3">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Progress</span>
              <span>
                {completed.size} / {steps.length} ({pct}%)
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {showTrouble && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <HelpCircle className="h-4 w-4" /> AI troubleshooter
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (problem.trim()) trouble.mutate(problem.trim());
              }}
              className="mt-2 flex gap-2"
            >
              <input
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe what went wrong…"
                className="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={trouble.isPending || !problem.trim()}
                className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {trouble.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
              </button>
            </form>
            {trouble.isError && (
              <p className="mt-2 text-xs text-destructive">{(trouble.error as Error).message}</p>
            )}
            {trouble.data && (
              <pre className="mt-3 whitespace-pre-wrap text-sm text-amber-900">{trouble.data.text}</pre>
            )}
          </div>
        )}

        {/* Quick mode */}
        {mode === "quick" ? (
          <div className="card-elev mt-6 rounded-2xl p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick version
            </h2>
            <p className="mt-2">{guide.summary}</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
              {steps.slice(0, 5).map((s, i) => (
                <li key={i}>
                  <span className="font-medium">{s.title}.</span>{" "}
                  <span className="text-muted-foreground">{s.detail.split(".")[0]}.</span>
                </li>
              ))}
            </ol>
            <button
              onClick={() => setMode("step")}
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              Show full step-by-step →
            </button>
          </div>
        ) : (
          <>
            {materials.length > 0 && (
              <div className="card-elev mt-6 rounded-2xl p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  What you'll need
                </h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {materials.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-lg font-bold tracking-tight">Steps</h2>
              <ol className="mt-3 space-y-3">
                {steps.map((s, i) => {
                  const done = completed.has(i);
                  return (
                    <li key={i} className={`card-elev rounded-2xl p-4 transition ${done ? "opacity-70" : ""}`}>
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleStep(i)}
                          disabled={!user}
                          className="mt-0.5 shrink-0"
                          aria-label={done ? "Mark step incomplete" : "Mark step complete"}
                        >
                          {done ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className={`font-semibold ${done ? "line-through" : ""}`}>
                            {i + 1}. {s.title}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
              {!user && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Sign in to track which steps you've completed.
                </p>
              )}
            </div>

            {tips.length > 0 && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-2 text-amber-800">
                  <Lightbulb className="h-4 w-4" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Tips</h2>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-amber-900">
                  {tips.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span>•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {videoUrl && (
              <div className="mt-6">
                <div className="mb-2 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold">Video guide</h2>
                </div>
                <div className="card-elev overflow-hidden rounded-2xl">
                  <div className="relative aspect-video w-full bg-black">
                    <iframe
                      src={videoUrl}
                      title={`Video guide for ${guide.title}`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <GuideComments guideId={guide.id} />
      </section>
      <BottomNav />
    </div>
  );
}

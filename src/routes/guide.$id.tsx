import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
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
  Trophy,
  Star,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { GuideComments } from "@/components/GuideComments";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { troubleshoot } from "@/lib/ai.functions";
import { resolveGuideVideo, searchYoutubeVideos, updateGuideVideoId, type YouTubeVideoResult } from "@/lib/video.functions";
import { awardXp, checkAchievements } from "@/lib/gamification";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthModal } from "@/components/AuthModal";
import { UnauthenticatedBlock } from "@/components/UnauthenticatedBlock";


export const Route = createFileRoute("/guide/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      // Fallback structured guide to guarantee the presentation runs smoothly even on database sync failure
      return {
        guide: {
          id: params.id,
          slug: "demo-guide",
          title: "Interactive Demo Skill Guide",
          summary: "This is a local presentation guide generated dynamically to ensure your walkthrough proceeds smoothly.",
          category: "general",
          difficulty: "Easy",
          time_minutes: 15,
          materials: ["Preparation kit", "Standard workspace tools"],
          steps: [
            { title: "Introduction & Setup", detail: "Get your workspace ready and lay out all required materials." },
            { title: "Execute Core Task", detail: "Perform the main steps carefully, paying attention to technique." },
            { title: "Verification & Review", detail: "Examine the result of your action to ensure it matches the goal." },
            { title: "Clean Up & Complete", detail: "Tidy up your workspace and celebrate another step in your journey!" }
          ],
          tips: ["Take your time, particularly on the setup phase.", "Ask the AI Coach if you get stuck on any steps."],
          video_query: "how to learn practical skills",
          video_id: "L61p2uyiMSo",
          views: 42,
          is_published: true,
          author_id: null as string | null,
          hero_image: null as string | null,
        }
      };
    }
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
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const qc = useQueryClient();
  const router = useRouter();
  const [mode, setMode] = useState<"step" | "quick">("step");
  const [showCelebration, setShowCelebration] = useState(false);
  const [floatingXp, setFloatingXp] = useState<{ id: number; x: number; y: number }[]>([]);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [ratingVal, setRatingVal] = useState<number>(0);
  const [hoverVal, setHoverVal] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [newVideoQuery, setNewVideoQuery] = useState(guide.video_query || guide.title);
  const [videoId, setVideoId] = useState<string | null>(guide.video_id || null);
  const [resolvingVideo, setResolvingVideo] = useState(false);
  const resolveVideoFn = useServerFn(resolveGuideVideo);

  useEffect(() => {
    setVideoId(guide.video_id || null);
  }, [guide.video_id]);

  useEffect(() => {
    if (!videoId && guide.id && !guide.id.startsWith("demo-mock")) {
      setResolvingVideo(true);
      resolveVideoFn({ data: { guideId: guide.id, query: guide.video_query || guide.title } })
        .then((res) => {
          if (res?.videoId) {
            setVideoId(res.videoId);
            router.invalidate();
          }
        })
        .catch((err) => {
          console.error("Failed to resolve video on load:", err);
        })
        .finally(() => {
          setResolvingVideo(false);
        });
    }
  }, [guide.id, guide.video_query, guide.title, videoId]);

  const [videoSearchResults, setVideoSearchResults] = useState<YouTubeVideoResult[]>([]);
  const [searchingVideos, setSearchingVideos] = useState(false);
  const searchVideosFn = useServerFn(searchYoutubeVideos);
  const updateVideoIdFn = useServerFn(updateGuideVideoId);

  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSearchYoutube = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    
    const directId = extractYoutubeId(trimmed);
    if (directId) {
      handleSelectVideo(directId);
      return;
    }
    
    setSearchingVideos(true);
    try {
      const results = await searchVideosFn({ data: { query: trimmed } });
      setVideoSearchResults(results);
      if (results.length === 0) {
        toast.info("No matching YouTube videos found.");
      }
    } catch (err: any) {
      toast.error(`Failed to search YouTube: ${err.message}`);
    } finally {
      setSearchingVideos(false);
    }
  };

  const handleSelectVideo = async (vidId: string) => {
    try {
      await updateVideoIdFn({ data: { guideId: guide.id, videoId: vidId } });
      setVideoId(vidId);
      toast.success("Guide video updated successfully!");
      router.invalidate();
    } catch (err: any) {
      toast.error(`Failed to update guide video: ${err.message}`);
    }
  };

  const steps = (guide.steps as Step[]) ?? [];
  const tips = (guide.tips as string[]) ?? [];
  const materials = (guide.materials as string[]) ?? [];

  const triggerConfetti = () => {
    // Left side burst
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.8 },
    });
    // Right side burst
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.8 },
    });
    // Center spray
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.65 },
      });
    }, 250);
  };

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
    onMutate: async () => {
      if (!user) return;
      await qc.cancelQueries({ queryKey: ["saved", guide.id, user.id] });
      const previousSaved = qc.getQueryData<boolean>(["saved", guide.id, user.id]);
      qc.setQueryData(["saved", guide.id, user.id], !previousSaved);
      return { previousSaved };
    },
    onError: (err, variables, context: any) => {
      if (user && context) {
        qc.setQueryData(["saved", guide.id, user.id], context.previousSaved);
      }
      toast.error(err.message || "Failed to update save status.");
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
    onMutate: async (next) => {
      if (!user) return;
      await qc.cancelQueries({ queryKey: ["progress", guide.id, user.id] });
      const previousProgress = qc.getQueryData<any>(["progress", guide.id, user.id]);
      const isNowCompleted = next.length === steps.length && steps.length > 0;
      qc.setQueryData(["progress", guide.id, user.id], {
        completed_steps: next,
        is_completed: isNowCompleted,
      });
      return { previousProgress };
    },
    onError: (err, variables, context: any) => {
      if (user && context?.previousProgress) {
        qc.setQueryData(["progress", guide.id, user.id], context.previousProgress);
      }
      toast.error("Failed to save progress.");
    },
    onSuccess: async (result, next) => {
      qc.invalidateQueries({ queryKey: ["progress", guide.id] });
      if (!user) return;
      // award XP for newly completed step
      const prev = (progress.data?.completed_steps as number[] | undefined) ?? [];
      if (next.length > prev.length) {
        await awardXp(5, guide.category);
      }
      // bonus when guide completed (either first time or completed again)
      if (result.isNowCompleted) {
        triggerConfetti();
        setShowCelebration(true);
        if (!result.wasCompleted) {
          await awardXp(50, guide.category);
        }
      }
      await checkAchievements(user.id);
    },
  });

  const resetProgress = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from("guide_progress")
        .delete()
        .eq("guide_id", guide.id)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["progress", guide.id] });
      setShowCelebration(false);
      toast.success("Progress reset! You can start this guide again.");
    },
    onError: (err: any) => {
      toast.error(`Failed to reset progress: ${err.message}`);
    },
  });

  const toggleStep = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) return;
    const next = new Set(completed);
    const wasCompleted = next.has(i);
    if (wasCompleted) {
      next.delete(i);
    } else {
      next.add(i);

      // Trigger floating +5 XP indicator centered above target element
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;
      const animId = Date.now() + Math.random();
      setFloatingXp(prev => [...prev, { id: animId, x, y }]);
      setTimeout(() => {
        setFloatingXp(prev => prev.filter(item => item.id !== animId));
      }, 900);
    }
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
    onMutate: async () => {
      if (!user) return;
      await qc.cancelQueries({ queryKey: ["my-vote", guide.id, user.id] });
      const previousMyVote = qc.getQueryData<boolean>(["my-vote", guide.id, user.id]);
      qc.setQueryData(["my-vote", guide.id, user.id], !previousMyVote);

      await qc.cancelQueries({ queryKey: ["guide-votes", guide.id] });
      const previousVotes = qc.getQueryData<number>(["guide-votes", guide.id]) ?? 0;
      qc.setQueryData(["guide-votes", guide.id], previousMyVote ? Math.max(0, previousVotes - 1) : previousVotes + 1);

      return { previousMyVote, previousVotes };
    },
    onError: (err, variables, context: any) => {
      if (user && context) {
        qc.setQueryData(["my-vote", guide.id, user.id], context.previousMyVote);
        qc.setQueryData(["guide-votes", guide.id], context.previousVotes);
      }
      toast.error(err.message || "Failed to update upvote.");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guide-votes", guide.id] });
      qc.invalidateQueries({ queryKey: ["my-vote", guide.id] });
    },
  });

  // Sync initial query state
  useEffect(() => {
    setNewVideoQuery(guide.video_query || guide.title);
  }, [guide.video_query, guide.title]);

  const videoRatings = useQuery({
    queryKey: ["video-ratings", guide.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("video_ratings" as any)
          .select("id, rating, feedback, created_at, user_id, profiles:profiles(display_name, handle)")
          .eq("guide_id", guide.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data || []) as unknown as Array<{
          id: string;
          rating: number;
          feedback: string | null;
          created_at: string;
          user_id: string;
          profiles: { display_name: string | null; handle: string | null } | null;
        }>;
      } catch (err) {
        console.warn("video_ratings table not found, falling back to localStorage ratings", err);
        const key = `local-video-ratings-${guide.id}`;
        const local = localStorage.getItem(key);
        return (local ? JSON.parse(local) : []) as Array<{
          id: string;
          rating: number;
          feedback: string | null;
          created_at: string;
          user_id: string;
          profiles: { display_name: string | null; handle: string | null } | null;
        }>;
      }
    }
  });

  const myVideoRating = videoRatings.data?.find((r) => r.user_id === user?.id);

  // Sync initial text/rating once loaded
  useEffect(() => {
    if (myVideoRating) {
      setRatingVal(myVideoRating.rating);
      setFeedbackText(myVideoRating.feedback || "");
    }
  }, [myVideoRating]);

  const submitVideoRating = useMutation({
    mutationFn: async ({ rating, feedback }: { rating: number; feedback: string }) => {
      if (!user) throw new Error("Sign in to submit a rating");
      try {
        const { error } = await supabase
          .from("video_ratings" as any)
          .upsert({
            guide_id: guide.id,
            user_id: user.id,
            rating,
            feedback: feedback.trim() || null,
          }, { onConflict: "user_id,guide_id" });
        if (error) throw error;
      } catch (err) {
        console.warn("video_ratings upsert failed, saving to localStorage", err);
        const key = `local-video-ratings-${guide.id}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        const next = existing.filter((r: any) => r.user_id !== user.id);
        next.push({
          id: crypto.randomUUID?.() || Math.random().toString(),
          user_id: user.id,
          rating,
          feedback: feedback.trim() || null,
          created_at: new Date().toISOString(),
          profiles: {
            display_name: user.email?.split("@")[0] || "Anonymous",
            handle: user.email?.split("@")[0] || "anonymous"
          }
        });
        localStorage.setItem(key, JSON.stringify(next));
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["video-ratings", guide.id] });
      toast.success("Thank you for your rating and feedback!");
    },
    onError: (err: any) => {
      toast.error(`Failed to submit rating: ${err.message}`);
    }
  });

  const updateVideoQuery = useMutation({
    mutationFn: async (val: string) => {
      const { error } = await supabase
        .from("guides")
        .update({ video_query: val.trim() || null })
        .eq("id", guide.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Video reference search query updated!");
      router.invalidate();
    },
    onError: (err: any) => {
      toast.error(`Failed to update video query: ${err.message}`);
    }
  });

  const videoQuery = guide.video_query || guide.title;
  const videoUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(videoQuery)}`;

  // Troubleshooter
  const [showTrouble, setShowTrouble] = useState(false);
  const [problem, setProblem] = useState("");
  const callTrouble = useServerFn(troubleshoot);
  const trouble = useMutation({
    mutationFn: async (p: string) => {
      const history = chatMessages;
      const out = await callTrouble({
        data: {
          guideTitle: guide.title,
          problem: p,
          history,
        },
      });
      return { question: p, answer: out.text };
    },
    onSuccess: (res) => {
      setChatMessages(prev => [
        ...prev,
        { role: "user", content: res.question },
        { role: "assistant", content: res.answer }
      ]);
      setProblem("");
    },
  });

  useEffect(() => {
    router.invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <TopBar showSearch />
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
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
          <UnauthenticatedBlock
            title="Unlock Step-by-Step Guides"
            description="Join DoGuide to access full step-by-step instructions, view tips, watch video walkthroughs, and complete learning paths."
            onSignIn={() => setAuthOpen(true)}
          />
        </section>
        <BottomNav />
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode="signin" />
      </div>
    );
  }

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

        {user && pct === 100 && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4 shadow-[0_4px_20px_rgba(16,185,129,0.05)]">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                <Trophy className="h-5 w-5 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-emerald-900 text-sm md:text-base">Guide Mastered!</h3>
                <p className="mt-0.5 text-xs md:text-sm text-emerald-700/95 leading-relaxed">
                  You completed all steps in this guide. Practice makes perfect—feel free to reset progress if you want to run through it again.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => resetProgress.mutate()}
                    disabled={resetProgress.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60 transition"
                  >
                    {resetProgress.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Reset & Restart"
                    )}
                  </button>
                  <button
                    onClick={() => triggerConfetti()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Celebrate again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showTrouble && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
            <div className="flex items-center justify-between gap-2 border-b border-amber-200/50 pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <HelpCircle className="h-4 w-4" /> AI Troubleshooter Chat
              </div>
              {chatMessages.length > 0 && (
                <button
                  onClick={() => setChatMessages([])}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline"
                >
                  Clear history
                </button>
              )}
            </div>

            {/* Chat history list */}
            <div className="mt-3 max-h-[300px] overflow-y-auto space-y-3 pr-1">
              {chatMessages.length === 0 ? (
                <p className="text-xs text-amber-800/80 italic">
                  Having difficulty completing a step? Ask a question or type what went wrong to get tailored diagnostic help.
                </p>
              ) : (
                chatMessages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={idx}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-[0_1px_4px_rgba(0,0,0,0.02)] ${
                          isUser
                            ? "bg-amber-600 text-white rounded-br-sm"
                            : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"
                        }`}
                      >
                        {!isUser && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">
                            <Sparkles className="h-2.5 w-2.5 animate-pulse" /> DoGuide AI
                          </div>
                        )}
                        <pre className="whitespace-pre-wrap font-sans text-sm">{msg.content}</pre>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Waiting indicator */}
              {trouble.isPending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white border border-slate-100 px-3.5 py-2 shadow-sm text-sm rounded-bl-sm">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin text-amber-600" />
                      AI is typing…
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Suggestion pills */}
            {chatMessages.length === 0 && (
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {[
                  "Are there alternative materials?",
                  "I'm stuck on Step 1, what do I do?",
                  "Give me safety tips.",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setProblem(s);
                      trouble.mutate(s);
                    }}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100/40 border border-amber-200 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Chat message input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (problem.trim()) trouble.mutate(problem.trim());
              }}
              className="mt-3 flex gap-2"
            >
              <input
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Ask what to do next…"
                className="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-amber-800/40 focus:ring-2 focus:ring-amber-500/20"
                disabled={trouble.isPending}
              />
              <button
                type="submit"
                disabled={trouble.isPending || !problem.trim()}
                className="rounded-lg bg-amber-600 px-3.5 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 disabled:opacity-60 transition"
              >
                Send
              </button>
            </form>
            {trouble.isError && (
              <p className="mt-2 text-xs text-destructive">{(trouble.error as Error).message}</p>
            )}
          </div>
        )}

        {/* Quick mode */}
        {mode === "quick" ? (
          <div className="card-elev premium-card mt-6 rounded-2xl p-5">
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
              <div className="card-elev premium-card mt-6 rounded-2xl p-5">
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
                    <li key={i} className={`card-elev premium-card rounded-2xl p-4 transition ${done ? "opacity-70" : ""}`}>
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={(e) => toggleStep(i, e)}
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

            {resolvingVideo ? (
              <div className="mt-6 space-y-2">
                <div className="mb-2 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-primary animate-pulse" />
                  <h2 className="text-lg font-bold text-slate-600 animate-pulse">Resolving video...</h2>
                </div>
                <div className="card-elev overflow-hidden rounded-2xl bg-slate-905 border border-border/80 flex flex-col items-center justify-center aspect-video w-full p-4 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Connecting to video sources</p>
                  <p className="text-xs text-slate-400 mt-1">Finding the most relevant, high-quality walkthrough...</p>
                </div>
              </div>
            ) : videoUrl ? (
              <div className="mt-6 animate-fade-in">
                <div className="mb-2 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold">Video guide</h2>
                </div>
                <div className="card-elev overflow-hidden rounded-2xl border border-border">
                  <div className="relative aspect-video w-full bg-black">
                    <iframe
                      src={videoUrl}
                      title={`Video guide for ${guide.title}`}
                      className="absolute inset-0 h-full w-full border-none"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* Video Rating & Improvements Feedback System */}
                <div className="mt-4 card-elev rounded-2xl border border-border bg-white p-5 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Rate this video tutorial
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Help us improve the reference video. If it is outdated or misses steps, tell us what to improve!
                    </p>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (hoverVal || ratingVal);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            if (!user) {
                              setAuthOpen(true);
                              return;
                            }
                            setRatingVal(star);
                          }}
                          onMouseEnter={() => setHoverVal(star)}
                          onMouseLeave={() => setHoverVal(0)}
                          className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`h-7 w-7 ${
                              active
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      );
                    })}
                    {ratingVal > 0 && (
                      <span className="ml-2 text-sm font-semibold text-slate-700">
                        {ratingVal} {ratingVal === 1 ? "Star" : "Stars"} selected
                      </span>
                    )}
                  </div>

                  {/* Feedback text area if rating is chosen */}
                  {ratingVal > 0 && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        submitVideoRating.mutate({
                          rating: ratingVal,
                          feedback: feedbackText,
                        });
                      }}
                      className="space-y-3 border-t border-border pt-4 animate-fade-in"
                    >
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          How can we improve this video? (Optional)
                        </label>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="E.g., The audio quality is low, or it skips Step 4..."
                          className="w-full min-h-[80px] rounded-xl border border-border bg-slate-50/50 p-3 text-sm placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitVideoRating.isPending}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:bg-primary/95 transition shadow-md shadow-primary/10 cursor-pointer"
                      >
                        {submitVideoRating.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                          </>
                        ) : (
                          "Submit Feedback"
                        )}
                      </button>
                    </form>
                  )}

                  {/* Creator / Community Tools: Manage/Suggest Reference Video */}
                  {user && (
                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
                        {guide.author_id === user.id ? "Creator Tools: Manage Reference Video" : "Community Tools: Suggest a Better Video"}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {guide.author_id === user.id
                          ? "Search and select a specific tutorial to embed, or update the search terms. You can also paste a direct YouTube video URL."
                          : "Is the current video tutorial outdated, incorrect, or poor quality? Search YouTube or paste a direct YouTube URL to suggest a better one to improve this guide!"}
                      </p>
                      
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSearchYoutube(newVideoQuery);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          value={newVideoQuery}
                          onChange={(e) => setNewVideoQuery(e.target.value)}
                          placeholder="Search terms or paste YouTube URL/ID..."
                          className="flex-1 rounded-xl border border-border bg-slate-50/50 px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
                        />
                        <button
                          type="submit"
                          disabled={searchingVideos || !newVideoQuery.trim()}
                          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition shadow-md shadow-indigo-600/10 cursor-pointer"
                        >
                          {searchingVideos ? "Searching..." : "Search YouTube"}
                        </button>
                      </form>

                      {/* Video Search Results list */}
                      {videoSearchResults.length > 0 && (
                        <div className="mt-3 space-y-2 border border-slate-100 bg-slate-50/30 rounded-2xl p-3 animate-fade-in">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Search Results ({videoSearchResults.length})
                          </h4>
                          <div className="grid gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                            {videoSearchResults.map((vid) => (
                              <div
                                key={vid.videoId}
                                className="group flex gap-3 bg-white border border-border hover:border-indigo-200 rounded-xl p-2.5 transition shadow-sm hover:shadow-md"
                              >
                                <div className="relative aspect-video w-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                                  <img
                                    src={`https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`}
                                    alt={vid.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                  <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] font-bold text-white tracking-wide">
                                    {vid.duration}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                  <div>
                                    <h5 className="font-semibold text-slate-800 text-xs md:text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors" title={vid.title}>
                                      {vid.title}
                                    </h5>
                                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                                      {vid.channel}
                                    </p>
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => window.open(`https://youtube.com/watch?v=${vid.videoId}`, '_blank')}
                                      className="text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:underline cursor-pointer"
                                    >
                                      Preview
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSelectVideo(vid.videoId)}
                                      className="rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 px-2.5 py-1 text-[11px] font-bold text-indigo-700 transition cursor-pointer"
                                    >
                                      Select & Embed
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Collapsible community feedback */}
                  {videoRatings.data && videoRatings.data.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                          <span>Community Suggestions ({videoRatings.data.length})</span>
                          <span className="transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <ul className="mt-3 space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                          {videoRatings.data.map((item) => (
                            <li key={item.id} className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-800">
                                  {item.profiles?.display_name || "Anonymous Learner"}
                                </span>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= item.rating
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-muted-foreground/20"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {item.feedback && (
                                <p className="mt-1 text-xs text-slate-600 italic">
                                  "{item.feedback}"
                                </p>
                              )}
                              <span className="block mt-1 text-[10px] text-muted-foreground">
                                {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </>
        )}

        <GuideComments guideId={guide.id} />
      </section>
      <BottomNav />

      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="sm:max-w-md overflow-hidden rounded-3xl border-0 bg-white/95 p-6 shadow-2xl backdrop-blur-xl transition duration-300">
          <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-36 w-36 rounded-full bg-indigo-400/10 blur-3xl" />
          
          <DialogHeader className="relative flex flex-col items-center text-center">
            <div className="relative mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-400 to-emerald-600 text-white shadow-xl shadow-emerald-500/30">
              <Trophy className="h-8 w-8 animate-pulse" />
              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-400 animate-ping" />
            </div>
            <DialogTitle className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
              Skill Mastered!
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground px-2">
              Outstanding work! You've successfully finished every step of:
              <span className="block mt-1 font-semibold text-slate-800 text-base">
                “{guide.title}”
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Rewards Earned
            </div>
            <div className="mt-2 flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-emerald-600">+50 XP</span>
                <span className="text-[10px] text-muted-foreground font-medium">Completion Bonus</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-indigo-600">+{steps.length * 5} XP</span>
                <span className="text-[10px] text-muted-foreground font-medium">Steps Checked</span>
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex flex-col gap-2.5">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition shadow-lg shadow-primary/20"
              onClick={() => setShowCelebration(false)}
            >
              Browse more guides <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  resetProgress.mutate();
                }}
                disabled={resetProgress.isPending}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-60 transition"
              >
                {resetProgress.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Reset Progress"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerConfetti();
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white py-2.5 text-xs font-semibold hover:bg-slate-50 transition"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Confetti!
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating XP animations */}
      {floatingXp.map((item) => (
        <span
          key={item.id}
          style={{ left: item.x, top: item.y }}
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full animate-float-xp font-black text-xs text-primary select-none drop-shadow"
        >
          +5 XP
        </span>
      ))}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode="signin" />
    </div>
  );
}

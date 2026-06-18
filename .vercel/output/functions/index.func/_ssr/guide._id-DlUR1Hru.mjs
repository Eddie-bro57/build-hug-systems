import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, u as useQuery, a as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useAuth, u as useServerFn, T as TopBar, B as BottomNav, D as Dialog, e as DialogContent, f as DialogHeader, g as DialogTitle, h as DialogDescription, d as checkAchievements, b as awardXp, t as troubleshoot } from "./BottomNav-qq3EU_oa.mjs";
import { s as supabase } from "./client-Cb98OQ8D.mjs";
import { c as confetti } from "../_libs/canvas-confetti.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { d as Route$2 } from "./router-B1HhPp6z.mjs";
import "../_libs/seroval.mjs";
import { e as ArrowLeft, G as Gauge, f as Clock, g as ListChecks, h as BookOpen, S as Sparkles, i as BookmarkCheck, B as Bookmark, j as ThumbsUp, k as CircleQuestionMark, T as Trophy, L as LoaderCircle, C as CircleCheck, l as Circle, m as Lightbulb, n as CirclePlay, A as ArrowRight, M as MessageCircle, o as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/class-variance-authority.mjs";
import "./server-1c1s4yWy.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
function GuideComments({ guideId }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [body, setBody] = reactExports.useState("");
  const comments = useQuery({
    queryKey: ["comments", guideId],
    queryFn: async () => {
      const { data, error } = await supabase.from("comments").select("id, body, upvotes, created_at, user_id, author:profiles(display_name, handle, avatar_url)").eq("guide_id", guideId).order("upvotes", { ascending: false }).order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    }
  });
  const myVotes = useQuery({
    queryKey: ["comment-votes", guideId, user?.id ?? ""],
    enabled: !!user && !!comments.data?.length,
    queryFn: async () => {
      const ids = (comments.data ?? []).map((c) => c.id);
      if (!ids.length) return /* @__PURE__ */ new Set();
      const { data } = await supabase.from("comment_votes").select("comment_id").eq("user_id", user.id).in("comment_id", ids);
      return new Set((data ?? []).map((r) => r.comment_id));
    }
  });
  const post = useMutation({
    mutationFn: async (text) => {
      if (!user) throw new Error("Sign in to comment");
      const { error } = await supabase.from("comments").insert({ guide_id: guideId, user_id: user.id, body: text });
      if (error) throw error;
      await awardXp(5);
      await checkAchievements(user.id);
    },
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["comments", guideId] });
    }
  });
  const del = useMutation({
    mutationFn: async (id) => {
      await supabase.from("comments").delete().eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", guideId] })
  });
  const toggleVote = useMutation({
    mutationFn: async (commentId) => {
      if (!user) throw new Error("Sign in to vote");
      const has = myVotes.data?.has(commentId);
      if (has) {
        await supabase.from("comment_votes").delete().eq("user_id", user.id).eq("comment_id", commentId);
      } else {
        await supabase.from("comment_votes").insert({ user_id: user.id, comment_id: commentId });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", guideId] });
      qc.invalidateQueries({ queryKey: ["comment-votes", guideId] });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold tracking-tight", children: [
        "Comments ",
        comments.data ? `(${comments.data.length})` : ""
      ] })
    ] }),
    user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          const v = body.trim();
          if (v) post.mutate(v);
        },
        className: "mb-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: body,
              onChange: (e) => setBody(e.target.value),
              placeholder: "Share a tip, a question, or how it went…",
              rows: 3,
              maxLength: 2e3,
              className: "w-full resize-none rounded-2xl border border-border bg-white p-3 text-sm outline-none focus:border-primary"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              body.length,
              "/2000"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                disabled: post.isPending || !body.trim(),
                className: "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60",
                children: post.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Post"
              }
            )
          ] }),
          post.isError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: post.error.message })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground", children: "Sign in to join the conversation." }),
    comments.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }) : comments.data && comments.data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: comments.data.map((c) => {
      const voted = myVotes.data?.has(c.id);
      const name = c.author?.display_name ?? "Someone";
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "card-elev rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary", children: name.charAt(0).toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
            c.author?.handle ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/creator/$handle",
                params: { handle: c.author.handle },
                className: "font-semibold hover:underline",
                children: name
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "· ",
              new Date(c.created_at).toLocaleDateString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 whitespace-pre-wrap text-sm", children: c.body }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                disabled: !user || toggleVote.isPending,
                onClick: () => toggleVote.mutate(c.id),
                className: `inline-flex items-center gap-1 rounded-full px-2 py-1 ${voted ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { className: "h-3.5 w-3.5" }),
                  " ",
                  c.upvotes
                ]
              }
            ),
            user?.id === c.user_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => del.mutate(c.id),
                className: "inline-flex items-center gap-1 text-muted-foreground hover:text-destructive",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                  " Delete"
                ]
              }
            )
          ] })
        ] })
      ] }) }, c.id);
    }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Be the first to comment." })
  ] });
}
const difficultyColor = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-rose-100 text-rose-700"
};
function GuidePage() {
  const {
    guide
  } = Route$2.useLoaderData();
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const router = useRouter();
  const [mode, setMode] = reactExports.useState("step");
  const [showCelebration, setShowCelebration] = reactExports.useState(false);
  const [floatingXp, setFloatingXp] = reactExports.useState([]);
  const [chatMessages, setChatMessages] = reactExports.useState([]);
  const steps = guide.steps ?? [];
  const tips = guide.tips ?? [];
  const materials = guide.materials ?? [];
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 60,
      origin: {
        x: 0,
        y: 0.8
      }
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 60,
      origin: {
        x: 1,
        y: 0.8
      }
    });
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: {
          y: 0.65
        }
      });
    }, 250);
  };
  const saved = useQuery({
    queryKey: ["saved", guide.id, user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("saved_guides").select("guide_id").eq("guide_id", guide.id).eq("user_id", user.id).maybeSingle();
      return !!data;
    }
  });
  const toggleSave = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to save");
      if (saved.data) {
        await supabase.from("saved_guides").delete().eq("guide_id", guide.id).eq("user_id", user.id);
      } else {
        await supabase.from("saved_guides").insert({
          guide_id: guide.id,
          user_id: user.id
        });
        await checkAchievements(user.id);
      }
    },
    onMutate: async () => {
      if (!user) return;
      await qc.cancelQueries({
        queryKey: ["saved", guide.id, user.id]
      });
      const previousSaved = qc.getQueryData(["saved", guide.id, user.id]);
      qc.setQueryData(["saved", guide.id, user.id], !previousSaved);
      return {
        previousSaved
      };
    },
    onError: (err, variables, context) => {
      if (user && context) {
        qc.setQueryData(["saved", guide.id, user.id], context.previousSaved);
      }
      toast.error(err.message || "Failed to update save status.");
    },
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["saved", guide.id]
    })
  });
  const progress = useQuery({
    queryKey: ["progress", guide.id, user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("guide_progress").select("completed_steps, is_completed").eq("guide_id", guide.id).eq("user_id", user.id).maybeSingle();
      return data ?? {
        completed_steps: [],
        is_completed: false
      };
    }
  });
  const completed = new Set(progress.data?.completed_steps ?? []);
  const saveProgress = useMutation({
    mutationFn: async (next) => {
      if (!user) return {
        wasCompleted: false,
        isNowCompleted: false
      };
      const wasCompleted = progress.data?.is_completed ?? false;
      const isNowCompleted = next.length === steps.length && steps.length > 0;
      await supabase.from("guide_progress").upsert({
        user_id: user.id,
        guide_id: guide.id,
        completed_steps: next,
        is_completed: isNowCompleted,
        completed_at: isNowCompleted ? (/* @__PURE__ */ new Date()).toISOString() : null
      }, {
        onConflict: "user_id,guide_id"
      });
      return {
        wasCompleted,
        isNowCompleted
      };
    },
    onMutate: async (next) => {
      if (!user) return;
      await qc.cancelQueries({
        queryKey: ["progress", guide.id, user.id]
      });
      const previousProgress = qc.getQueryData(["progress", guide.id, user.id]);
      const isNowCompleted = next.length === steps.length && steps.length > 0;
      qc.setQueryData(["progress", guide.id, user.id], {
        completed_steps: next,
        is_completed: isNowCompleted
      });
      return {
        previousProgress
      };
    },
    onError: (err, variables, context) => {
      if (user && context?.previousProgress) {
        qc.setQueryData(["progress", guide.id, user.id], context.previousProgress);
      }
      toast.error("Failed to save progress.");
    },
    onSuccess: async (result, next) => {
      qc.invalidateQueries({
        queryKey: ["progress", guide.id]
      });
      if (!user) return;
      const prev = progress.data?.completed_steps ?? [];
      if (next.length > prev.length) {
        await awardXp(5, guide.category);
      }
      if (result.isNowCompleted) {
        triggerConfetti();
        setShowCelebration(true);
        if (!result.wasCompleted) {
          await awardXp(50, guide.category);
        }
      }
      await checkAchievements(user.id);
    }
  });
  const resetProgress = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const {
        error
      } = await supabase.from("guide_progress").delete().eq("guide_id", guide.id).eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["progress", guide.id]
      });
      setShowCelebration(false);
      toast.success("Progress reset! You can start this guide again.");
    },
    onError: (err) => {
      toast.error(`Failed to reset progress: ${err.message}`);
    }
  });
  const toggleStep = (i, e) => {
    if (!user) return;
    const next = new Set(completed);
    const wasCompleted = next.has(i);
    if (wasCompleted) {
      next.delete(i);
    } else {
      next.add(i);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;
      const animId = Date.now() + Math.random();
      setFloatingXp((prev) => [...prev, {
        id: animId,
        x,
        y
      }]);
      setTimeout(() => {
        setFloatingXp((prev) => prev.filter((item) => item.id !== animId));
      }, 900);
    }
    saveProgress.mutate([...next].sort((a, b) => a - b));
  };
  const pct = steps.length === 0 ? 0 : Math.round(completed.size / steps.length * 100);
  const votes = useQuery({
    queryKey: ["guide-votes", guide.id],
    queryFn: async () => {
      const {
        count
      } = await supabase.from("guide_votes").select("user_id", {
        count: "exact",
        head: true
      }).eq("guide_id", guide.id);
      return count ?? 0;
    }
  });
  const myVote = useQuery({
    queryKey: ["my-vote", guide.id, user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("guide_votes").select("guide_id").eq("guide_id", guide.id).eq("user_id", user.id).maybeSingle();
      return !!data;
    }
  });
  const toggleVote = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to upvote");
      if (myVote.data) {
        await supabase.from("guide_votes").delete().eq("guide_id", guide.id).eq("user_id", user.id);
      } else {
        await supabase.from("guide_votes").insert({
          guide_id: guide.id,
          user_id: user.id
        });
        await awardXp(2);
        await checkAchievements(user.id);
      }
    },
    onMutate: async () => {
      if (!user) return;
      await qc.cancelQueries({
        queryKey: ["my-vote", guide.id, user.id]
      });
      const previousMyVote = qc.getQueryData(["my-vote", guide.id, user.id]);
      qc.setQueryData(["my-vote", guide.id, user.id], !previousMyVote);
      await qc.cancelQueries({
        queryKey: ["guide-votes", guide.id]
      });
      const previousVotes = qc.getQueryData(["guide-votes", guide.id]) ?? 0;
      qc.setQueryData(["guide-votes", guide.id], previousMyVote ? Math.max(0, previousVotes - 1) : previousVotes + 1);
      return {
        previousMyVote,
        previousVotes
      };
    },
    onError: (err, variables, context) => {
      if (user && context) {
        qc.setQueryData(["my-vote", guide.id, user.id], context.previousMyVote);
        qc.setQueryData(["guide-votes", guide.id], context.previousVotes);
      }
      toast.error(err.message || "Failed to update upvote.");
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["guide-votes", guide.id]
      });
      qc.invalidateQueries({
        queryKey: ["my-vote", guide.id]
      });
    }
  });
  const videoUrl = guide.video_query ? `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(guide.video_query)}` : null;
  const [showTrouble, setShowTrouble] = reactExports.useState(false);
  const [problem, setProblem] = reactExports.useState("");
  const callTrouble = useServerFn(troubleshoot);
  const trouble = useMutation({
    mutationFn: async (p) => {
      const history = chatMessages;
      const out = await callTrouble({
        data: {
          guideTitle: guide.title,
          problem: p,
          history
        }
      });
      return {
        question: p,
        answer: out.text
      };
    },
    onSuccess: (res) => {
      setChatMessages((prev) => [...prev, {
        role: "user",
        content: res.question
      }, {
        role: "assistant",
        content: res.answer
      }]);
      setProblem("");
    }
  });
  reactExports.useEffect(() => {
    router.invalidate();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-20 md:pb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, { showSearch: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-5 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Home"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-2xl font-extrabold tracking-tight md:text-3xl", children: guide.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: guide.summary }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium ${difficultyColor[guide.difficulty] ?? "bg-muted text-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "h-3.5 w-3.5" }),
          " ",
          guide.difficulty
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
          " ",
          guide.time_minutes,
          " min"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "h-3.5 w-3.5" }),
          " ",
          steps.length,
          " steps"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground", children: guide.category })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex rounded-full border border-border bg-white p-1 text-xs font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMode("step"), className: `rounded-full px-3 py-1 ${mode === "step" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "mr-1 inline h-3.5 w-3.5" }),
            " Step-by-step"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMode("quick"), className: `rounded-full px-3 py-1 ${mode === "quick" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-1 inline h-3.5 w-3.5" }),
            " Quick"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleSave.mutate(), disabled: !user || toggleSave.isPending, className: "inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60", title: user ? "Save guide" : "Sign in to save", children: saved.data ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { className: "h-4 w-4 text-primary" }),
          " Saved"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "h-4 w-4" }),
          " Save"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggleVote.mutate(), disabled: !user || toggleVote.isPending, className: `inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium disabled:opacity-60 ${myVote.data ? "border-primary bg-primary/10 text-primary" : "border-border bg-white hover:bg-muted"}`, title: user ? "Upvote this guide" : "Sign in to upvote", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { className: "h-4 w-4" }),
          " ",
          votes.data ?? 0
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowTrouble((v) => !v), className: "inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-4 w-4" }),
          " I'm stuck"
        ] })
      ] }),
      user && steps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-border bg-white p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progress" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            completed.size,
            " / ",
            steps.length,
            " (",
            pct,
            "%)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary transition-all", style: {
          width: `${pct}%`
        } }) })
      ] }),
      user && pct === 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4 shadow-[0_4px_20px_rgba(16,185,129,0.05)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5 animate-bounce" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-emerald-900 text-sm md:text-base", children: "Guide Mastered!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs md:text-sm text-emerald-700/95 leading-relaxed", children: "You completed all steps in this guide. Practice makes perfect—feel free to reset progress if you want to run through it again." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => resetProgress.mutate(), disabled: resetProgress.isPending, className: "inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60 transition", children: resetProgress.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : "Reset & Restart" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => triggerConfetti(), className: "inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
              " Celebrate again"
            ] })
          ] })
        ] })
      ] }) }),
      showTrouble && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl border border-amber-200 bg-amber-50/40 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-amber-200/50 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-bold text-amber-900", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-4 w-4" }),
            " AI Troubleshooter Chat"
          ] }),
          chatMessages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setChatMessages([]), className: "text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline", children: "Clear history" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 max-h-[300px] overflow-y-auto space-y-3 pr-1", children: [
          chatMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-800/80 italic", children: "Having difficulty completing a step? Ask a question or type what went wrong to get tailored diagnostic help." }) : chatMessages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${isUser ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-[0_1px_4px_rgba(0,0,0,0.02)] ${isUser ? "bg-amber-600 text-white rounded-br-sm" : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"}`, children: [
              !isUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 animate-pulse" }),
                " DoGuide AI"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap font-sans text-sm", children: msg.content })
            ] }) }, idx);
          }),
          trouble.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-white border border-slate-100 px-3.5 py-2 shadow-sm text-sm rounded-bl-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin text-amber-600" }),
            "AI is typing…"
          ] }) }) })
        ] }),
        chatMessages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3.5 flex flex-wrap gap-1.5", children: ["Are there alternative materials?", "I'm stuck on Step 1, what do I do?", "Give me safety tips."].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setProblem(s);
          trouble.mutate(s);
        }, className: "rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100/40 border border-amber-200 transition", children: s }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          if (problem.trim()) trouble.mutate(problem.trim());
        }, className: "mt-3 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: problem, onChange: (e) => setProblem(e.target.value), placeholder: "Ask what to do next…", className: "flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-amber-800/40 focus:ring-2 focus:ring-amber-500/20", disabled: trouble.isPending }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: trouble.isPending || !problem.trim(), className: "rounded-lg bg-amber-600 px-3.5 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 disabled:opacity-60 transition", children: "Send" })
        ] }),
        trouble.isError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-destructive", children: trouble.error.message })
      ] }),
      mode === "quick" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elev premium-card mt-6 rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Quick version" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2", children: guide.summary }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-3 list-decimal space-y-1 pl-5 text-sm", children: steps.slice(0, 5).map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
            s.title,
            "."
          ] }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            s.detail.split(".")[0],
            "."
          ] })
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode("step"), className: "mt-4 text-sm font-medium text-primary hover:underline", children: "Show full step-by-step →" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        materials.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elev premium-card mt-6 rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "What you'll need" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 grid gap-2 sm:grid-cols-2", children: materials.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" }),
            m
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold tracking-tight", children: "Steps" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-3 space-y-3", children: steps.map((s, i) => {
            const done = completed.has(i);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: `card-elev premium-card rounded-2xl p-4 transition ${done ? "opacity-70" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => toggleStep(i, e), disabled: !user, className: "mt-0.5 shrink-0", "aria-label": done ? "Mark step incomplete" : "Mark step complete", children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-6 w-6 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `font-semibold ${done ? "line-through" : ""}`, children: [
                  i + 1,
                  ". ",
                  s.title
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: s.detail })
              ] })
            ] }) }, i);
          }) }),
          !user && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Sign in to track which steps you've completed." })
        ] }),
        tips.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-amber-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider", children: "Tips" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1 text-sm text-amber-900", children: tips.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t })
          ] }, i)) })
        ] }),
        videoUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: "Video guide" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-elev overflow-hidden rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-video w-full bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: videoUrl, title: `Video guide for ${guide.title}`, className: "absolute inset-0 h-full w-full", allow: "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(GuideComments, { guideId: guide.id })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showCelebration, onOpenChange: setShowCelebration, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md overflow-hidden rounded-3xl border-0 bg-white/95 p-6 shadow-2xl backdrop-blur-xl transition duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-16 -top-16 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-16 -bottom-16 h-36 w-36 rounded-full bg-indigo-400/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "relative flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-400 to-emerald-600 text-white shadow-xl shadow-emerald-500/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-8 w-8 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-400 animate-ping" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent", children: "Skill Mastered!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "mt-2 text-sm text-muted-foreground px-2", children: [
          "Outstanding work! You've successfully finished every step of:",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block mt-1 font-semibold text-slate-800 text-base", children: [
            "“",
            guide.title,
            "”"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold", children: "Rewards Earned" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-extrabold text-emerald-600", children: "+50 XP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium", children: "Completion Bonus" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-px bg-slate-200" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-extrabold text-indigo-600", children: [
              "+",
              steps.length * 5,
              " XP"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium", children: "Steps Checked" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-6 flex flex-col gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition shadow-lg shadow-primary/20", onClick: () => setShowCelebration(false), children: [
          "Browse more guides ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            resetProgress.mutate();
          }, disabled: resetProgress.isPending, className: "flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-60 transition", children: resetProgress.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : "Reset Progress" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
            triggerConfetti();
          }, className: "flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white py-2.5 text-xs font-semibold hover:bg-slate-50 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-amber-500" }),
            " Confetti!"
          ] })
        ] })
      ] })
    ] }) }),
    floatingXp.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      left: item.x,
      top: item.y
    }, className: "fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full animate-float-xp font-black text-xs text-primary select-none drop-shadow", children: "+5 XP" }, item.id))
  ] });
}
export {
  GuidePage as component
};

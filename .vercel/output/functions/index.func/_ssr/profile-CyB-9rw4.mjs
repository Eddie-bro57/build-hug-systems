import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, u as useQuery, a as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useAuth, T as TopBar, x as xpToNextLevel, B as BottomNav } from "./BottomNav-qq3EU_oa.mjs";
import { s as supabase } from "./client-Cb98OQ8D.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, S as Sparkles, T as Trophy, F as Flame, a as Award, B as Bookmark, C as CircleCheck } from "../_libs/lucide-react.mjs";
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
function ProfilePage() {
  const {
    user,
    loading
  } = useAuth();
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ["my-profile", user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("profiles").select("display_name, handle, bio, xp, level, streak_days, reputation").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const skills = useQuery({
    queryKey: ["my-skills", user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("skill_levels").select("category, xp, level").eq("user_id", user.id).order("xp", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const achievements = useQuery({
    queryKey: ["my-achievements", user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("user_achievements").select("unlocked_at, achievement:achievements(code, title, description, icon)").eq("user_id", user.id).order("unlocked_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const saved = useQuery({
    queryKey: ["my-saved", user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("saved_guides").select("saved_at, guide:guides(id, title, summary, category, difficulty, time_minutes)").eq("user_id", user.id).order("saved_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const progress = useQuery({
    queryKey: ["my-progress", user?.id ?? ""],
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("guide_progress").select("is_completed, completed_steps, updated_at, guide:guides(id, title, category, steps)").eq("user_id", user.id).order("updated_at", {
        ascending: false
      }).limit(20);
      if (error) throw error;
      return data ?? [];
    }
  });
  const [handle, setHandle] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [displayName, setDisplayName] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
      const {
        error
      } = await supabase.from("profiles").update({
        display_name: displayName.trim() || null,
        handle: cleanHandle || null,
        bio: bio.trim() || null
      }).eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile saved");
      setEditing(false);
      qc.invalidateQueries({
        queryKey: ["my-profile", user?.id]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-20 md:pb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-5 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold tracking-tight md:text-3xl", children: "My profile" }),
      !user ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-elev mt-6 rounded-2xl p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Sign in to track progress and save guides." }) }) : loading || !profile.data ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mt-6 h-5 w-5 animate-spin text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elev mt-5 rounded-3xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground", children: (profile.data.display_name ?? user.email ?? "?").charAt(0).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: profile.data.display_name ?? user.email }),
              profile.data.handle ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/creator/$handle", params: {
                handle: profile.data.handle
              }, className: "text-sm text-primary hover:underline", children: [
                "@",
                profile.data.handle
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pick a handle to claim your creator page." }),
              profile.data.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm", children: profile.data.bio }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEditing((v) => !v), className: "mt-3 text-xs font-semibold text-primary hover:underline", children: editing ? "Cancel" : "Edit profile" })
            ] })
          ] }),
          editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3 border-t border-border pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "Display name", className: "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: handle, onChange: (e) => setHandle(e.target.value), placeholder: "handle (letters, numbers, underscore)", className: "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: bio, onChange: (e) => setBio(e.target.value), rows: 3, placeholder: "Short bio", className: "w-full resize-none rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: saveProfile.isPending, onClick: () => saveProfile.mutate(), className: "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60", children: saveProfile.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Save" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }), label: `Level ${profile.data.level}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3.5 w-3.5" }), label: `${profile.data.xp} XP` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5 text-amber-600" }), label: `${profile.data.streak_days}-day streak` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-3.5 w-3.5 text-emerald-600" }), label: `${profile.data.reputation} rep` })
            ] }),
            (() => {
              const {
                needed,
                nextAt
              } = xpToNextLevel(profile.data.xp, profile.data.level);
              const prevAt = (profile.data.level - 1) * (profile.data.level - 1) * 50;
              const span = Math.max(1, nextAt - prevAt);
              const pct = Math.min(100, Math.round((profile.data.xp - prevAt) / span * 100));
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px] text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Level ",
                    profile.data.level
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    needed,
                    " XP to level ",
                    profile.data.level + 1
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-primary to-amber-500", style: {
                  width: `${pct}%`
                } }) })
              ] });
            })()
          ] })
        ] }),
        skills.data && skills.data.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Skill levels" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-3", children: skills.data.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elev rounded-2xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: s.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-end justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold", children: [
                "Lv ",
                s.level
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                s.xp,
                " XP"
              ] })
            ] })
          ] }, s.category)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-4 w-4" }),
            " Achievements"
          ] }),
          achievements.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }) : achievements.data && achievements.data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: achievements.data.map((row, i) => {
            const ach = row.achievement;
            if (!ach) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elev rounded-2xl p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "mx-auto h-6 w-6 text-amber-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-semibold", children: ach.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[11px] text-muted-foreground", children: ach.description })
            ] }, i);
          }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Finish guides, comment, and build streaks to unlock badges." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "h-4 w-4" }),
            " Saved guides"
          ] }),
          saved.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }) : saved.data && saved.data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: saved.data.map((row) => {
            const g = row.guide;
            if (!g) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/guide/$id", params: {
              id: g.id
            }, className: "card-elev block rounded-2xl p-4 hover:-translate-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
                g.category,
                " · ",
                g.difficulty,
                " · ",
                g.time_minutes,
                " min"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-semibold", children: g.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 line-clamp-2 text-sm text-muted-foreground", children: g.summary })
            ] }) }, g.id);
          }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No saved guides yet." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
            " Continue learning"
          ] }),
          progress.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }) : progress.data && progress.data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: progress.data.map((row) => {
            const g = row.guide;
            if (!g) return null;
            const total = Array.isArray(g.steps) ? g.steps.length : 0;
            const doneArr = row.completed_steps ?? [];
            const pct = total === 0 ? 0 : Math.round(doneArr.length / total * 100);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/guide/$id", params: {
              id: g.id
            }, className: "card-elev block rounded-2xl p-4 hover:-translate-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: g.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate font-semibold", children: g.title })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-xs font-semibold text-primary", children: [
                  pct,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1.5 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary", style: {
                width: `${pct}%`
              } }) })
            ] }) }, g.id);
          }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Start a guide and your progress will show up here." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
function Stat({
  icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 font-medium", children: [
    icon,
    " ",
    label
  ] });
}
export {
  ProfilePage as component
};

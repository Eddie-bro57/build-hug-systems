import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { T as TopBar, B as BottomNav } from "./BottomNav-qq3EU_oa.mjs";
import { c as categories } from "./router-B1HhPp6z.mjs";
import { s as supabase } from "./client-Cb98OQ8D.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { S as Sparkles, A as ArrowRight, b as Target, c as TrendingUp, F as Flame, R as Route, d as Compass } from "../_libs/lucide-react.mjs";
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
function Home() {
  const navigate = useNavigate();
  const [q, setQ] = reactExports.useState("");
  const trending = useQuery({
    queryKey: ["trending-guides"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("guides").select("id, slug, title, summary, category, time_minutes, difficulty, views").eq("is_published", true).order("views", {
        ascending: false
      }).limit(6);
      if (error) throw error;
      return data ?? [];
    }
  });
  const onSubmit = (e) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    navigate({
      to: "/search",
      search: {
        q: v
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-20 md:pb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, { showSearch: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl px-5 pt-10 pb-8 md:pt-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
        "AI-powered practical skills platform"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-5 text-4xl font-extrabold tracking-tight md:text-6xl", children: [
        "Learn anything,",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#ff6f61] via-[#f59e0b] to-[#6366f1] bg-clip-text text-transparent", children: "do anything" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg", children: "Step-by-step guides for any task — with video, AI help, and progress tracking." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mx-auto mt-7 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-white p-2 shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "ml-3 h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "e.g. How do I bake banana bread?", className: "flex-1 bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground md:text-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground", children: [
          "Guide me ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Try:" }),
        ["Tune a guitar", "Write a CV", "Unclog a drain", "Cook jollof rice"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/search", search: {
          q: s
        }, className: "rounded-full border border-border bg-white/60 px-3 py-1 hover:bg-white", children: s }, s))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl px-5 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#fff7ed] via-white to-[#eff6ff] p-6 md:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-amber-700", children: "Today's challenge" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-lg font-bold md:text-xl", children: "Learn one new practical skill in 15 minutes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Pick something small you've been putting off. Knife skills, a chord change, a terminal command — anything counts." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/search", search: {
          q: "Quick 15-minute skill to learn today"
        }, className: "inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline", children: [
          "Find me a guide ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-5xl px-5 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }), title: "Trending guides" }),
      trending.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-elev h-28 animate-pulse rounded-2xl" }, i)) }) : trending.data && trending.data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: trending.data.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/guide/$id", params: {
        id: g.id
      }, className: "card-elev premium-card group rounded-2xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3 w-3 text-rose-500" }),
          " ",
          g.category
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 line-clamp-2 font-semibold", children: g.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 line-clamp-2 text-xs text-muted-foreground", children: g.summary }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-[11px] font-medium text-muted-foreground", children: [
          g.difficulty,
          " · ",
          g.time_minutes,
          " min"
        ] })
      ] }, g.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-elev rounded-2xl p-6 text-sm text-muted-foreground", children: "No trending guides yet — be the first to generate one above." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl px-5 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elev flex flex-col items-start gap-3 rounded-3xl bg-gradient-to-br from-[#eff6ff] via-white to-[#fef3c7] p-6 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: "Learning paths" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Curated journeys — multiple guides bundled to master a skill end-to-end." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/paths", className: "inline-flex items-center gap-1 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold hover:bg-muted", children: "Browse paths" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/paths/new", className: "inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground", children: [
          "Create one ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-5xl px-5 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "h-4 w-4" }), title: "Browse categories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/category/$slug", params: {
        slug: c.slug
      }, className: "group relative overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-28 w-full overflow-hidden md:h-32", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.image, alt: c.name, className: "h-full w-full object-cover transition duration-300 group-hover:scale-105", loading: "lazy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 left-3 text-sm font-bold text-white drop-shadow md:text-base", children: [
          c.emoji,
          " ",
          c.name
        ] })
      ] }) }, c.slug)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mx-auto max-w-5xl border-t border-border/60 px-5 py-8 text-center text-xs text-muted-foreground", children: "DoGuide — practical skills, one step at a time." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
function SectionHeader({
  icon,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold tracking-tight md:text-xl", children: title })
  ] });
}
export {
  Home as component
};

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery, a as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, T as TopBar, B as BottomNav, c as createSsrRpc } from "./BottomNav-qq3EU_oa.mjs";
import { s as supabase } from "./client-Cb98OQ8D.mjs";
import { c as createServerFn } from "./server-1c1s4yWy.mjs";
import { R as Route$8, c as categories } from "./router-B1HhPp6z.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { S as Sparkles, L as LoaderCircle, A as ArrowRight } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const generateGuide = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  query: stringType().min(2).max(200),
  category: stringType().optional()
})).handler(createSsrRpc("59f653334e6e7f810ea4b23328818fd6c366c4425c8877cb0cabb28ca4237c6c"));
function SearchPage() {
  const {
    q,
    c
  } = Route$8.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = reactExports.useState(q);
  const callGenerate = useServerFn(generateGuide);
  const results = useQuery({
    queryKey: ["search", q, c ?? ""],
    queryFn: async () => {
      let req = supabase.from("guides").select("id, slug, title, summary, category, difficulty, time_minutes").eq("is_published", true).or(`title.ilike.%${q}%,summary.ilike.%${q}%`).limit(20);
      if (c) req = req.eq("category", c);
      const {
        data,
        error
      } = await req;
      if (error) throw error;
      return data ?? [];
    }
  });
  const create = useMutation({
    mutationFn: async () => {
      const out = await callGenerate({
        data: {
          query: q,
          category: c
        }
      });
      return out;
    },
    onSuccess: (out) => {
      if (out?.id) navigate({
        to: "/guide/$id",
        params: {
          id: out.id
        }
      });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-20 md:pb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, { showSearch: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-5 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        const v = query.trim();
        if (v) navigate({
          to: "/search",
          search: {
            q: v,
            ...c ? {
              c
            } : {}
          }
        });
      }, className: "flex items-center gap-2 rounded-2xl border border-border bg-white p-2 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "ml-2 h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search any task…", className: "flex-1 bg-transparent py-2 text-base outline-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Search" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
          to: "/search",
          search: {
            q
          }
        }), className: `rounded-full border px-3 py-1 text-xs ${!c ? "border-primary bg-primary/10 text-primary" : "border-border bg-white"}`, children: "All" }),
        categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
          to: "/search",
          search: {
            q,
            c: cat.slug
          }
        }), className: `rounded-full border px-3 py-1 text-xs ${c === cat.slug ? "border-primary bg-primary/10 text-primary" : "border-border bg-white"}`, children: [
          cat.emoji,
          " ",
          cat.name
        ] }, cat.slug))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 card-elev rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "No exact match? Generate one" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-semibold", children: [
              'Create an AI guide for "',
              q,
              '"'
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Takes ~5 seconds. The guide is saved and shareable." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => create.mutate(), disabled: create.isPending, className: "inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60", children: create.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            " Generating…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Generate ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }) })
        ] }),
        create.isError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-xs text-destructive", children: create.error.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Existing guides" }),
        results.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-elev h-20 animate-pulse rounded-2xl" }, i)) }) : results.data && results.data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: results.data.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/guide/$id", params: {
          id: g.id
        }, className: "card-elev block rounded-2xl p-4 transition hover:-translate-y-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
              g.category,
              " · ",
              g.difficulty,
              " · ",
              g.time_minutes,
              " min"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate font-semibold", children: g.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 line-clamp-2 text-sm text-muted-foreground", children: g.summary })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "mt-1 h-4 w-4 shrink-0 text-muted-foreground" })
        ] }) }) }, g.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-elev rounded-2xl p-5 text-sm text-muted-foreground", children: "No saved guides match yet. Generate one above to create the first." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  SearchPage as component
};

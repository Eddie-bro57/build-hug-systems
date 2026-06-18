import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery, a as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useAuth, T as TopBar, B as BottomNav, b as awardXp, d as checkAchievements } from "./BottomNav-qq3EU_oa.mjs";
import { s as supabase } from "./client-Cb98OQ8D.mjs";
import { c as categories } from "./router-B1HhPp6z.mjs";
import "../_libs/seroval.mjs";
import { X, P as Plus, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60);
}
function NewPath() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState(categories[0]?.name ?? "DIY");
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState([]);
  const guideOptions = useQuery({
    queryKey: ["all-guides-for-path", search],
    queryFn: async () => {
      let q = supabase.from("guides").select("id, title, category").eq("is_published", true).limit(40);
      if (search.trim()) q = q.ilike("title", `%${search.trim()}%`);
      const {
        data,
        error
      } = await q;
      if (error) throw error;
      return data ?? [];
    }
  });
  const create = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required");
      if (!title.trim() || !description.trim()) throw new Error("Title and description required");
      if (selected.length === 0) throw new Error("Add at least one guide");
      const base = slugify(title);
      const slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
      const {
        data,
        error
      } = await supabase.from("learning_paths").insert({
        slug,
        title: title.trim(),
        description: description.trim(),
        category,
        guide_ids: selected.map((g) => g.id),
        creator_id: user.id,
        is_published: true
      }).select("slug").single();
      if (error) throw error;
      await awardXp(50, category);
      await checkAchievements(user.id);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Path published");
      navigate({
        to: "/path/$slug",
        params: {
          slug: data.slug
        }
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const selectedIds = reactExports.useMemo(() => new Set(selected.map((g) => g.id)), [selected]);
  if (loading) return null;
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-20 md:pb-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Sign in to create a path" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Use the Sign up button in the top bar to get started." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-20 md:pb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-5 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold tracking-tight", children: "New learning path" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Bundle existing guides into a journey for other learners." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elev mt-6 space-y-4 rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), maxLength: 120, placeholder: "e.g. Cook 5 weeknight dinners from scratch", className: "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 3, maxLength: 400, placeholder: "What will learners be able to do after finishing this path?", className: "w-full resize-none rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.name, children: [
          c.emoji,
          " ",
          c.name
        ] }, c.slug)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elev mt-6 rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: [
          "Guides in this path (",
          selected.length,
          ")"
        ] }),
        selected.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-3 space-y-2", children: selected.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary", children: [
            i + 1,
            "."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate", children: g.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelected((s) => s.filter((x) => x.id !== g.id)), className: "text-muted-foreground hover:text-destructive", "aria-label": "Remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }, g.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Pick guides from the list below." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search guides to add…", className: "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 max-h-72 space-y-1.5 overflow-y-auto", children: [
            (guideOptions.data ?? []).map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: selectedIds.has(g.id), onClick: () => setSelected((s) => [...s, {
              id: g.id,
              title: g.title
            }]), className: "flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0 truncate", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: g.category }),
                " ",
                "· ",
                g.title
              ] }),
              selectedIds.has(g.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Added" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-primary" })
            ] }) }, g.id)),
            guideOptions.data && guideOptions.data.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-center text-xs text-muted-foreground", children: "No matching guides." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: create.isPending, onClick: () => create.mutate(), className: "mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60", children: create.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Publish path" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    children
  ] });
}
export {
  NewPath as component
};

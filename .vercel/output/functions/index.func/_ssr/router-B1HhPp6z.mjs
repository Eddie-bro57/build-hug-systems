import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { I as notFound } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-Cb98OQ8D.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-zOS-_LmS.css";
const logo = "/assets/logo-WoBtrJHm.png";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$9 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DoGuide — Learn any practical skill, step by step" },
      {
        name: "description",
        content: "DoGuide is an AI-powered practical skills platform. Search any task, follow clear steps, watch a video, and ask AI when you get stuck."
      },
      { property: "og:title", content: "DoGuide — Learn any practical skill" },
      { property: "og:description", content: "AI-powered, step-by-step guides for cooking, DIY, fitness, music, tech and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "icon",
        type: "image/png",
        href: logo
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$9.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true })
  ] });
}
const $$splitComponentImporter$8 = () => import("./search-vRBRJ0_J.mjs");
const searchSchema = objectType({
  q: stringType().min(1),
  c: stringType().optional()
});
const Route$8 = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: ({
    match
  }) => ({
    meta: [{
      title: `Search: ${match.search.q} — DoGuide`
    }, {
      name: "description",
      content: `DoGuide search results for "${match.search.q}".`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./profile-CyB-9rw4.mjs");
const Route$7 = createFileRoute("/profile")({
  head: () => ({
    meta: [{
      title: "My profile — DoGuide"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./index-C2zhvBbs.mjs");
const Route$6 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "DoGuide — Learn any practical skill, step by step"
    }, {
      name: "description",
      content: "AI-powered, step-by-step practical guides for cooking, DIY, fitness, music, tech and more."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitNotFoundComponentImporter$4 = () => import("./paths.index-B3LeezL6.mjs");
const $$splitErrorComponentImporter$2 = () => import("./paths.index-BVdIPtT0.mjs");
const $$splitComponentImporter$5 = () => import("./paths.index-cLpiJHOE.mjs");
const Route$5 = createFileRoute("/paths/")({
  head: () => ({
    meta: [{
      title: "Learning paths — DoGuide"
    }, {
      name: "description",
      content: "Curated learning paths to master a skill end-to-end."
    }]
  }),
  loader: async () => {
    const {
      data,
      error
    } = await supabase.from("learning_paths").select("id, slug, title, description, category, guide_ids, creator_id").eq("is_published", true).order("created_at", {
      ascending: false
    }).limit(50);
    if (error) throw error;
    return {
      paths: data ?? []
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$4, "notFoundComponent")
});
const $$splitComponentImporter$4 = () => import("./paths.new-D0qzWDl1.mjs");
const Route$4 = createFileRoute("/paths/new")({
  head: () => ({
    meta: [{
      title: "Create a learning path — DoGuide"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitErrorComponentImporter$1 = () => import("./path._slug-BVdIPtT0.mjs");
const $$splitNotFoundComponentImporter$3 = () => import("./path._slug-BY5lX1Lq.mjs");
const $$splitComponentImporter$3 = () => import("./path._slug-DeZAHVBp.mjs");
const Route$3 = createFileRoute("/path/$slug")({
  loader: async ({
    params
  }) => {
    const {
      data: path,
      error
    } = await supabase.from("learning_paths").select("id, slug, title, description, category, guide_ids, creator_id").eq("slug", params.slug).maybeSingle();
    if (error) throw error;
    if (!path) throw notFound();
    const ids = Array.isArray(path.guide_ids) ? path.guide_ids : [];
    let guides = [];
    if (ids.length > 0) {
      const {
        data: gs
      } = await supabase.from("guides").select("id, title, summary, category, difficulty, time_minutes").in("id", ids);
      const map = new Map((gs ?? []).map((g) => [g.id, g]));
      guides = ids.map((id) => map.get(id)).filter(Boolean);
    }
    let creator = null;
    if (path.creator_id) {
      const {
        data: c
      } = await supabase.from("profiles").select("handle, display_name").eq("id", path.creator_id).maybeSingle();
      creator = c;
    }
    return {
      path,
      guides,
      creator
    };
  },
  head: ({
    loaderData
  }) => loaderData ? {
    meta: [{
      title: `${loaderData.path.title} — Learning path`
    }, {
      name: "description",
      content: loaderData.path.description
    }]
  } : {
    meta: []
  },
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$3, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
const $$splitNotFoundComponentImporter$2 = () => import("./guide._id-Ch6ooa8e.mjs");
const $$splitComponentImporter$2 = () => import("./guide._id-DlUR1Hru.mjs");
const Route$2 = createFileRoute("/guide/$id")({
  loader: async ({
    params
  }) => {
    const {
      data,
      error
    } = await supabase.from("guides").select("*").eq("id", params.id).maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return {
      guide: data
    };
  },
  head: ({
    loaderData
  }) => loaderData ? {
    meta: [{
      title: `${loaderData.guide.title} — DoGuide`
    }, {
      name: "description",
      content: loaderData.guide.summary
    }, {
      property: "og:title",
      content: loaderData.guide.title
    }, {
      property: "og:description",
      content: loaderData.guide.summary
    }]
  } : {
    meta: []
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent")
});
const $$splitErrorComponentImporter = () => import("./creator._handle-BVdIPtT0.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("./creator._handle-DtD1vB6t.mjs");
const $$splitComponentImporter$1 = () => import("./creator._handle-HMG7Msf5.mjs");
const Route$1 = createFileRoute("/creator/$handle")({
  loader: async ({
    params
  }) => {
    const {
      data: profile,
      error
    } = await supabase.from("profiles").select("id, display_name, handle, bio, avatar_url, xp, level, streak_days, reputation").eq("handle", params.handle).maybeSingle();
    if (error) throw error;
    if (!profile) throw notFound();
    const [guidesRes, pathsRes, achievementsRes, skillsRes] = await Promise.all([supabase.from("guides").select("id, title, summary, category, difficulty, time_minutes").eq("author_id", profile.id).eq("is_published", true).order("created_at", {
      ascending: false
    }).limit(20), supabase.from("learning_paths").select("id, slug, title, description, category").eq("creator_id", profile.id).eq("is_published", true).order("created_at", {
      ascending: false
    }).limit(20), supabase.from("user_achievements").select("unlocked_at, achievement:achievements(code, title, description, icon, xp_reward)").eq("user_id", profile.id).order("unlocked_at", {
      ascending: false
    }), supabase.from("skill_levels").select("category, xp, level").eq("user_id", profile.id).order("xp", {
      ascending: false
    })]);
    return {
      profile,
      guides: guidesRes.data ?? [],
      paths: pathsRes.data ?? [],
      achievements: achievementsRes.data ?? [],
      skills: skillsRes.data ?? []
    };
  },
  head: ({
    loaderData
  }) => loaderData ? {
    meta: [{
      title: `${loaderData.profile.display_name ?? loaderData.profile.handle} — DoGuide creator`
    }, {
      name: "description",
      content: loaderData.profile.bio ?? `Guides and learning paths by @${loaderData.profile.handle}`
    }]
  } : {
    meta: []
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const categories = [
  {
    slug: "food",
    name: "Food & Cooking",
    emoji: "🍳",
    image: "/categories/food.jpg",
    description: "Recipes, techniques, and kitchen know-how.",
    examples: ["Bake banana bread", "Cook jollof rice", "Make sourdough starter"],
    gradient: "from-[#ffb86b] to-[#ff6f61]"
  },
  {
    slug: "home",
    name: "DIY & Home",
    emoji: "🔧",
    image: "/categories/home.jpg",
    description: "Fix it, build it, clean it.",
    examples: ["Unclog a drain", "Paint a wall", "Hang a picture frame"],
    gradient: "from-[#f59e0b] to-[#b45309]"
  },
  {
    slug: "sports",
    name: "Sports & Fitness",
    emoji: "⚽",
    image: "/categories/sports.jpg",
    description: "Train, play, and improve your game.",
    examples: ["Do a proper push-up", "Dribble a basketball", "Start running 5K"],
    gradient: "from-[#34d399] to-[#059669]"
  },
  {
    slug: "music",
    name: "Music",
    emoji: "🎵",
    image: "/categories/music.jpg",
    description: "Play instruments, sing, and produce sound.",
    examples: ["Read sheet music", "Tune a guitar", "Make a beat in FL Studio"],
    gradient: "from-[#a78bfa] to-[#6366f1]"
  },
  {
    slug: "tech",
    name: "Technology",
    emoji: "💻",
    image: "/categories/tech.jpg",
    description: "Software, gadgets, and digital skills.",
    examples: ["Build a website", "Set up a VPN", "Reset a router"],
    gradient: "from-[#60a5fa] to-[#2563eb]"
  },
  {
    slug: "health",
    name: "Health & Wellness",
    emoji: "🩺",
    image: "/categories/health.jpg",
    description: "Care for your body and mind with expert-backed steps.",
    examples: ["Do yoga for beginners", "Meal prep for the week", "Improve your posture"],
    gradient: "from-[#14b8a6] to-[#0f766e]"
  },
  {
    slug: "art",
    name: "Creative Arts",
    emoji: "🎨",
    image: "/categories/art.jpg",
    description: "Create, draw, paint, and make things by hand.",
    examples: ["Mix watercolors", "Crochet a scarf", "Make pottery at home"],
    gradient: "from-[#f43f5e] to-[#be185d]"
  },
  {
    slug: "travel",
    name: "Travel & Lifestyle",
    emoji: "✈️",
    image: "/categories/travel.jpg",
    description: "Plan trips, build habits, navigate the world.",
    examples: ["Apply for a passport", "Book a cheap flight", "Start a morning routine"],
    gradient: "from-[#22d3ee] to-[#0891b2]"
  }
];
const getCategory = (slug) => categories.find((c) => c.slug === slug);
const $$splitNotFoundComponentImporter = () => import("./category._slug-DbrIZCh6.mjs");
const $$splitComponentImporter = () => import("./category._slug-C5zQ0Sjc.mjs");
const Route = createFileRoute("/category/$slug")({
  loader: ({
    params
  }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return {
      category
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: loaderData ? [{
      title: `${loaderData.category.name} — DoGuide`
    }, {
      name: "description",
      content: `Step-by-step ${loaderData.category.name.toLowerCase()} guides on DoGuide. ${loaderData.category.description}`
    }] : []
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const SearchRoute = Route$8.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => Route$9
});
const ProfileRoute = Route$7.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$9
});
const IndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$9
});
const PathsIndexRoute = Route$5.update({
  id: "/paths/",
  path: "/paths/",
  getParentRoute: () => Route$9
});
const PathsNewRoute = Route$4.update({
  id: "/paths/new",
  path: "/paths/new",
  getParentRoute: () => Route$9
});
const PathSlugRoute = Route$3.update({
  id: "/path/$slug",
  path: "/path/$slug",
  getParentRoute: () => Route$9
});
const GuideIdRoute = Route$2.update({
  id: "/guide/$id",
  path: "/guide/$id",
  getParentRoute: () => Route$9
});
const CreatorHandleRoute = Route$1.update({
  id: "/creator/$handle",
  path: "/creator/$handle",
  getParentRoute: () => Route$9
});
const CategorySlugRoute = Route.update({
  id: "/category/$slug",
  path: "/category/$slug",
  getParentRoute: () => Route$9
});
const rootRouteChildren = {
  IndexRoute,
  ProfileRoute,
  SearchRoute,
  CategorySlugRoute,
  CreatorHandleRoute,
  GuideIdRoute,
  PathSlugRoute,
  PathsNewRoute,
  PathsIndexRoute
};
const routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$8 as R,
  Route$5 as a,
  Route$3 as b,
  categories as c,
  Route$2 as d,
  Route$1 as e,
  Route as f,
  router as r
};

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, Heart, PlayCircle, Sparkles } from "lucide-react";
import { categories, getCategory } from "@/lib/categories";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { useFavorites, useRecents } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DoGuide — Step-by-step guides for almost anything" },
      {
        name: "description",
        content:
          "DoGuide gives you clear, easy-to-follow steps for any task — from cooking to coding — plus a video guide when you need it.",
      },
      { property: "og:title", content: "DoGuide — Learn anything, step by step" },
      { property: "og:description", content: "Clear, friendly, step-by-step guides for any task." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-10 md:pt-20 md:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered, beginner-friendly
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
            How do you want to{" "}
            <span className="bg-gradient-to-r from-[#ff6f61] via-[#f59e0b] to-[#6366f1] bg-clip-text text-transparent">
              do it
            </span>
            ?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            Pick a category or just type a task. DoGuide gives you clear,
            step-by-step instructions — with a video guide when you want one.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar size="lg" placeholder="e.g. How do I bake banana bread?" />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Try:</span>
              {["Tune a guitar", "Write a CV", "Unclog a drain", "Cook jollof rice"].map((s) => (
                <Link
                  key={s}
                  to="/guide"
                  search={{ q: s }}
                  className="rounded-full border border-border bg-white/60 px-3 py-1 hover:bg-white"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RecentAndSaved />

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Browse categories</h2>
            <p className="text-sm text-muted-foreground">Pick a category to explore guides.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white/70 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                  width={512}
                  height={512}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4 text-2xl font-bold text-white drop-shadow-md">
                  {c.name}
                </div>
              </div>
              <div className="p-5">
                <div className="text-2xl">{c.emoji}</div>
                <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {c.description}
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="card-elev rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <BookOpen className="h-5 w-5" />,
                title: "1. Pick or search",
                body: "Choose a category from the home page, or type your task in the search box.",
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "2. Get clear steps",
                body: "DoGuide generates a friendly, ordered guide with materials, tips, and timing.",
              },
              {
                icon: <PlayCircle className="h-5 w-5" />,
                title: "3. Watch a video",
                body: "Need a visual? Open the matched YouTube video right alongside the steps.",
              },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-white/60 p-5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  {s.icon}
                </div>
                <div className="mt-3 font-semibold">{s.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        Built with DoGuide — your friendly step-by-step companion.
      </footer>
    </div>
  );
}

function RecentAndSaved() {
  const { recents, clear } = useRecents();
  const { favorites } = useFavorites();
  if (recents.length === 0 && favorites.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-6">
      <div className="grid gap-6 md:grid-cols-2">
        {recents.length > 0 && (
          <div className="card-elev rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Clock className="h-4 w-4" /> Recent
              </h3>
              <button
                onClick={clear}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
            <ul className="space-y-2">
              {recents.slice(0, 5).map((r) => {
                const cat = r.c ? getCategory(r.c) : undefined;
                return (
                  <li key={`${r.q}|${r.c ?? ""}`}>
                    <Link
                      to="/guide"
                      search={{ q: r.q, ...(r.c ? { c: r.c } : {}) }}
                      className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2 hover:bg-muted"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{r.title ?? r.q}</div>
                        {cat && (
                          <div className="text-xs text-muted-foreground">
                            {cat.emoji} {cat.name}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {favorites.length > 0 && (
          <div className="card-elev rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Heart className="h-4 w-4 text-rose-500" /> Saved
              </h3>
              <Link to="/saved" className="text-xs text-primary hover:underline">
                See all
              </Link>
            </div>
            <ul className="space-y-2">
              {favorites.slice(0, 5).map((f) => (
                <li key={`${f.q}|${f.c ?? ""}`}>
                  <Link
                    to="/guide"
                    search={{ q: f.q, ...(f.c ? { c: f.c } : {}) }}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 hover:bg-muted"
                  >
                    <div className="truncate text-sm font-medium">{f.title ?? f.q}</div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

// keep X import used (suppress unused) — re-export type for tree shaking
export const _unused = X;


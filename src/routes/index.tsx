import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, PlayCircle, Sparkles } from "lucide-react";
import { categories } from "@/lib/categories";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";

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
              className="group relative overflow-hidden rounded-2xl border border-border bg-white/70 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${c.gradient} opacity-20 transition group-hover:opacity-40`}
              />
              <div className="relative">
                <div className="text-4xl">{c.emoji}</div>
                <div className="mt-3 text-base font-semibold">{c.name}</div>
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

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Compass, Flame, Route as RouteIcon, Sparkles, Target, TrendingUp } from "lucide-react";
import { type FormEvent, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { categories } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DoGuide — Learn any practical skill, step by step" },
      {
        name: "description",
        content:
          "AI-powered, step-by-step practical guides for cooking, DIY, fitness, music, tech and more.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const trending = useQuery({
    queryKey: ["trending-guides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("id, slug, title, summary, category, time_minutes, difficulty, views")
        .eq("is_published", true)
        .order("views", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    navigate({ to: "/search", search: { q: v } });
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopBar showSearch={false} />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-10 pb-8 md:pt-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered practical skills platform
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
            Learn anything,{" "}
            <span className="bg-gradient-to-r from-[#ff6f61] via-[#f59e0b] to-[#6366f1] bg-clip-text text-transparent">
              do anything
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Step-by-step guides for any task — with video, AI help, and progress tracking.
          </p>

          <form onSubmit={onSubmit} className="mx-auto mt-7 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-white p-2 shadow-md">
            <Sparkles className="ml-3 h-5 w-5 text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. How do I bake banana bread?"
              className="flex-1 bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground md:text-lg"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Guide me <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Try:</span>
            {["Tune a guitar", "Write a CV", "Unclog a drain", "Cook jollof rice"].map((s) => (
              <Link
                key={s}
                to="/search"
                search={{ q: s }}
                className="rounded-full border border-border bg-white/60 px-3 py-1 hover:bg-white"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Daily challenge */}
      <section className="mx-auto max-w-5xl px-5 pb-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#fff7ed] via-white to-[#eff6ff] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <Target className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Today's challenge
              </div>
              <div className="mt-1 text-lg font-bold md:text-xl">Learn one new practical skill in 15 minutes</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick something small you've been putting off. Knife skills, a chord change, a
                terminal command — anything counts.
              </p>
              <div className="mt-3">
                <Link
                  to="/search"
                  search={{ q: "Quick 15-minute skill to learn today" }}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Find me a guide <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-5xl px-5 py-6">
        <SectionHeader icon={<TrendingUp className="h-4 w-4" />} title="Trending guides" />
        {trending.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-elev h-28 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : trending.data && trending.data.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trending.data.map((g) => (
              <Link
                key={g.id}
                to="/guide/$id"
                params={{ id: g.id }}
                className="card-elev group rounded-2xl p-4 transition hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Flame className="h-3 w-3 text-rose-500" /> {g.category}
                </div>
                <div className="mt-1 line-clamp-2 font-semibold">{g.title}</div>
                <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">{g.summary}</div>
                <div className="mt-3 text-[11px] font-medium text-muted-foreground">
                  {g.difficulty} · {g.time_minutes} min
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card-elev rounded-2xl p-6 text-sm text-muted-foreground">
            No trending guides yet — be the first to generate one above.
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-5 py-6">
        <SectionHeader icon={<Compass className="h-4 w-4" />} title="Browse categories" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative h-28 w-full overflow-hidden md:h-32">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute bottom-2 left-3 text-sm font-bold text-white drop-shadow md:text-base">
                  {c.emoji} {c.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl border-t border-border/60 px-5 py-8 text-center text-xs text-muted-foreground">
        DoGuide — practical skills, one step at a time.
      </footer>

      <BottomNav />
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h2 className="text-lg font-bold tracking-tight md:text-xl">{title}</h2>
    </div>
  );
}

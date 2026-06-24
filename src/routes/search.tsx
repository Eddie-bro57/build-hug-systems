import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { generateGuide, searchGuides } from "@/lib/guides.functions";
import { categories } from "@/lib/categories";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";

const searchSchema = z.object({
  q: z.string().min(1),
  c: z.string().optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: ({ match }) => ({
    meta: [
      { title: `Search: ${match.search.q} — DoGuide` },
      { name: "description", content: `DoGuide search results for "${match.search.q}".` },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q, c } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(q);
  const callGenerate = useServerFn(generateGuide);
  const callSearch = useServerFn(searchGuides);
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const results = useQuery({
    queryKey: ["search", q, c ?? ""],
    queryFn: async () => {
      const out = await callSearch({ data: { query: q, category: c } });
      return out;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const out = await callGenerate({ data: { query: q, category: c } });
      return out;
    },
    onSuccess: (out) => {
      if (out?.id) navigate({ to: "/guide/$id", params: { id: out.id } });
    },
  });

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopBar showSearch={false} />
      <section className="mx-auto max-w-3xl px-5 py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = query.trim();
            if (v) navigate({ to: "/search", search: { q: v, ...(c ? { c } : {}) } });
          }}
          className="flex items-center gap-2 rounded-2xl border border-border bg-white p-2 shadow-sm"
        >
          <Sparkles className="ml-2 h-5 w-5 text-primary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any task…"
            className="flex-1 bg-transparent py-2 text-base outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Search
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => navigate({ to: "/search", search: { q } })}
            className={`rounded-full border px-3 py-1 text-xs ${!c ? "border-primary bg-primary/10 text-primary" : "border-border bg-white"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => navigate({ to: "/search", search: { q, c: cat.slug } })}
              className={`rounded-full border px-3 py-1 text-xs ${c === cat.slug ? "border-primary bg-primary/10 text-primary" : "border-border bg-white"}`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-6 card-elev rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                No exact match? Generate one
              </div>
              <div className="mt-1 font-semibold">Create an AI guide for "{q}"</div>
              <div className="text-xs text-muted-foreground">
                Takes ~5 seconds. The guide is saved and shareable.
              </div>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  setAuthOpen(true);
                  return;
                }
                create.mutate();
              }}
              disabled={create.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {create.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  Generate <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          {create.isError && (
            <div className="mt-3 text-xs text-destructive">{(create.error as Error).message}</div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Existing guides
          </h2>
          {results.isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-elev h-20 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : results.data && results.data.length > 0 ? (
            <ul className="space-y-2">
              {results.data.map((g) => (
                <li key={g.id}>
                  <Link
                    to="/guide/$id"
                    params={{ id: g.id }}
                    className="card-elev block rounded-2xl p-4 transition hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          {g.category} · {g.difficulty} · {g.time_minutes} min
                        </div>
                        <div className="mt-1 truncate font-semibold">{g.title}</div>
                        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {g.summary}
                        </div>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card-elev rounded-2xl p-5 text-sm text-muted-foreground">
              No saved guides match yet. Generate one above to create the first.
            </div>
          )}
        </div>
      </section>
      <BottomNav />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode="signin" />
    </div>
  );
}

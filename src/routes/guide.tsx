import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  ArrowLeft,
  Clock,
  Gauge,
  Lightbulb,
  ListChecks,
  PlayCircle,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { generateGuide } from "@/lib/guides.functions";
import { getCategory } from "@/lib/categories";

const searchSchema = z.object({
  q: z.string().min(1),
  c: z.string().optional(),
});

export const Route = createFileRoute("/guide")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Guide — DoGuide" },
      { name: "description", content: "Step-by-step guides on DoGuide." },
    ],
  }),
  component: GuidePage,
});

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-rose-100 text-rose-700",
};

function GuidePage() {
  const { q, c } = Route.useSearch();
  const router = useRouter();
  const category = c ? getCategory(c) : undefined;
  const callGenerate = useServerFn(generateGuide);

  const query = useQuery({
    queryKey: ["guide", q, c ?? ""],
    queryFn: () => callGenerate({ data: { query: q, category: category?.name } }),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const guide = query.data;
  const videoUrl = guide
    ? `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(guide.video_query)}`
    : null;

  return (
    <div>
      <Header />
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between">
          <Link
            to={category ? "/category/$slug" : "/"}
            params={category ? { slug: category.slug } : undefined}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back{category ? ` to ${category.name}` : ""}
          </Link>
          {category && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              {category.emoji} {category.name}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
          {guide ? guide.title : `How to: ${q}`}
        </h1>

        <div className="mt-5">
          <SearchBar placeholder="Ask DoGuide something else…" category={c} />
        </div>

        {query.isLoading && <LoadingSkeleton query={q} />}

        {query.isError && (
          <div className="card-elev mt-8 rounded-2xl p-6">
            <div className="text-sm font-semibold text-destructive">
              We couldn't generate this guide.
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {(query.error as Error)?.message ?? "Something went wrong."}
            </p>
            <button
              onClick={() => query.refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </div>
        )}

        {guide && (
          <>
            <p className="mt-3 max-w-2xl text-muted-foreground">{guide.summary}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium ${
                  difficultyColor[guide.difficulty] ?? "bg-muted text-foreground"
                }`}
              >
                <Gauge className="h-3.5 w-3.5" /> {guide.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium">
                <Clock className="h-3.5 w-3.5" /> {guide.time_estimate}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium">
                <ListChecks className="h-3.5 w-3.5" /> {guide.steps.length} steps
              </span>
            </div>

            {guide.materials.length > 0 && (
              <div className="card-elev mt-8 rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  What you'll need
                </h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {guide.materials.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Steps</h2>
              <ol className="mt-4 space-y-3">
                {guide.steps.map((s, i) => (
                  <li key={i} className="card-elev rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{s.title}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {guide.tips.length > 0 && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <div className="flex items-center gap-2 text-amber-800">
                  <Lightbulb className="h-4 w-4" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Tips</h2>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-amber-900">
                  {guide.tips.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span>•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {videoUrl && (
              <div className="mt-8">
                <div className="mb-3 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold tracking-tight">Video guide</h2>
                </div>
                <div className="card-elev overflow-hidden rounded-2xl">
                  <div className="relative aspect-video w-full bg-black">
                    <iframe
                      key={videoUrl}
                      src={videoUrl}
                      title={`Video guide for ${guide.title}`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(guide.video_query)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex text-sm text-primary hover:underline"
                >
                  Open more videos on YouTube →
                </a>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  query.refetch();
                  router.invalidate();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                <RefreshCw className="h-4 w-4" /> Regenerate
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Browse more categories
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function LoadingSkeleton({ query }: { query: string }) {
  return (
    <div className="mt-8 space-y-4">
      <div className="card-elev rounded-2xl p-6">
        <div className="text-sm font-medium text-muted-foreground">
          DoGuide is preparing your step-by-step guide for{" "}
          <span className="text-foreground">"{query}"</span>…
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card-elev flex items-start gap-4 rounded-2xl p-5">
          <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

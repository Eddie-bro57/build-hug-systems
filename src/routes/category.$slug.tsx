import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { categories, getCategory } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} — DoGuide` },
          {
            name: "description",
            content: `Step-by-step ${loaderData.category.name.toLowerCase()} guides on DoGuide. ${loaderData.category.description}`,
          },
        ]
      : [],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Category not found.</div>
  ),
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const guides = useQuery({
    queryKey: ["guides-by-cat", category.slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("id, title, summary, difficulty, time_minutes")
        .eq("is_published", true)
        .eq("category", category.slug)
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopBar />
      <section className="mx-auto max-w-4xl px-5 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All categories
        </Link>

        <div
          className={`mt-5 overflow-hidden rounded-3xl bg-gradient-to-br ${category.gradient} p-7 text-white shadow-lg`}
        >
          <div className="text-5xl">{category.emoji}</div>
          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">{category.name}</h1>
          <p className="mt-2 max-w-lg text-white/90">{category.description}</p>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Popular searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {category.examples.map((ex: string) => (
              <Link
                key={ex}
                to="/search"
                search={{ q: ex, c: category.slug }}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-sm hover:bg-muted"
              >
                {ex}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Guides in this category
          </h2>
          {guides.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : guides.data && guides.data.length > 0 ? (
            <ul className="space-y-2">
              {guides.data.map((g) => (
                <li key={g.id}>
                  <Link
                    to="/guide/$id"
                    params={{ id: g.id }}
                    className="card-elev block rounded-2xl p-4 transition hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          {g.difficulty} · {g.time_minutes} min
                        </div>
                        <div className="mt-1 truncate font-semibold">{g.title}</div>
                        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {g.summary}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card-elev rounded-2xl p-5 text-sm text-muted-foreground">
              No guides yet in {category.name}.{" "}
              <Link
                to="/search"
                search={{ q: `Beginner ${category.name.toLowerCase()} skill`, c: category.slug }}
                className="text-primary hover:underline"
              >
                Generate the first one →
              </Link>
            </div>
          )}
        </div>

        <div className="mt-10">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Other categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-sm hover:bg-muted"
                >
                  <span className="mr-1">{c.emoji}</span> {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
      <BottomNav />
    </div>
  );
}

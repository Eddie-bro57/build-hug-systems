import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { categories, getCategory } from "@/lib/categories";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";

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

  return (
    <div>
      <Header />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All categories
        </Link>

        <div
          className={`mt-6 overflow-hidden rounded-3xl bg-gradient-to-br ${category.gradient} p-8 text-white shadow-lg`}
        >
          <div className="text-6xl">{category.emoji}</div>
          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">{category.name}</h1>
          <p className="mt-2 max-w-lg text-white/90">{category.description}</p>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Search in {category.name}
          </h2>
          <SearchBar
            size="lg"
            category={category.slug}
            placeholder={`Search ${category.name.toLowerCase()}…`}
          />
        </div>

        <div className="mt-10">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Popular in this category
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {category.examples.map((ex: string) => (
              <Link
                key={ex}
                to="/guide"
                search={{ q: ex, c: category.slug }}
                className="card-elev rounded-2xl p-4 text-left transition hover:-translate-y-0.5"
              >
                <div className="font-medium">{ex}</div>
                <div className="mt-1 text-xs text-muted-foreground">Tap to get step-by-step instructions</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
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
                  className="rounded-full border border-border bg-white/70 px-3 py-1.5 text-sm hover:bg-white"
                >
                  <span className="mr-1">{c.emoji}</span> {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

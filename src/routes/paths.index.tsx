import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Route as RouteIcon } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/paths/")({
  head: () => ({
    meta: [
      { title: "Learning paths — DoGuide" },
      { name: "description", content: "Curated learning paths to master a skill end-to-end." },
    ],
  }),
  loader: async () => {
    const { data, error } = await supabase
      .from("learning_paths")
      .select("id, slug, title, description, category, guide_ids, creator_id")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return { paths: data ?? [] };
  },
  component: PathsIndex,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">No paths.</div>,
});

function PathsIndex() {
  const { paths } = Route.useLoaderData();
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopBar />
      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Learning paths</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Curated journeys to master a skill — multiple guides, one goal.
            </p>
          </div>
          <Link
            to="/paths/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New path
          </Link>
        </div>

        {paths.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No learning paths yet. Be the first to publish one.
          </div>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(paths as Array<{ id: string; slug: string; title: string; description: string; category: string; guide_ids: unknown }>).map((p) => (
              <li key={p.id}>
                <Link
                  to="/path/$slug"
                  params={{ slug: p.slug }}
                  className="card-elev block rounded-2xl p-5 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <RouteIcon className="h-3.5 w-3.5 text-primary" /> {p.category}
                  </div>
                  <div className="mt-2 font-bold">{p.title}</div>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-3 text-[11px] font-medium text-muted-foreground">
                    {Array.isArray(p.guide_ids) ? p.guide_ids.length : 0} guides
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <BottomNav />
    </div>
  );
}

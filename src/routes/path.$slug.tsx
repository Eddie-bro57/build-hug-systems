import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Route as RouteIcon, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { UnauthenticatedBlock } from "@/components/UnauthenticatedBlock";

export const Route = createFileRoute("/path/$slug")({
  loader: async ({ params }) => {
    const { data: path, error } = await supabase
      .from("learning_paths")
      .select("id, slug, title, description, category, guide_ids, creator_id")
      .eq("slug", params.slug)
      .maybeSingle();
    if (error) throw error;
    if (!path) throw notFound();

    const ids = Array.isArray(path.guide_ids) ? (path.guide_ids as string[]) : [];
    let guides: Array<{ id: string; title: string; summary: string; category: string; difficulty: string; time_minutes: number }> = [];
    if (ids.length > 0) {
      const { data: gs } = await supabase
        .from("guides")
        .select("id, title, summary, category, difficulty, time_minutes")
        .in("id", ids);
      // preserve order from guide_ids
      const map = new Map((gs ?? []).map((g) => [g.id, g]));
      guides = ids.map((id) => map.get(id)).filter(Boolean) as typeof guides;
    }

    let creator: { handle: string | null; display_name: string | null } | null = null;
    if (path.creator_id) {
      const { data: c } = await supabase
        .from("profiles")
        .select("handle, display_name")
        .eq("id", path.creator_id)
        .maybeSingle();
      creator = c;
    }

    return { path, guides, creator };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.path.title} — Learning path` },
            { name: "description", content: loaderData.path.description },
          ],
        }
      : { meta: [] },
  component: PathPage,
  notFoundComponent: () => <div className="p-10 text-center">Path not found.</div>,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

function PathPage() {
  const { path, guides, creator } = Route.useLoaderData();
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <TopBar />
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <TopBar />
        <section className="mx-auto max-w-3xl px-5 py-8">
          <Link
            to="/paths"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Paths
          </Link>
          <UnauthenticatedBlock
            title="Unlock Learning Path"
            description="Sign in to explore structured learning journeys, follow guides end-to-end to master complex skills, and track your progress."
            onSignIn={() => setAuthOpen(true)}
          />
        </section>
        <BottomNav />
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode="signin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopBar />
      <section className="mx-auto max-w-3xl px-5 py-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <RouteIcon className="h-3.5 w-3.5 text-primary" /> {path.category} · Learning path
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{path.title}</h1>
        <p className="mt-2 text-muted-foreground">{path.description}</p>
        {creator?.handle && (
          <p className="mt-1 text-sm">
            by{" "}
            <Link to="/creator/$handle" params={{ handle: creator.handle }} className="font-medium text-primary hover:underline">
              @{creator.handle}
            </Link>
          </p>
        )}

        <ol className="mt-6 space-y-3">
          {guides.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              This path has no guides yet.
            </li>
          )}
          {(guides as Array<{ id: string; title: string; summary: string; category: string; difficulty: string; time_minutes: number }>).map((g, i: number) => (
            <li key={g.id}>
              <Link
                to="/guide/$id"
                params={{ id: g.id }}
                className="card-elev flex items-start gap-4 rounded-2xl p-4 hover:-translate-y-0.5"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {g.category} · {g.difficulty} · {g.time_minutes} min
                  </div>
                  <div className="mt-0.5 font-semibold">{g.title}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{g.summary}</div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <BottomNav />
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { categories } from "@/lib/categories";
import { awardXp, checkAchievements } from "@/lib/gamification";
import { AuthModal } from "@/components/AuthModal";
import { UnauthenticatedBlock } from "@/components/UnauthenticatedBlock";

export const Route = createFileRoute("/paths/new")({
  head: () => ({
    meta: [{ title: "Create a learning path — DoGuide" }],
  }),
  component: NewPath,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function NewPath() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]?.name ?? "DIY");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Array<{ id: string; title: string }>>([]);

  const guideOptions = useQuery({
    queryKey: ["all-guides-for-path", search],
    queryFn: async () => {
      let q = supabase.from("guides").select("id, title, category").eq("is_published", true).limit(40);
      if (search.trim()) q = q.ilike("title", `%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required");
      if (!title.trim() || !description.trim()) throw new Error("Title and description required");
      if (selected.length === 0) throw new Error("Add at least one guide");
      const base = slugify(title);
      const slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
      const { data, error } = await supabase
        .from("learning_paths")
        .insert({
          slug,
          title: title.trim(),
          description: description.trim(),
          category,
          guide_ids: selected.map((g) => g.id),
          creator_id: user.id,
          is_published: true,
        })
        .select("slug")
        .single();
      if (error) throw error;
      await awardXp(50, category);
      await checkAchievements(user.id);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Path published");
      navigate({ to: "/path/$slug", params: { slug: data.slug } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const selectedIds = useMemo(() => new Set(selected.map((g) => g.id)), [selected]);

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
          <UnauthenticatedBlock
            title="Unlock Path Creation"
            description="Sign in to create, curate, and share custom learning paths with the community."
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
        <h1 className="text-3xl font-extrabold tracking-tight">New learning path</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bundle existing guides into a journey for other learners.
        </p>

        <div className="card-elev mt-6 space-y-4 rounded-2xl p-5">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="e.g. Cook 5 weeknight dinners from scratch"
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={400}
              placeholder="What will learners be able to do after finishing this path?"
              className="w-full resize-none rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Guide picker */}
        <div className="card-elev mt-6 rounded-2xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Guides in this path ({selected.length})
          </h2>
          {selected.length > 0 ? (
            <ol className="mt-3 space-y-2">
              {selected.map((g, i) => (
                <li key={g.id} className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm">
                  <span className="text-xs font-bold text-primary">{i + 1}.</span>
                  <span className="min-w-0 flex-1 truncate">{g.title}</span>
                  <button
                    type="button"
                    onClick={() => setSelected((s) => s.filter((x) => x.id !== g.id))}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Pick guides from the list below.</p>
          )}

          <div className="mt-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides to add…"
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <ul className="mt-3 max-h-72 space-y-1.5 overflow-y-auto">
              {(guideOptions.data ?? []).map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    disabled={selectedIds.has(g.id)}
                    onClick={() => setSelected((s) => [...s, { id: g.id, title: g.title }])}
                    className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50"
                  >
                    <span className="min-w-0 truncate">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {g.category}
                      </span>{" "}
                      · {g.title}
                    </span>
                    {selectedIds.has(g.id) ? (
                      <span className="text-xs text-muted-foreground">Added</span>
                    ) : (
                      <Plus className="h-4 w-4 text-primary" />
                    )}
                  </button>
                </li>
              ))}
              {guideOptions.data && guideOptions.data.length === 0 && (
                <li className="text-center text-xs text-muted-foreground">No matching guides.</li>
              )}
            </ul>
          </div>
        </div>

        <button
          type="button"
          disabled={create.isPending}
          onClick={() => create.mutate()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish path"}
        </button>
      </section>
      <BottomNav />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

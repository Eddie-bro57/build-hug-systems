import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Award, Flame, Route as RouteIcon, Sparkles, Trophy } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/creator/$handle")({
  loader: async ({ params }) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, display_name, handle, bio, avatar_url, xp, level, streak_days, reputation")
      .eq("handle", params.handle)
      .maybeSingle();
    if (error) throw error;
    if (!profile) throw notFound();

    const [guidesRes, pathsRes, achievementsRes, skillsRes] = await Promise.all([
      supabase
        .from("guides")
        .select("id, title, summary, category, difficulty, time_minutes")
        .eq("author_id", profile.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("learning_paths")
        .select("id, slug, title, description, category")
        .eq("creator_id", profile.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("user_achievements")
        .select("unlocked_at, achievement:achievements(code, title, description, icon, xp_reward)")
        .eq("user_id", profile.id)
        .order("unlocked_at", { ascending: false }),
      supabase
        .from("skill_levels")
        .select("category, xp, level")
        .eq("user_id", profile.id)
        .order("xp", { ascending: false }),
    ]);

    return {
      profile,
      guides: guidesRes.data ?? [],
      paths: pathsRes.data ?? [],
      achievements: achievementsRes.data ?? [],
      skills: skillsRes.data ?? [],
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.profile.display_name ?? loaderData.profile.handle} — DoGuide creator` },
            {
              name: "description",
              content: loaderData.profile.bio ?? `Guides and learning paths by @${loaderData.profile.handle}`,
            },
          ],
        }
      : { meta: [] },
  component: CreatorPage,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Creator not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

function CreatorPage() {
  const { profile, guides, paths, achievements, skills } = Route.useLoaderData();

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopBar />
      <section className="mx-auto max-w-4xl px-5 py-8">
        {/* Header */}
        <div className="card-elev flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
            {(profile.display_name ?? profile.handle ?? "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {profile.display_name ?? profile.handle}
            </h1>
            {profile.handle && <p className="text-sm text-muted-foreground">@{profile.handle}</p>}
            {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Stat icon={<Sparkles className="h-3.5 w-3.5" />} label={`Level ${profile.level}`} />
              <Stat icon={<Trophy className="h-3.5 w-3.5" />} label={`${profile.xp} XP`} />
              <Stat icon={<Flame className="h-3.5 w-3.5 text-amber-600" />} label={`${profile.streak_days}-day streak`} />
              <Stat icon={<Award className="h-3.5 w-3.5 text-emerald-600" />} label={`${profile.reputation} rep`} />
            </div>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Skill levels
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {skills.map((s) => (
                <div key={s.category} className="card-elev rounded-2xl p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.category}</div>
                  <div className="mt-1 flex items-end justify-between">
                    <span className="text-lg font-bold">Lv {s.level}</span>
                    <span className="text-xs text-muted-foreground">{s.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Achievements
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {achievements.map((a, i) => {
                const ach = (a as { achievement: { title: string; description: string } }).achievement;
                if (!ach) return null;
                return (
                  <div key={i} className="card-elev rounded-2xl p-3 text-center">
                    <Trophy className="mx-auto h-6 w-6 text-amber-500" />
                    <div className="mt-1 text-sm font-semibold">{ach.title}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{ach.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Guides */}
        {guides.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Guides
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {guides.map((g) => (
                <li key={g.id}>
                  <Link
                    to="/guide/$id"
                    params={{ id: g.id }}
                    className="card-elev block rounded-2xl p-4 hover:-translate-y-0.5"
                  >
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {g.category} · {g.difficulty} · {g.time_minutes} min
                    </div>
                    <div className="mt-1 font-semibold">{g.title}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{g.summary}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Learning paths */}
        {paths.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <RouteIcon className="h-4 w-4" /> Learning paths
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {paths.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/path/$slug"
                    params={{ slug: p.slug }}
                    className="card-elev block rounded-2xl p-4 hover:-translate-y-0.5"
                  >
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {p.category}
                    </div>
                    <div className="mt-1 font-semibold">{p.title}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {guides.length === 0 && paths.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            This creator hasn't published guides or paths yet.
          </div>
        )}
      </section>
      <BottomNav />
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 font-medium">
      {icon} {label}
    </span>
  );
}

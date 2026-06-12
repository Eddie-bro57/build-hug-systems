import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type XpResult = { new_xp: number; new_level: number; leveled_up: boolean } | null;

/** Award XP to the signed-in user. Silently no-ops if not signed in. */
export async function awardXp(amount: number, category?: string | null): Promise<XpResult> {
  if (amount <= 0) return null;
  const { data, error } = await supabase.rpc("award_xp", {
    _amount: amount,
    _category: category ?? undefined,
  });
  if (error) {
    console.warn("award_xp failed", error);
    return null;
  }
  const row = (data?.[0] ?? null) as XpResult;
  if (row?.leveled_up) {
    toast.success(`⭐ Level up! You're now level ${row.new_level}`, {
      description: `${row.new_xp} XP total`,
    });
  } else if (row) {
    toast(`+${amount} XP`, { description: `${row.new_xp} XP total`, duration: 2000 });
  }
  return row;
}

type AchievementRow = { id: string; code: string; title: string; xp_reward: number };

/** Re-evaluates user stats and unlocks any newly-earned achievements. */
export async function checkAchievements(userId: string): Promise<void> {
  const [profileRes, completedRes, anyStepRes, commentsRes, savesRes, pathsRes, votesRes, unlockedRes, catalogRes] =
    await Promise.all([
      supabase.from("profiles").select("level, streak_days").eq("id", userId).maybeSingle(),
      supabase
        .from("guide_progress")
        .select("guide_id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_completed", true),
      supabase.from("guide_progress").select("completed_steps").eq("user_id", userId).limit(50),
      supabase.from("comments").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("saved_guides").select("guide_id", { count: "exact", head: true }).eq("user_id", userId),
      supabase
        .from("learning_paths")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", userId)
        .eq("is_published", true),
      supabase.from("guide_votes").select("guide_id", { count: "exact", head: true }).eq("user_id", userId),
      supabase
        .from("user_achievements")
        .select("achievement:achievements(code)")
        .eq("user_id", userId),
      supabase.from("achievements").select("id, code, title, xp_reward"),
    ]);

  const unlocked = new Set(
    (unlockedRes.data ?? [])
      .map((r) => (r as { achievement: { code: string } | null }).achievement?.code)
      .filter(Boolean) as string[],
  );
  const catalog = (catalogRes.data ?? []) as AchievementRow[];

  const level = profileRes.data?.level ?? 1;
  const streak = profileRes.data?.streak_days ?? 0;
  const guidesDone = completedRes.count ?? 0;
  const anyStep = (anyStepRes.data ?? []).some(
    (r) => Array.isArray(r.completed_steps) && (r.completed_steps as unknown[]).length > 0,
  );
  const comments = commentsRes.count ?? 0;
  const saves = savesRes.count ?? 0;
  const paths = pathsRes.count ?? 0;
  const votes = votesRes.count ?? 0;

  const conditions: Record<string, boolean> = {
    first_step: anyStep || guidesDone >= 1,
    first_guide: guidesDone >= 1,
    five_guides: guidesDone >= 5,
    streak_3: streak >= 3,
    streak_7: streak >= 7,
    level_5: level >= 5,
    first_comment: comments >= 1,
    first_save: saves >= 1,
    first_path: paths >= 1,
    first_upvote: votes >= 1,
  };

  for (const ach of catalog) {
    if (unlocked.has(ach.code)) continue;
    if (!conditions[ach.code]) continue;
    const { error: insErr } = await supabase
      .from("user_achievements")
      .insert({ user_id: userId, achievement_id: ach.id });
    if (insErr) continue;
    toast.success(`🏆 ${ach.title}`, {
      description: ach.xp_reward > 0 ? `+${ach.xp_reward} XP` : "Achievement unlocked",
    });
    if (ach.xp_reward > 0) {
      await supabase.rpc("award_xp", { _amount: ach.xp_reward });
    }
  }
}

/** XP needed to reach next level under our formula: level = floor(sqrt(xp/50)) + 1. */
export function xpToNextLevel(currentXp: number, currentLevel: number): { needed: number; nextAt: number } {
  const nextAt = currentLevel * currentLevel * 50;
  return { needed: Math.max(0, nextAt - currentXp), nextAt };
}

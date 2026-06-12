import { useQuery } from "@tanstack/react-query";
import { Flame, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function XpHud() {
  const { user } = useAuth();
  const q = useQuery({
    queryKey: ["xp-hud", user?.id ?? ""],
    enabled: !!user,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("xp, level, streak_days")
        .eq("id", user!.id)
        .maybeSingle();
      return data ?? { xp: 0, level: 1, streak_days: 0 };
    },
  });

  if (!user || !q.data) return null;

  return (
    <Link
      to="/profile"
      className="hidden items-center gap-2 rounded-full border border-border bg-white/80 px-2.5 py-1 text-[11px] font-semibold shadow-sm sm:inline-flex"
      title={`${q.data.xp} XP · Level ${q.data.level} · ${q.data.streak_days}-day streak`}
    >
      <span className="inline-flex items-center gap-1 text-primary">
        <Sparkles className="h-3 w-3" /> L{q.data.level}
      </span>
      <span className="text-muted-foreground">·</span>
      <span className="inline-flex items-center gap-1 text-amber-700">
        <Flame className="h-3 w-3" /> {q.data.streak_days}
      </span>
    </Link>
  );
}

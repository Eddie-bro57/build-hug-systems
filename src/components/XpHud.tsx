import { useQuery } from "@tanstack/react-query";
import { Flame } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { xpToNextLevel } from "@/lib/gamification";

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

  const level = q.data.level;
  const xp = q.data.xp;
  
  // Calculate boundaries for the circular progress indicator
  const { needed, nextAt } = xpToNextLevel(xp, level);
  const prevAt = (level - 1) * (level - 1) * 50;
  const span = Math.max(1, nextAt - prevAt);
  const currentProgress = Math.max(0, xp - prevAt);
  const pct = Math.min(100, Math.round((currentProgress / span) * 100));

  // Circular SVG ring settings
  const radius = 9;
  const circumference = 2 * Math.PI * radius; // ~56.55
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <Link
      to="/profile"
      className="hidden items-center gap-3 rounded-full border border-border bg-white/80 pl-2 pr-3.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md transition-all hover:bg-white hover:-translate-y-0.5 sm:inline-flex"
      title={`${needed} XP to level ${level + 1} (${xp} total XP)`}
    >
      <div className="relative flex h-6 w-6 items-center justify-center" aria-hidden="true">
        {/* Progress Circle SVG */}
        <svg className="absolute h-full w-full -rotate-90">
          <circle
            cx="12"
            cy="12"
            r={radius}
            className="stroke-slate-100 fill-transparent"
            strokeWidth="2"
          />
          <circle
            cx="12"
            cy="12"
            r={radius}
            className="stroke-primary fill-transparent transition-all duration-500 ease-out"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[9px] font-bold text-slate-700">{level}</span>
      </div>
      <span className="text-[10px] text-slate-300 font-normal">|</span>
      <span className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700">
        <Flame className="h-3.5 w-3.5 fill-amber-500/20 text-amber-500 animate-pulse" />
        <span>{q.data.streak_days}d</span>
      </span>
    </Link>
  );
}

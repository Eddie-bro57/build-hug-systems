import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageCircle, ThumbsUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { awardXp, checkAchievements } from "@/lib/gamification";

type CommentRow = {
  id: string;
  body: string;
  upvotes: number;
  created_at: string;
  user_id: string;
  author: { display_name: string | null; handle: string | null; avatar_url: string | null } | null;
};

export function GuideComments({ guideId }: { guideId: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [body, setBody] = useState("");

  const comments = useQuery({
    queryKey: ["comments", guideId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, body, upvotes, created_at, user_id, author:profiles(display_name, handle, avatar_url)")
        .eq("guide_id", guideId)
        .order("upvotes", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as unknown as CommentRow[];
    },
  });

  const myVotes = useQuery({
    queryKey: ["comment-votes", guideId, user?.id ?? ""],
    enabled: !!user && !!comments.data?.length,
    queryFn: async () => {
      const ids = (comments.data ?? []).map((c) => c.id);
      if (!ids.length) return new Set<string>();
      const { data } = await supabase
        .from("comment_votes")
        .select("comment_id")
        .eq("user_id", user!.id)
        .in("comment_id", ids);
      return new Set((data ?? []).map((r) => r.comment_id));
    },
  });

  const post = useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error("Sign in to comment");
      const { error } = await supabase
        .from("comments")
        .insert({ guide_id: guideId, user_id: user.id, body: text });
      if (error) throw error;
      await awardXp(5);
      await checkAchievements(user.id);
    },
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["comments", guideId] });
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("comments").delete().eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", guideId] }),
  });

  const toggleVote = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user) throw new Error("Sign in to vote");
      const has = myVotes.data?.has(commentId);
      if (has) {
        await supabase
          .from("comment_votes")
          .delete()
          .eq("user_id", user.id)
          .eq("comment_id", commentId);
      } else {
        await supabase
          .from("comment_votes")
          .insert({ user_id: user.id, comment_id: commentId });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", guideId] });
      qc.invalidateQueries({ queryKey: ["comment-votes", guideId] });
    },
  });

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold tracking-tight">
          Comments {comments.data ? `(${comments.data.length})` : ""}
        </h2>
      </div>

      {user ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = body.trim();
            if (v) post.mutate(v);
          }}
          className="mb-4"
        >
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share a tip, a question, or how it went…"
            rows={3}
            maxLength={2000}
            className="w-full resize-none rounded-2xl border border-border bg-white p-3 text-sm outline-none focus:border-primary"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{body.length}/2000</span>
            <button
              type="submit"
              disabled={post.isPending || !body.trim()}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {post.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
            </button>
          </div>
          {post.isError && (
            <p className="mt-1 text-xs text-destructive">{(post.error as Error).message}</p>
          )}
        </form>
      ) : (
        <div className="mb-4 rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
          Sign in to join the conversation.
        </div>
      )}

      {comments.isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : comments.data && comments.data.length > 0 ? (
        <ul className="space-y-3">
          {comments.data.map((c) => {
            const voted = myVotes.data?.has(c.id);
            const name = c.author?.display_name ?? "Someone";
            return (
              <li key={c.id} className="card-elev rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      {c.author?.handle ? (
                        <Link
                          to="/creator/$handle"
                          params={{ handle: c.author.handle }}
                          className="font-semibold hover:underline"
                        >
                          {name}
                        </Link>
                      ) : (
                        <span className="font-semibold">{name}</span>
                      )}
                      <span className="text-muted-foreground">
                        · {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{c.body}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <button
                        type="button"
                        disabled={!user || toggleVote.isPending}
                        onClick={() => toggleVote.mutate(c.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
                          voted ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" /> {c.upvotes}
                      </button>
                      {user?.id === c.user_id && (
                        <button
                          type="button"
                          onClick={() => del.mutate(c.id)}
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Be the first to comment.</p>
      )}
    </section>
  );
}

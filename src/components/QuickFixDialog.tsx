import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Zap, AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { quickFix } from "@/lib/ai.functions";

export function QuickFixDialog({
  open,
  onOpenChange,
  trigger,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trigger?: ReactNode;
}) {
  const [q, setQ] = useState("");
  const call = useServerFn(quickFix);
  const mut = useMutation({
    mutationFn: (query: string) => call({ data: { query } }),
  });

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" /> QuickFix
            </DialogTitle>
            <DialogDescription>
              Get a 30-second practical answer. For full steps, use search instead.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = q.trim();
              if (v) mut.mutate(v);
            }}
            className="flex gap-2"
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. My WiFi keeps dropping…"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" disabled={mut.isPending || !q.trim()}>
              {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
            </Button>
          </form>

          {mut.isError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {(mut.error as Error).message}
            </div>
          )}

          {mut.data && (
            <div className="space-y-3">
              <p className="text-sm">{mut.data.answer}</p>
              <ul className="space-y-1 text-sm">
                {mut.data.steps.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-semibold text-primary">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              {mut.data.warning && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
                  <span>{mut.data.warning}</span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

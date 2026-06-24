import React, { useState, useEffect, useRef } from "react";
import { useRouterState, useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2, Send, Brain, Trophy, ChevronRight, HelpCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { chatWithAi } from "@/lib/ai.functions";
import { generateGuide } from "@/lib/guides.functions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CoachWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const params = useParams({ strict: false });
  const guideId = params?.id;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hi! I'm your DoGuide Coach. Ask me anything!" },
  ]);
  const [suggestedActions, setSuggestedActions] = useState<
    Array<{ type: "generate_guide" | "chat_query"; query: string; label: string }>
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [pending, setPending] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const callChat = useServerFn(chatWithAi);
  const callGenerate = useServerFn(generateGuide);

  // Fetch contextual details
  const { data: guide } = useQuery({
    queryKey: ["guide-for-coach", guideId],
    enabled: !!guideId && open,
    queryFn: async () => {
      const { data } = await supabase
        .from("guides")
        .select("title, steps")
        .eq("id", guideId!)
        .single();
      return data;
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["progress-for-coach", guideId, user?.id],
    enabled: !!guideId && !!user?.id && open,
    queryFn: async () => {
      const { data } = await supabase
        .from("guide_progress")
        .select("completed_steps")
        .eq("guide_id", guideId!)
        .eq("user_id", user!.id)
        .maybeSingle();
      return data ?? { completed_steps: [] };
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile-for-coach", user?.id],
    enabled: !!user?.id && open,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("level, xp")
        .eq("id", user!.id)
        .maybeSingle();
      return data ?? { level: 1, xp: 0 };
    },
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, pending]);

  // Refresh context-appropriate greeting when route/page changes and user hasn't typed yet
  useEffect(() => {
    if (messages.length <= 1) {
      setHasInitialized(false);
    }
  }, [pathname, guideId]);

  // Trigger contextual greeting when panel opens
  useEffect(() => {
    if (open && !hasInitialized && user) {
      setHasInitialized(true);
      setPending(true);
      callChat({
        data: {
          message: "Hello Coach!",
          history: [],
          context: {
            pathname,
            guideTitle: guide?.title,
            guideId,
            completedStepsCount: progress?.completed_steps ? (progress.completed_steps as any[]).length : 0,
            totalStepsCount: guide?.steps ? (guide.steps as any[]).length : 0,
            userXp: profile?.xp,
            userLevel: profile?.level,
          },
        },
      })
        .then((res) => {
          setMessages([{ role: "assistant", content: res.text }]);
          if (res.suggestedActions) {
            setSuggestedActions(res.suggestedActions);
          }
        })
        .catch((err) => {
          console.error("Failed to load initial coach response:", err);
        })
        .finally(() => {
          setPending(false);
        });
    }
  }, [open, hasInitialized, user, pathname, guideId, guide, progress, profile]);

  const generateMutation = useMutation({
    mutationFn: async (topic: string) => {
      const out = await callGenerate({ data: { query: topic } });
      return out;
    },
    onSuccess: (out, topic) => {
      if (out?.id) {
        toast.success(`Generated guide for "${topic}"!`);
        setOpen(false);
        navigate({ to: "/guide/$id", params: { id: out.id } });
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not generate guide. Please try again.");
    },
  });

  const sendMessage = async (text: string) => {
    if (!text.trim() || pending) return;
    const userText = text.trim();
    setInputValue("");
    setPending(true);

    const userMessage = { role: "user" as const, content: userText };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await callChat({
        data: {
          message: userText,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          context: {
            pathname,
            guideTitle: guide?.title,
            guideId,
            completedStepsCount: progress?.completed_steps ? (progress.completed_steps as any[]).length : 0,
            totalStepsCount: guide?.steps ? (guide.steps as any[]).length : 0,
            userXp: profile?.xp,
            userLevel: profile?.level,
          },
        },
      });

      setMessages((prev) => [...prev, { role: "assistant", content: response.text }]);
      if (response.suggestedActions) {
        setSuggestedActions(response.suggestedActions);
      } else {
        setSuggestedActions([]);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to send message to Coach.");
    } finally {
      setPending(false);
    }
  };

  const handleSuggestedAction = (action: typeof suggestedActions[number]) => {
    if (action.type === "generate_guide") {
      generateMutation.mutate(action.query);
    } else {
      sendMessage(action.query);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed z-40 flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 select-none
          right-4 bottom-20 md:right-8 md:bottom-8 px-4 py-3 md:px-5 md:py-3.5"
        title="Chat with DoGuide Coach"
      >
        <Sparkles className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
        <span className="text-xs font-bold md:text-sm tracking-wide">Coach</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
        </span>
      </button>

      {/* Slide-over Sidebar Panel */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-slate-50/95 backdrop-blur-xl border-l border-white/20 shadow-2xl">
          {/* Header */}
          <SheetHeader className="p-4 bg-white border-b border-slate-100 flex flex-row items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-white shadow-md">
              <Brain className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <SheetTitle className="text-base font-extrabold text-slate-800 flex items-center gap-1.5 leading-none">
                DoGuide Coach <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">AI</span>
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Your practical learning mentor
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* Guide Generation Loader Overlay */}
          {generateMutation.isPending && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-4 animate-bounce">
                <Brain className="h-8 w-8 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg">Drafting your Guide</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
                Gemini is researching, structuring, and verifying steps for "{generateMutation.variables}"...
              </p>
              <div className="mt-6 flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-2xl text-xs font-semibold">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Takes about 5 seconds</span>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-start gap-2 max-w-[85%]">
                      {!isUser && (
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-primary to-amber-500 text-white flex items-center justify-center shadow shrink-0 text-xs mt-0.5 font-bold">
                          C
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          isUser
                            ? "bg-primary text-white rounded-tr-sm shadow-[0_4px_12px_rgba(255,111,97,0.15)]"
                            : "bg-white text-slate-800 border border-slate-100 rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap font-sans text-sm">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {pending && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-primary to-amber-500 text-white flex items-center justify-center shadow shrink-0 text-xs mt-0.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    </div>
                    <div className="rounded-2xl bg-white border border-slate-100 px-3.5 py-2.5 rounded-tl-sm shadow-sm">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Suggested Actions panel */}
          {suggestedActions.length > 0 && !pending && (
            <div className="p-3 bg-white/50 border-t border-slate-100">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                Suggested Actions
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {suggestedActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedAction(action)}
                    className="inline-flex items-center gap-1 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-primary px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-primary shadow-sm hover:shadow transition"
                  >
                    {action.type === "generate_guide" ? (
                      <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-primary" />
                    )}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputValue);
            }}
            className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center"
          >
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask coach for tips, troubleshooting..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              disabled={pending}
            />
            <Button
              type="submit"
              disabled={pending || !inputValue.trim()}
              size="icon"
              className="rounded-xl h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 text-white shadow shadow-primary/10 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

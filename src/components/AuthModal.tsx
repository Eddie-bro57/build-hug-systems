import { useState } from "react";
import { z } from "zod";
import { Loader2, Mail, Lock, User as UserIcon, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const signUpSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be 60 characters or fewer"),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or fewer"),
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Enter your password").max(72),
});

type Mode = "signup" | "signin";

export function AuthModal({
  open,
  onOpenChange,
  defaultMode = "signup",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const reset = () => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    setError(null);
    setInfo(null);
    setSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const parsed = signUpSchema.safeParse({ displayName, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input");
      return;
    }
    setSubmitting(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: parsed.data.displayName },
      },
    });
    setSubmitting(false);
    if (err) {
      setSubmitting(false);
      setError(err.message);
      return;
    }
    if (data.session) {
      setSubmitting(false);
      onOpenChange(false);
      reset();
      toast.success("Account created and signed in!");
    } else {
      // Auto-confirm database trigger allows us to log in immediately with email & password!
      try {
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        setSubmitting(false);
        if (signInErr) {
          setError(signInErr.message);
          return;
        }
        if (signInData.session) {
          onOpenChange(false);
          reset();
          toast.success("Account created and signed in!");
        } else {
          setInfo("Account created! Please switch to the Sign In tab to sign in.");
        }
      } catch (e: any) {
        setSubmitting(false);
        setError(e.message || "Failed to log in automatically.");
      }
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input");
      return;
    }
    setSubmitting(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to DoGuide</DialogTitle>
          <DialogDescription>
            Create an account to save guides, track recents, and pick up where you left off.
          </DialogDescription>
        </DialogHeader>

        {/* Demo credentials box for presentation purposes */}
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200/50 p-3 text-center">
          <p className="text-xs text-amber-800 font-semibold mb-2">
            Presentation Mode: Use demo credentials below
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setEmail("demo@doguide.com");
                setPassword("password123");
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm cursor-pointer"
            >
              Autofill Demo
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={async () => {
                setSubmitting(true);
                setError(null);
                setInfo(null);
                
                // Try logging in
                const { error: signInErr } = await supabase.auth.signInWithPassword({
                  email: "demo@doguide.com",
                  password: "password123",
                });
                
                if (signInErr) {
                  // If sign in fails, attempt to sign up the demo user
                  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
                    email: "demo@doguide.com",
                    password: "password123",
                    options: {
                      data: { display_name: "Demo Presenter" },
                    },
                  });
                  
                  if (signUpErr) {
                    setError(`Demo sign-in failed. Tried auto-creating the account, but that failed too: ${signUpErr.message}`);
                    setSubmitting(false);
                    return;
                  }
                  
                  if (signUpData.session) {
                    onOpenChange(false);
                    reset();
                  } else {
                    setInfo("Demo account auto-created! Please check credentials or sign in manually.");
                  }
                } else {
                  onOpenChange(false);
                  reset();
                }
                setSubmitting(false);
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm cursor-pointer"
            >
              {submitting ? "Signing in..." : "1-Click Demo Login"}
            </button>
          </div>
        </div>

        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(v as Mode);
            setError(null);
            setInfo(null);
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign up</TabsTrigger>
            <TabsTrigger value="signin">Sign in</TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="su-name">Display name</Label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="su-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    maxLength={60}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="su-email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="su-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={255}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="su-password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="su-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              {info && (
                <p className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> {info}
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create account
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By signing up you agree to our terms and privacy policy.
              </p>
            </form>
          </TabsContent>

          <TabsContent value="signin" className="mt-4">
            <form onSubmit={handleSignIn} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="si-email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="si-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={255}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="si-password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="si-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    autoComplete="current-password"
                    maxLength={72}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

import { ReactNode } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnauthenticatedBlockProps {
  title: string;
  description: string;
  icon?: ReactNode;
  onSignIn: () => void;
}

export function UnauthenticatedBlock({
  title,
  description,
  icon,
  onSignIn,
}: UnauthenticatedBlockProps) {
  return (
    <div className="card-elev mx-auto my-12 max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 shadow-sm">
        {icon || <Lock className="h-8 w-8" />}
      </div>
      <h2 className="text-xl font-extrabold tracking-tight text-foreground">{title}</h2>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
      
      <div className="mt-8 flex flex-col gap-3">
        <Button
          onClick={onSignIn}
          className="w-full rounded-xl bg-primary py-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
        >
          Sign In or Sign Up
        </Button>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Browse public guides <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Sparkles } from "lucide-react";

export function SearchBar({
  category,
  placeholder,
  autoFocus,
  size = "md",
}: {
  category?: string;
  placeholder?: string;
  autoFocus?: boolean;
  size?: "md" | "lg";
}) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate({
      to: "/search",
      search: { q: query, ...(category ? { c: category } : {}) },
    });
  };

  const big = size === "lg";

  return (
    <form
      onSubmit={onSubmit}
      className={`card-elev flex items-center gap-2 rounded-2xl ${big ? "p-2 pl-5" : "p-1.5 pl-4"}`}
    >
      <Search className={`text-muted-foreground ${big ? "h-5 w-5" : "h-4 w-4"}`} />
      <input
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder ?? "How do I…?"}
        className={`flex-1 bg-transparent outline-none placeholder:text-muted-foreground ${big ? "text-lg py-3" : "text-base py-2"}`}
      />
      <button
        type="submit"
        className={`inline-flex items-center gap-1.5 rounded-xl bg-primary font-medium text-primary-foreground transition hover:opacity-90 ${big ? "px-5 py-3 text-base" : "px-4 py-2 text-sm"}`}
      >
        <Sparkles className="h-4 w-4" />
        Guide me
      </button>
    </form>
  );
}

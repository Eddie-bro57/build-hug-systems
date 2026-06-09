import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookmarkX, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { useFavorites } from "@/lib/storage";
import { getCategory } from "@/lib/categories";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved guides — DoGuide" },
      { name: "description", content: "Your saved step-by-step guides on DoGuide." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { favorites, remove } = useFavorites();

  return (
    <div>
      <Header />
      <section className="mx-auto max-w-4xl px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <h1 className="mt-4 flex items-center gap-2 text-3xl font-extrabold tracking-tight">
          <Heart className="h-7 w-7 text-rose-500" /> Saved guides
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quickly jump back into guides you've bookmarked.
        </p>

        {favorites.length === 0 ? (
          <div className="card-elev mt-8 rounded-2xl p-10 text-center">
            <div className="text-4xl">🔖</div>
            <p className="mt-3 text-sm text-muted-foreground">
              You haven't saved anything yet. Open a guide and tap the heart to save it.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Browse categories
            </Link>
          </div>
        ) : (
          <ul className="mt-6 grid gap-3">
            {favorites.map((f) => {
              const cat = f.c ? getCategory(f.c) : undefined;
              return (
                <li
                  key={`${f.q}|${f.c ?? ""}`}
                  className="card-elev flex items-center justify-between gap-4 rounded-2xl p-4"
                >
                  <Link
                    to="/guide"
                    search={{ q: f.q, ...(f.c ? { c: f.c } : {}) }}
                    className="min-w-0 flex-1"
                  >
                    <div className="truncate font-semibold">{f.title ?? f.q}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {cat ? `${cat.emoji} ${cat.name} • ` : ""}
                      Saved {new Date(f.savedAt).toLocaleDateString()}
                    </div>
                  </Link>
                  <button
                    onClick={() => remove({ q: f.q, c: f.c })}
                    aria-label="Remove from saved"
                    className="rounded-xl border border-border bg-white p-2 text-muted-foreground hover:text-rose-600"
                  >
                    <BookmarkX className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
